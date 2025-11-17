import { useCallback, useEffect, useRef, useState } from "react";

import { useSlideRuleStore } from "@/stores/slideRuleStore";
import type { CalculateSlideRuleEvent } from "@/types/customEvents";
import { slideRuleApi } from "@/components/bridges/SlideRuleBridge.tsx";

const getCanvasScale = (showSquareScale: boolean) => ({
  OUTER_RADIUS: showSquareScale ? 0.35 : 0.45,
  INNER_RADIUS: showSquareScale ? 0.25 : 0.35,
  EXTERNAL_RADIUS: 0.48, // Increased to make room for labels inside the ring
  TICK_MAJOR: 0.025,
  TICK_MINOR: 0.015,
  TEXT_OFFSET_OUTER: 0.04,
  TEXT_OFFSET_INNER: 0.07,
  TEXT_OFFSET_EXTERNAL: 0.06, // Reduced to fit better
  TEXT_OFFSET_CUBE: 0.07, // Position for cube labels (x³) - moved much further outside the main ring
  CENTER_DOT: 0.02,
  BORDER_OFFSET: 0.03, // Reduced to give more space
  GUIDE_EXTEND: 0.05,
  GUIDE_TEXT_OFFSET: 0.08, // Reduced to fit within canvas
  TEXT_SIZE: 0.04,
  TEXT_HIGHLIGHT_SIZE: 0.05,
  GUIDE_TEXT_SIZE: 0.05,
  TICK_MAJOR_EXTENSION_FACTOR: 1.02,
});

interface SizeRefType {
  size: number;
  center: { x: number; y: number };
  outerRadius: number;
  innerRadius: number;
  externalRadius: number;
  innerRotation: number;
}

// Normalize angles to 0-2π range
const normalizeAngle = (angle) => {
  let normalized = angle % (2 * Math.PI);
  if (normalized < 0) normalized += 2 * Math.PI;
  return normalized;
};

const calculateValueForAngleAndDecade = (angle, decadeLevel) => {
  // Get base value (1-10 range) from angle
  let normalizedAngle = angle % (2 * Math.PI);
  if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;
  const logValue = normalizedAngle / (2 * Math.PI);
  const baseValue = Math.pow(10, logValue);

  if (decadeLevel === 0) {
    return baseValue;
  }
  return baseValue * Math.pow(10, decadeLevel);
};

const getDecimalPlaces = (decadeLevel) => {
  if (decadeLevel >= 0) {
    return 1; // For levels 0 and above, 1 decimal place is sufficient
  } else {
    return Math.abs(decadeLevel) + 1;
  }
};

const detectDecadeBoundaryCrossing = (currentAngle, previousAngle) => {
  const angleDelta = previousAngle - currentAngle;

  const RADIAN = Math.PI;

  // // Check for forward crossing (9.x+ → 1.x)
  if (angleDelta > RADIAN) {
    return 1; // Increase decade
  }

  // Check for backward crossing (1.x → 9.x+)
  if (angleDelta < -RADIAN) {
    return -1; // Decrease decade
  }

  return 0; // No crossing
};

interface SlideRuleCalculatorProps {
  children?: React.ReactNode;
  showSquareScale?: boolean;
}

const SlideRuleCalculator = ({ children, showSquareScale = false }: SlideRuleCalculatorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const CANVAS_SCALE = getCanvasScale(showSquareScale);

  // Use Zustand store instead of local state
  const {
    userValueA: valueA,
    userValueB: valueB,
    snapToIntegers,
    setUserValueA,
    setSnapToIntegers,
    setUserValueB,
    showResultAt,
    highlightNumberOnInnerDisk,
    highlightNumberOnOuterDisk,
  } = useSlideRuleStore();

  const [result, setResult] = useState<string | null>(null);
  const [actualResult, setActualResult] = useState<string | null>(null);
  const [decadeLevel, setDecadeLevel] = useState(0); // Current decade level: 1=1-9.9, 2=10-99, 3=100-999, etc.

  const animationFrameRef = useRef<number | null>(null);
  const sizeRef = useRef<Partial<SizeRefType>>({}); // Stores canvas dimensions and radii
  const innerRotationRef = useRef(0); // Current rotation of the inner disk
  const targetRotationRef = useRef(0); // Target rotation for animation
  const isDraggingRef = useRef(false); // Flag for drag state
  const dragStartAngleRef = useRef(0); // Angle where drag started
  const previousAngleRef = useRef(0); // Track previous angle for boundary detection

  // Audio context and sound tracking for click sounds
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastSoundPositionRef = useRef(0); // Track last position where sound was played
  const SOUND_INTERVAL = 0.1; // Play sound every 0.1 radians

  // Guides for calculated values A and B (for the "Calculate" button functionality)
  const guidesRef = useRef({
    guideA: { show: false, angle: 0 }, // Green guide for value A on outer scale
    guideB: { show: false, angle: 0 }, // Pink guide for value B on inner scale
  });

  // Initialize audio context
  const initializeAudio = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn("Web Audio API not supported:", error);
      }
    }
  }, []);

  // Generate a simple click sound
  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/click-sound.mp3");
      audio.volume = 0.3; // Adjust volume as needed
      audio.play().catch((error) => {
        console.warn("Error playing click sound:", error);
      });
    } catch (error) {
      console.warn("Error creating audio element:", error);
    }
  }, []);

  // Check if we should play a click sound based on rotation
  const checkAndPlayClickSound = useCallback(
    (currentRotation: number) => {
      const rotationDiff = Math.abs(currentRotation - lastSoundPositionRef.current);

      if (rotationDiff >= SOUND_INTERVAL) {
        // Calculate how many intervals we've crossed
        const intervals = Math.floor(rotationDiff / SOUND_INTERVAL);

        // Update the last sound position to the nearest interval
        lastSoundPositionRef.current +=
          intervals * SOUND_INTERVAL * Math.sign(currentRotation - lastSoundPositionRef.current);

        // Play the click sound
        playClickSound();
      }
    },
    [playClickSound]
  );

  // --- Logarithmic Scale Utility Functions ---
  // Given a value (1-10), returns its angle on the logarithmic scale (0 to 2*PI)
  const getAngleForValue = useCallback((value) => {
    // Ensure value is positive and within 1-10 range for logarithmic mapping
    // If value is 1, log10(1) is 0, so angle is 0.
    // If value is 10, log10(10) is 1, so angle is 2*PI.
    // This correctly maps 1-10 across a full circle.
    if (value <= 0) {
      console.warn(`Invalid value for getAngleForValue: ${value}. Using 1 instead.`);
      return 0;
    }
    if (value > 10) {
      console.warn(`Value ${value} is greater than 10. Wrapping to range 1-10.`);
    }
    // Using (logValue % 1) ensures values like 10, 100, etc., wrap around to 0
    // effectively representing the C or D scale where 1 and 10 are at the same mark.
    const logValue = Math.log10(value);
    return (logValue % 1) * 2 * Math.PI;
  }, []);

  // Given an angle and an optional rotation offset, returns the value on the logarithmic scale
  const getValueForAngle = useCallback(
    (angle, rotationOffset = 0) => {
      const adjustedAngle = angle - rotationOffset;
      return calculateValueForAngleAndDecade(adjustedAngle, decadeLevel);
    },
    [decadeLevel]
  );

  // --- Drawing Functions ---
  const drawScale = useCallback(
    (ctx, radius, isInner = false, currentDecadeLevel = decadeLevel) => {
      const { center, size, innerRotation } = sizeRef.current;

      ctx.font = `bold ${size * CANVAS_SCALE.TEXT_SIZE}px 'Space Mono'`;

      ctx.save(); // Save context before translation/rotation
      ctx.translate(center.x, center.y); // Move origin to center of canvas
      if (isInner) {
        ctx.rotate(innerRotation); // Apply inner disk rotation
      }

      // Draw major ticks (1-10)
      for (let i = 1; i <= 9; i++) {
        const angle = getAngleForValue(i);

        // Draw Tick
        ctx.save(); // Save context before rotating for the tick
        ctx.rotate(angle); // Rotate to the tick's position
        ctx.beginPath();
        ctx.moveTo(radius - size * CANVAS_SCALE.TICK_MAJOR, 0);
        ctx.lineTo(radius + size * CANVAS_SCALE.TICK_MAJOR * CANVAS_SCALE.TICK_MAJOR_EXTENSION_FACTOR, 0);
        ctx.strokeStyle = "#a78bfa"; // Purple ticks
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore(); // Restore context to original rotation for numbers

        // Draw Number
        // Position the text slightly inside the radius
        const textRadius = isInner
          ? radius - size * CANVAS_SCALE.TEXT_OFFSET_INNER
          : radius - size * CANVAS_SCALE.TEXT_OFFSET_OUTER;
        const textX = textRadius * Math.cos(angle);
        const textY = textRadius * Math.sin(angle);

        if (isInner && i === 1) {
          ctx.fillStyle = "#f83999";
          ctx.font = `bold ${size * CANVAS_SCALE.TEXT_HIGHLIGHT_SIZE}px 'Space Mono'`;
        } else if (isInner) {
          ctx.fillStyle = "#ec4899";
          ctx.font = `bold ${size * CANVAS_SCALE.TEXT_SIZE}px 'Space Mono'`;
        } else {
          ctx.fillStyle = "#22c55e";
          ctx.font = `bold ${size * CANVAS_SCALE.TEXT_SIZE}px 'Space Mono'`;
        }

        const highlightColor = "#fffa00"; // yellow

        if (!isInner && showResultAt === i) {
          ctx.fillStyle = highlightColor;
          ctx.font = `bold ${size * CANVAS_SCALE.TEXT_HIGHLIGHT_SIZE}px 'Space Mono'`;
        }

        if (!isInner && highlightNumberOnOuterDisk === i) {
          ctx.fillStyle = highlightColor;
          ctx.font = `bold ${size * CANVAS_SCALE.TEXT_HIGHLIGHT_SIZE}px 'Space Mono'`;
        }

        if (isInner && highlightNumberOnInnerDisk === i) {
          ctx.fillStyle = highlightColor;
          ctx.font = `bold ${size * CANVAS_SCALE.TEXT_HIGHLIGHT_SIZE}px 'Space Mono'`;
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.save(); // Save for text translation/rotation
        ctx.translate(textX, textY); // Move to text position
        if (isInner) {
          ctx.rotate(-innerRotation); // Counter-rotate text so it remains upright
        }
        // Calculate what number to display based on decade level
        let displayText;
        const actualValue = i === 10 ? 1 : i; // Convert 10 back to 1 for calculations
        const multiplier = Math.pow(10, currentDecadeLevel);
        const value = actualValue * multiplier;

        if (currentDecadeLevel === 0) {
          displayText = i === 10 ? "1" : String(i);
        } else if (currentDecadeLevel === -1 || currentDecadeLevel === -2) {
          displayText = value.toFixed(Math.abs(currentDecadeLevel));
        } else if (currentDecadeLevel < -2 || currentDecadeLevel >= 3) {
          displayText = value.toExponential(0).replace("+", "");
        } else {
          // currentDecadeLevel is 1 or 2
          displayText = String(value);
        }

        ctx.fillText(displayText, 0, 0);
        ctx.restore(); // Restore after text drawing
      }

      // Draw minor ticks (e.g., between 1.1 and 9.9)
      for (let i = 11; i < 100; i++) {
        const angle = getAngleForValue(i / 10); // Calculate angle for 1.1, 1.2, etc.
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(radius - size * CANVAS_SCALE.TICK_MINOR, 0);
        ctx.lineTo(radius, 0); // Minor ticks are shorter
        ctx.strokeStyle = "#5eead4"; // Cyan ticks
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore(); // Restore context from initial translation/rotation
    },
    [getAngleForValue, decadeLevel, showResultAt, highlightNumberOnOuterDisk, highlightNumberOnInnerDisk]
  );

  const drawSquareScale = useCallback(
    (ctx, radius, currentDecadeLevel = decadeLevel) => {
      const { center, size } = sizeRef.current;

      ctx.save();
      ctx.translate(center.x, center.y);

      // const squareScaleColor = "#fbbf24"; // Amber for external x² scale, initial idea, but it's not visible on the background
      const squareScaleColor = "#0000ff"; // blue for external x² scale

      const enableMinorTicks = true;

      // Draw major ticks for squares (1², 2², 3², 4², 5²)
      for (let i = 1; i <= 9; i++) {
        const angle = getAngleForValue(i);

        // Draw Tick
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(radius - size * CANVAS_SCALE.TICK_MAJOR, 0);
        ctx.lineTo(radius + size * CANVAS_SCALE.TICK_MAJOR * CANVAS_SCALE.TICK_MAJOR_EXTENSION_FACTOR, 0);
        ctx.strokeStyle = squareScaleColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // Draw Number
        const textRadius = radius - size * CANVAS_SCALE.TEXT_OFFSET_EXTERNAL;
        const textX = textRadius * Math.cos(angle);
        const textY = textRadius * Math.sin(angle);

        ctx.fillStyle = squareScaleColor;
        ctx.font = `bold ${size * CANVAS_SCALE.TEXT_SIZE}px 'Space Mono'`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        let displayText;
        const multiplier = Math.pow(10, currentDecadeLevel); // based on current decade (power of 10 on the scale)
        const value = i * multiplier;
        const squaredValue = value ** 2;

        if (currentDecadeLevel === 0 || currentDecadeLevel === 1) {
          displayText = String(squaredValue);
        } else if (currentDecadeLevel === -1) {
          displayText = squaredValue.toFixed(2);
        } else {
          // Covers currentDecadeLevel < -1 or >= 2
          displayText = squaredValue.toExponential(0).replace("+", "");
        }

        ctx.save();
        ctx.translate(textX, textY);

        // PINGWING simple version, without any scientific notation
        // ctx.fillText(`${(i * 10 ** currentDecadeLevel) ** 2}`, 0, 0);

        ctx.fillText(displayText, 0, 0);
        ctx.restore();
      }

      // Draw minor ticks (e.g., between 1.1 and 9.9)
      if (enableMinorTicks) {
        for (let i = 11; i < 100; i++) {
          const angle = getAngleForValue(i / 10); // Calculate angle for 1.1, 1.2, etc.
          ctx.save();
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(radius - size * CANVAS_SCALE.TICK_MINOR, 0);
          ctx.lineTo(radius, 0); // Minor ticks are shorter
          ctx.strokeStyle = squareScaleColor;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
        }
      }

      ctx.restore();
    },
    [getAngleForValue, decadeLevel]
  );

  const drawCubeLabels = useCallback(
    (ctx, radius, currentDecadeLevel = decadeLevel) => {
      const { center, size } = sizeRef.current;

      ctx.save();
      ctx.translate(center.x, center.y);

      const cubeScaleColor = "#0000FF";

      // Draw text labels for cubes (1³, 2³, 3³, 4³, 5³, 6³, 7³, 8³, 9³)
      for (let i = 1; i <= 9; i++) {
        const angle = getAngleForValue(i);

        // Position text further outside than square labels
        const textRadius = radius + size * CANVAS_SCALE.TEXT_OFFSET_CUBE;
        const textX = textRadius * Math.cos(angle);
        const textY = textRadius * Math.sin(angle);

        ctx.fillStyle = cubeScaleColor;
        ctx.font = `bold ${size * CANVAS_SCALE.TEXT_SIZE}px 'Space Mono'`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        let displayText;
        const multiplier = Math.pow(10, currentDecadeLevel);
        const value = i * multiplier;
        const cubedValue = value ** 3;

        if (currentDecadeLevel === 0) {
          displayText = String(cubedValue);
        } else if (currentDecadeLevel === -1) {
          displayText = cubedValue.toFixed(3);
        } else if (currentDecadeLevel < -1 || currentDecadeLevel >= 2) {
          displayText = cubedValue.toExponential(0).replace("+", "");
        } else {
          // currentDecadeLevel is 1
          displayText = String(cubedValue);
        }

        ctx.save();
        ctx.translate(textX, textY);
        ctx.fillText(displayText, 0, 0);
        ctx.restore();
      }

      ctx.restore();
    },
    [getAngleForValue, decadeLevel]
  );

  const drawGuideLine = useCallback((ctx, guide, color, textLabel, onInner = false) => {
    const { center, size, externalRadius, innerRotation } = sizeRef.current;
    if (!guide.show) return; // Only draw if guide is active

    ctx.font = `bold ${size * CANVAS_SCALE.TEXT_SIZE}px 'Space Mono'`;

    ctx.save();
    ctx.translate(center.x, center.y); // Move origin to center

    let totalAngle = guide.angle;
    if (onInner) {
      // If the guide is on the inner scale, its effective angle is influenced by innerRotation
      totalAngle += innerRotation;
    }
    ctx.rotate(totalAngle); // Rotate to the guide's position

    ctx.beginPath();
    ctx.moveTo(0, 0); // Start from center
    ctx.lineTo(externalRadius + size * CANVAS_SCALE.GUIDE_EXTEND, 0); // Draw line outwards beyond external ring
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 4]); // Dashed line
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // Draw text label for the guide
    ctx.rotate(-totalAngle); // Counter-rotate text for upright display

    if (totalAngle > Math.PI / 2 && totalAngle < (3 * Math.PI) / 2) {
      ctx.textBaseline = "bottom";
    } else {
      ctx.textBaseline = "top";
    }

    const textX = (externalRadius + size * CANVAS_SCALE.GUIDE_TEXT_OFFSET) * Math.cos(totalAngle);
    const textY = (externalRadius + size * CANVAS_SCALE.GUIDE_TEXT_OFFSET) * Math.sin(totalAngle);

    ctx.fillStyle = color;
    ctx.font = `bold ${size * CANVAS_SCALE.GUIDE_TEXT_SIZE}px 'Space Mono'`;

    ctx.fillText(textLabel, textX, textY);

    ctx.restore();
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const { size, center, outerRadius, innerRadius, innerRotation, externalRadius } = sizeRef.current;
    const { guideA, guideB } = guidesRef.current;

    ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1)); // Clear entire canvas

    // Draw external dark circle background (larger to accommodate x² scale)
    if (showSquareScale) {
      ctx.beginPath();
      ctx.arc(center.x, center.y, externalRadius + size * CANVAS_SCALE.BORDER_OFFSET, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(23, 37, 82, 0.3)"; // Dark blue with transparency
      ctx.fill();
      ctx.strokeStyle = "#1e293b"; // Border color
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw outer circle background
    ctx.beginPath();
    ctx.arc(center.x, center.y, outerRadius + size * CANVAS_SCALE.BORDER_OFFSET, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(23, 37, 82, 0.5)"; // Dark blue with transparency
    ctx.fill();
    ctx.strokeStyle = "#1e293b"; // Border color
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw inner rotating circle background
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate(innerRotation); // Apply rotation to inner circle background
    ctx.beginPath();
    ctx.arc(0, 0, innerRadius - size * CANVAS_SCALE.BORDER_OFFSET, 0, 2 * Math.PI);
    ctx.fillStyle = "#334155"; // Gray-blue
    ctx.fill();
    ctx.strokeStyle = "#1e293b";
    ctx.stroke();
    ctx.restore();

    // Draw scales
    if (showSquareScale) {
      drawSquareScale(ctx, externalRadius); // x² scale on external ring
      drawCubeLabels(ctx, externalRadius); // x³ labels on external ring
    }
    drawScale(ctx, outerRadius, false); // Outer (fixed) scale
    drawScale(ctx, innerRadius, true); // Inner (rotating) scale

    // Draw center dot
    ctx.beginPath();
    ctx.arc(center.x, center.y, size * CANVAS_SCALE.CENTER_DOT, 0, 2 * Math.PI);
    ctx.fillStyle = "#94a3b8"; // Light gray
    ctx.fill();

    // Draw guide lines for A and B values when calculated
    drawGuideLine(ctx, guideA, "#22c55e", "A"); // Green guide on outer scale
    drawGuideLine(ctx, guideB, "#ec4899", "B", true); // Pink guide on inner scale (rotates with inner disk)
  }, [drawScale, drawGuideLine, drawSquareScale, drawCubeLabels, showSquareScale]); // Dependencies for useCallback

  // const setTimeout = (miliseconds: number) => return new Promise(resolve =>)
  const wait = (milliseconds: number) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  // Animation loop for smooth rotation
  const animate = useCallback(
    async (innerValueB: number = valueB, isCalculating: boolean = false) => {
      const valueB = innerValueB;

      // Only wait when we're doing a calculation, not for simple input changes
      if (isCalculating) {
        await wait(1000);
      }

      const diff = targetRotationRef.current - innerRotationRef.current;
      if (Math.abs(diff) > 0.001) {
        // If difference is significant enough
        innerRotationRef.current += diff * 0.1; // Smoothly move towards target
        sizeRef.current.innerRotation = innerRotationRef.current;

        // Play click sound during animation
        checkAndPlayClickSound(innerRotationRef.current);

        draw(); // Redraw with new rotation
        animationFrameRef.current = requestAnimationFrame(() => animate(valueB, isCalculating)); // Continue animation
      } else {
        // Animation nearly complete, snap to target and finalize result
        innerRotationRef.current = targetRotationRef.current;
        sizeRef.current.innerRotation = innerRotationRef.current;
        draw(); // Final redraw
        animationFrameRef.current = null;

        // When the animation settles, calculate the result for A x B (only if this was a calculation)
        if (isCalculating && guidesRef.current.guideB.show) {
          // The core slide rule calculation for A x B
          // log(A*B) = log(A) + log(B)
          // So, angle for A*B = angle for A + angle for B
          const resultAngle = getAngleForValue(valueA) + getAngleForValue(valueB);
          // const resultValue = getValueForAngle(resultAngle);

          console.log("271: valueA BANG!", valueA);
          console.log("272: valueB BANG!", valueB);
          const resultValue = valueA * valueB;

          setResult(resultValue.toFixed(2));
          setActualResult((valueA * valueB).toFixed(2));
        }
      }
    },
    [draw, valueA, valueB, getAngleForValue, getValueForAngle, setResult, setActualResult, checkAndPlayClickSound]
  );

  // Handler for the "Calculate" button
  const handleCalculate = useCallback(
    (innerValueB: number = valueB) => {
      const valueB = innerValueB;
      console.log("234: valueA BANG!", valueA);
      console.log("235: valueB BANG!", valueB);

      if (valueA <= 0 || valueB <= 0) {
        setResult("error");
        // Hide guides if input is invalid
        guidesRef.current.guideA.show = false;
        guidesRef.current.guideB.show = false;
        draw();
        return;
      }

      // Set guide positions for calculation visualization
      guidesRef.current.guideA.angle = getAngleForValue(valueA);
      guidesRef.current.guideA.show = true;

      // The guideB represents the value B on the inner scale.
      // Its angle is relative to the inner scale's start.
      guidesRef.current.guideB.angle = getAngleForValue(valueB);
      guidesRef.current.guideB.show = true;

      // The inner disk needs to rotate such that the '1' of the inner disk
      // aligns with the value 'A' on the outer disk.
      // If '1' is at 0, and 'A' is at angle(A), then inner disk rotates by angle(A)
      // to bring inner '1' to outer 'A'.
      targetRotationRef.current = getAngleForValue(valueA); // Target rotation for inner disk
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      animate(valueB, true); // Start animation with calculation flag
    },
    [valueA, valueB, getAngleForValue, draw, animate]
  ); // Dependencies for useCallback

  // Wrapper for button click to handle mouse event
  const handleCalculateClick = useCallback(() => {
    handleCalculate(valueB);
  }, [handleCalculate, valueB]);

  // Canvas setup and resize handling
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1; // Get device pixel ratio for sharp rendering
    const rect = container.getBoundingClientRect();
    const minDim = Math.min(rect.width, rect.height); // Use smaller dimension for square canvas

    canvas.width = minDim * dpr;
    canvas.height = minDim * dpr;
    canvas.style.width = `${minDim}px`;
    canvas.style.height = `${minDim}px`;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr); // Scale context for high-DPI displays

    ctx.font = `bold ${minDim * CANVAS_SCALE.TEXT_SIZE}px 'Space Mono'`;

    // Calculate effective size with padding for external ring content
    const padding = minDim * 0.17; // Increased padding to accommodate cube labels positioned outside the ring
    const size = minDim - padding;
    const center = { x: minDim / 2, y: minDim / 2 }; // Center in full canvas
    const outerRadius = size * CANVAS_SCALE.OUTER_RADIUS;
    const innerRadius = size * CANVAS_SCALE.INNER_RADIUS;
    const externalRadius = size * CANVAS_SCALE.EXTERNAL_RADIUS;

    sizeRef.current = {
      size,
      center,
      outerRadius,
      innerRadius,
      innerRotation: innerRotationRef.current, // Update current rotation in sizeRef
      externalRadius,
    };

    setTimeout(() => {
      draw();
    }, 250);
  }, [draw]);

  function getUpdatedDecadeLevel() {
    let currentDecadeLevel = decadeLevel; // Start with current decade level
    if (innerRotationRef.current === previousAngleRef.current) {
      return currentDecadeLevel;
    }

    const crossing = detectDecadeBoundaryCrossing(innerRotationRef.current, previousAngleRef.current);
    if (crossing !== 0) {
      const newDecadeLevel = decadeLevel + crossing; // Allow negative decade levels for fractional values
      setDecadeLevel(newDecadeLevel);
      currentDecadeLevel = newDecadeLevel; // Use the new decade level for immediate calculation
    }

    return currentDecadeLevel;
  }

  // --- Mouse Event Handlers for Dragging ---
  useEffect(() => {
    const handleMouseDown = (e) => {
      // Initialize audio context on first user interaction
      initializeAudio();

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const { center, innerRadius, outerRadius, size } = sizeRef.current;

      const dx = x - center.x;
      const dy = y - center.y;
      const distSq = dx * dx + dy * dy;
      const distance = Math.sqrt(distSq);

      // Check if click is within the draggable inner disk area
      // innerRadius - size * CANVAS_SCALE.BORDER_OFFSET is the actual radius of the inner disk drawing
      if (
        distSq <
        (innerRadius - size * CANVAS_SCALE.BORDER_OFFSET) * (innerRadius - size * CANVAS_SCALE.BORDER_OFFSET)
      ) {
        isDraggingRef.current = true;
        // Calculate the angle of the mouse click relative to the center, minus current inner rotation
        // This gives us an offset that remains constant during the drag.
        dragStartAngleRef.current = Math.atan2(dy, dx) - innerRotationRef.current;
        canvas.style.cursor = "grabbing"; // Change cursor to indicate dragging
        // Clear previous calculation/guides when user starts dragging
        guidesRef.current.guideA.show = false;
        guidesRef.current.guideB.show = false;
        setResult(null);
        setActualResult(null);

        // Set initial sound position to current rotation
        lastSoundPositionRef.current = innerRotationRef.current;

        // Initialize previous angle for boundary detection
        previousAngleRef.current = innerRotationRef.current;
      } else {
        // Check if click is on the outer scale (green numbers)
        const outerScaleInnerBound =
          outerRadius - size * CANVAS_SCALE.TEXT_OFFSET_OUTER - size * CANVAS_SCALE.TEXT_SIZE;
        const outerScaleOuterBound = outerRadius + size * CANVAS_SCALE.BORDER_OFFSET;
        console.log("distance", distance);
        console.log("outerScaleInnerBound", outerScaleInnerBound);
        console.log("outerScaleOuterBound", outerScaleOuterBound);
        if (distance >= outerScaleInnerBound && distance <= outerScaleOuterBound) {
          console.log("click on outer scale");
          // Calculate the angle of the click
          const clickAngle = Math.atan2(dy, dx);
          const normalizedClickAngle = normalizeAngle(clickAngle);

          // Find the closest number (including decimals 1.0-9.9)
          let closestNumber = 1;
          let minAngleDiff = Math.PI * 2;

          // Check whole numbers 1-9
          for (let i = 1; i <= 9; i++) {
            const numberAngle = getAngleForValue(i);
            const normalizedNumberAngle = normalizeAngle(numberAngle);

            // Calculate the shortest angular distance
            let angleDiff = Math.abs(normalizedClickAngle - normalizedNumberAngle);
            if (angleDiff > Math.PI) {
              angleDiff = 2 * Math.PI - angleDiff;
            }

            if (angleDiff < minAngleDiff) {
              minAngleDiff = angleDiff;
              closestNumber = i;
            }
          }

          // Check decimal numbers 1.1-9.9 (matching the minor ticks that are drawn)
          for (let i = 11; i < 100; i++) {
            const decimalValue = i / 10; // 1.1, 1.2, ..., 9.9
            const numberAngle = getAngleForValue(decimalValue);
            const normalizedNumberAngle = normalizeAngle(numberAngle);

            // Calculate the shortest angular distance
            let angleDiff = Math.abs(normalizedClickAngle - normalizedNumberAngle);
            if (angleDiff > Math.PI) {
              angleDiff = 2 * Math.PI - angleDiff;
            }

            if (angleDiff < minAngleDiff) {
              minAngleDiff = angleDiff;
              closestNumber = decimalValue;
            }
          }

          // Calculate the actual value considering the current decade level
          const actualValue = calculateValueForAngleAndDecade(getAngleForValue(closestNumber), decadeLevel);
          slideRuleApi.emitCmdBValueClicked({ value: Math.round(actualValue * 10) });
          // }
        }
      }
    };

    const handleMouseUp = () => {
      const wasDragging = isDraggingRef.current;
      isDraggingRef.current = false;
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "grab"; // Restore cursor
      }

      // Only process if we were actually dragging
      if (wasDragging) {
        // Calculate the final value from the rotation
        const pink1AbsoluteAngle = innerRotationRef.current;
        const currentValue = getValueForAngle(pink1AbsoluteAngle, 0);

        // Update the value based on current rotation (snapping already handled during drag)
        const decimalPlaces = getDecimalPlaces(decadeLevel);
        const finalValue = snapToIntegers
          ? +currentValue.toFixed(decimalPlaces)
          : +currentValue.toFixed(decimalPlaces + 2);
        setUserValueA(finalValue);
        setActualResult(`(Reading)`);

        // Emit the dragCompleted event with the final value
        slideRuleApi.emitRsDragCompleted({ finalValue });
      }
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return; // Only if dragging

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const { center } = sizeRef.current;

      // Calculate the current angle of the mouse relative to the center
      const currentMouseAngle = Math.atan2(y - center.y, x - center.x);

      // New inner rotation is current mouse angle minus the initial offset
      let newRotation = currentMouseAngle - dragStartAngleRef.current;

      if (snapToIntegers) {
        const currentValue = getValueForAngle(newRotation, 0);

        // Calculate snap interval and snapped value
        let snapInterval, snappedValue;

        if (decadeLevel < -2) {
          // For very small intervals, use fixed precision for performance
          const maxPrecision = 6;
          const actualPrecision = Math.min(Math.abs(decadeLevel) + 1, maxPrecision);
          snappedValue = parseFloat(currentValue.toFixed(actualPrecision));
        } else {
          // Universal snap interval formula works for all other levels
          snapInterval = Math.pow(10, decadeLevel - 1);
          snappedValue = Math.round(currentValue / snapInterval) * snapInterval;
        }

        // Convert snapped value back to base value (1-10 range)
        let baseValue;
        if (decadeLevel === 0) {
          baseValue = snappedValue;
        } else if (decadeLevel < 0) {
          baseValue = snappedValue / Math.pow(10, decadeLevel);
        } else {
          const multiplier = Math.pow(10, decadeLevel);
          const majorValue = Math.floor(snappedValue / multiplier);
          const remainder = (snappedValue % multiplier) / multiplier;
          baseValue = majorValue + remainder;
        }

        // Ensure base value stays in 1-10 range
        if (baseValue >= 10 || baseValue < 1) baseValue = 1.0;

        const snappedAngle = getAngleForValue(baseValue);

        // Find the shortest rotation to the snapped position
        const currentNormalized = normalizeAngle(newRotation);
        const snappedNormalized = normalizeAngle(snappedAngle);

        let diff = snappedNormalized - currentNormalized;
        if (diff > Math.PI) {
          diff -= 2 * Math.PI;
        } else if (diff < -Math.PI) {
          diff += 2 * Math.PI;
        }

        newRotation = currentNormalized + diff;
      }

      innerRotationRef.current = newRotation;
      targetRotationRef.current = innerRotationRef.current; // Set target to current for no animation
      sizeRef.current.innerRotation = innerRotationRef.current; // Update the rotation in sizeRef

      // Play click sound during dragging
      checkAndPlayClickSound(innerRotationRef.current);

      // Detect decade boundary crossings
      let currentDecadeLevel = getUpdatedDecadeLevel();

      // Update previous angle for next comparison
      previousAngleRef.current = innerRotationRef.current;

      // Continuously update the display for what pink '1' is looking at during drag
      // IMPORTANT: This happens AFTER decade boundary detection to use the updated decade level
      const pink1AbsoluteAngle = innerRotationRef.current; // Pink 1 is at 0 radians on its own scale (relative to its own disk)
      const readValue = calculateValueForAngleAndDecade(pink1AbsoluteAngle, currentDecadeLevel); // Use the current (possibly updated) decade level directly
      const decimalPlaces = getDecimalPlaces(currentDecadeLevel); // Use the current (possibly updated) decade level
      const currentValue = snapToIntegers ? +readValue.toFixed(decimalPlaces) : +readValue.toFixed(decimalPlaces + 2);

      setActualResult(`(Reading)`); // Indicate it's a direct reading, not multiplication result
      if (valueA !== currentValue) {
        // PINGWING avoid sending too many events when nothing really changes
        slideRuleApi.emitRsAlignmentSet({ value: currentValue });
      }

      draw(); // Redraw the canvas with the new rotation
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("mousedown", handleMouseDown);
      // Use window for mouseup/mousemove to ensure events are captured even if mouse leaves canvas
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("mousemove", handleMouseMove);
    }

    // Cleanup event listeners
    return () => {
      if (canvas) {
        canvas.removeEventListener("mousedown", handleMouseDown);
      }
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [
    draw,
    getAngleForValue,
    getValueForAngle,
    setUserValueA,
    setActualResult,
    setResult,
    snapToIntegers,
    initializeAudio,
    checkAndPlayClickSound,
    valueA,
  ]);

  // Effect to setup canvas on mount and handle resize
  useEffect(() => {
    setupCanvas();
    window.addEventListener("resize", setupCanvas);
    return () => window.removeEventListener("resize", setupCanvas);
  }, [setupCanvas]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, []);

  // --- Custom Events Handling ---
  useEffect(() => {
    const calculateSlideRuleHandler = (event: CalculateSlideRuleEvent) => {
      console.log("Received calculateSlideRule event:", event.detail);

      setUserValueB(event.detail.pinkNumber);
      setTimeout(() => {
        handleCalculate(event.detail.pinkNumber);
      }, 500);
    };

    window.addEventListener("calculateSlideRule", calculateSlideRuleHandler);

    return () => {
      window.removeEventListener("calculateSlideRule", calculateSlideRuleHandler);
    };
  }, [handleCalculate, setUserValueB]);

  // Sync disk rotation when valueA changes via input (but not during dragging)
  useEffect(() => {
    if (!isDraggingRef.current && valueA > 0) {
      const targetAngle = getAngleForValue(valueA);

      // Calculate the shortest rotation path (considering the circular nature)
      const currentAngle = innerRotationRef.current;

      const currentNormalized = normalizeAngle(currentAngle);
      const targetNormalized = normalizeAngle(targetAngle);

      // Calculate both possible rotation directions
      let clockwiseDiff = targetNormalized - currentNormalized;

      // Handle the case where we cross the 0/2π boundary
      if (clockwiseDiff > Math.PI) {
        // If clockwise is more than half a circle, go counterclockwise instead
        clockwiseDiff = clockwiseDiff - 2 * Math.PI;
      } else if (clockwiseDiff < -Math.PI) {
        // If counterclockwise is more than half a circle, go clockwise instead
        clockwiseDiff = clockwiseDiff + 2 * Math.PI;
      }

      // Set target rotation to current + shortest difference
      targetRotationRef.current = currentAngle + clockwiseDiff;

      // Start animation if we're not already at the target and not already animating
      if (Math.abs(clockwiseDiff) > 0.001) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        // Initialize audio for input-triggered animations
        initializeAudio();
        animate(valueB, false); // Start animation without calculation flag
      } else {
        // If already at target, just update immediately
        innerRotationRef.current = targetAngle;
        if (sizeRef.current.innerRotation !== undefined) {
          sizeRef.current.innerRotation = targetAngle;
          draw();
        }
      }
    }
  }, [valueA, getAngleForValue, draw, animate, valueB, initializeAudio]);

  return (
    <>
      <div className="text-slate-200 flex flex-col md:flex-row items-center justify-center w-full h-full max-h-[45vh]">
        <div className="w-full md:w-1/2 lg:w-2/5 md:pr-8 flex flex-col justify-center" style={{ display: "none" }}>
          <div className="bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700">
            <h1 className="text-2xl font-bold text-cyan-400 mb-2">Circular Slide Rule</h1>
            {/* PINGWING TODO: think when should we show this text */}
            {/* <p className="text-slate-400 mb-4">
            A tool to understand logarithms by turning multiplication into addition (rotation).
          </p> */}

            {/* PINGWING TODO: when should we show how to use the slide rule? */}
            {/* <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 mb-4">
            <h2 className="font-bold text-lg mb-2 text-slate-300">How It Works</h2>
            <p className="text-slate-400 text-sm">
              The rule is:{" "}
              <span className="font-mono">
                log(<span className="text-green-500">A</span> × <span className="text-pink-500">B</span>) = log(
                <span className="text-green-500">A</span>) + log(<span className="text-pink-500">B</span>)
              </span>
              . On the slide rule, "adding logs" means adding rotations.
            </p>
            <ol className="list-decimal list-inside mt-2 text-sm text-slate-400 space-y-1">
              <li>
                Align the inner disk's <span className="font-bold text-pink-500">'1'</span> with number{" "}
                <span className="font-bold text-green-500">'A'</span> on the outer disk.
              </li>
              <li>
                Find number <span className="font-bold text-pink-500">'B'</span> on the inner disk.
              </li>
              <li>The number it points to on the outer disk is the answer.</li>
            </ol>
          </div> */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="valueA" className="block text-sm font-medium text-slate-400">
                  Number 'A' (Green)
                </label>
                <input
                  type="number"
                  id="valueA"
                  value={valueA}
                  onChange={(e) => setUserValueA(parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="valueB" className="block text-sm font-medium text-slate-400">
                  Number 'B' (Pink)
                </label>
                <input
                  type="number"
                  id="valueB"
                  value={valueB}
                  onChange={(e) => setUserValueB(parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Snapping toggle control */}
            <div className="mt-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={snapToIntegers}
                  onChange={(e) => setSnapToIntegers(e.target.checked)}
                  className="w-4 h-4 text-cyan-600 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-slate-400">
                  Snap to 0.1 increments when dragging
                  <span className="block text-xs text-slate-500 mt-1">
                    {snapToIntegers
                      ? "Disk will snap to 0.1 increments (1.0, 1.1, 1.2...) like a safe lock"
                      : "Disk allows precise float values (1.25, 2.73...)"}
                  </span>
                </span>
              </label>
            </div>

            <button
              onClick={handleCalculateClick}
              className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-lg"
            >
              Calculate A × B
            </button>

            <div className="mt-4 text-center bg-slate-700 p-3 rounded-lg">
              {result === "error" ? (
                <p className="text-red-400">Please enter positive numbers.</p>
              ) : result ? (
                <>
                  <p className="text-slate-300 font-medium">
                    Result: <span className="font-bold text-orange-400 text-lg">{result}</span>
                  </p>
                  <p className="text-xs text-slate-500">Actual: {actualResult}</p>
                </>
              ) : (
                <p className="text-slate-400">Result will appear here.</p>
              )}
            </div>
            <p className="text-center text-xs text-slate-500 mt-4">
              You can drag the inner disk to explore.{" "}
              {snapToIntegers
                ? "The disk will snap to 0.1 increments while dragging."
                : "The disk allows precise float positioning."}
            </p>
          </div>
        </div>

        <div className="w-full h-full flex items-center justify-center flex-col gap-2">
          {/*TODO: use ref as a selector instead of id*/}
          <canvas id="slide-rule" ref={canvasRef} className="cursor-grab touch-none active:cursor-grabbing z-100" />
        </div>
      </div>
      {children}
    </>
  );
};

export default SlideRuleCalculator;
