import { useCallback, useEffect, useRef, useState } from "react";

import { useSlideRuleStore } from "@/stores/slideRuleStore";
import type { CalculateSlideRuleEvent } from "@/types/customEvents";
import { useLessonsStore } from "@/stores/lessonsStore.ts";

const CANVAS_SCALE = {
  OUTER_RADIUS: 0.4,
  INNER_RADIUS: 0.3,
  TICK_MAJOR: 0.025,
  TICK_MINOR: 0.015,
  TEXT_OFFSET_OUTER: 0.04,
  TEXT_OFFSET_INNER: 0.07,
  CENTER_DOT: 0.02,
  BORDER_OFFSET: 0.04,
  GUIDE_EXTEND: 0.05,
  GUIDE_TEXT_OFFSET: 0.75,
  TEXT_SIZE: 0.04,
  TEXT_HIGHLIGHT_SIZE: 0.05,
  GUIDE_TEXT_SIZE: 0.05,
};

const MAX_VALUE = 1000;
const SCALE_MIN = 0;

interface SizeRefType {
  size: number;
  center: { x: number; y: number };
  outerRadius: number;
  innerRadius: number;
  innerRotation: number;
}

// Normalize angles to 0-2π range
const normalizeAngle = (angle) => {
  let normalized = angle % (2 * Math.PI);
  if (normalized < 0) normalized += 2 * Math.PI;
  return normalized;
};

const LinearSlideRuleCalculator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Use Zustand store instead of local state
  const {
    userValueA: valueA,
    userValueB: valueB,
    snapToIntegers,
    setUserValueA,
    setUserValueB,
    setSnapToIntegers,
  } = useSlideRuleStore();

  const { currentLesson } = useLessonsStore();

  const [result, setResult] = useState<string | null>(null);
  const [actualResult, setActualResult] = useState<string | null>(null);

  const animationFrameRef = useRef<number | null>(null);
  const sizeRef = useRef<Partial<SizeRefType>>({}); // Stores canvas dimensions and radii
  const innerRotationRef = useRef(0); // Current rotation of the inner disk
  const targetRotationRef = useRef(0); // Target rotation for animation
  const isDraggingRef = useRef(false); // Flag for drag state
  const dragStartAngleRef = useRef(0); // Angle where drag started

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

  // --- Linear Scale Utility Functions ---
  // Given a value (0-10), returns its angle on the linear scale (0 to 2*PI)
  const getAngleForValue = useCallback((value) => {
    // This maps a value from SCALE_MIN to MAX_VALUE to an angle from 0 to 2*PI
    if (value < SCALE_MIN || value > MAX_VALUE) {
      console.warn(`Value ${value} is outside the range ${SCALE_MIN}-${MAX_VALUE}. Clamping.`);
      value = Math.max(SCALE_MIN, Math.min(value, MAX_VALUE));
    }
    return ((value - SCALE_MIN) / (MAX_VALUE - SCALE_MIN)) * 2 * Math.PI;
  }, []);

  // Given an angle and an optional rotation offset, returns the value on the linear scale
  const getValueForAngle = useCallback((angle, rotationOffset = 0) => {
    // Normalize the angle to be between 0 and 2*PI
    let normalizedAngle = (angle - rotationOffset) % (2 * Math.PI);
    if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;

    // Convert normalized angle back to a value in the range
    const value = (normalizedAngle / (2 * Math.PI)) * (MAX_VALUE - SCALE_MIN) + SCALE_MIN;
    return value;
  }, []);

  // --- Drawing Functions ---
  const drawScale = useCallback(
    (ctx, radius, isInner = false) => {
      const { center, size, innerRotation } = sizeRef.current;

      ctx.font = `bold ${size * CANVAS_SCALE.TEXT_SIZE}px 'Space Mono'`;

      ctx.save(); // Save context before translation/rotation
      ctx.translate(center.x, center.y); // Move origin to center of canvas
      if (isInner) {
        ctx.rotate(innerRotation); // Apply inner disk rotation
      }

      // Draw major ticks (0-900)
      for (let i = SCALE_MIN; i < MAX_VALUE; i += 100) {
        const angle = getAngleForValue(i);

        // Draw Tick
        ctx.save(); // Save context before rotating for the tick
        ctx.rotate(angle); // Rotate to the tick's position
        ctx.beginPath();
        ctx.moveTo(radius - size * CANVAS_SCALE.TICK_MAJOR, 0);
        ctx.lineTo(radius + size * CANVAS_SCALE.TICK_MAJOR * 1.02, 0);
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

        if (isInner && (i === 1 || i === 10)) {
          ctx.fillStyle = "#e7127d";
          ctx.font = `bold ${size * CANVAS_SCALE.TEXT_HIGHLIGHT_SIZE}px 'Space Mono'`;
        } else if (isInner) {
          ctx.fillStyle = "#ec4899";
          ctx.font = `bold ${size * CANVAS_SCALE.TEXT_SIZE}px 'Space Mono'`;
        } else {
          ctx.fillStyle = "#22c55e";
          ctx.font = `bold ${size * CANVAS_SCALE.TEXT_SIZE}px 'Space Mono'`;
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.save(); // Save for text translation/rotation
        ctx.translate(textX, textY); // Move to text position
        if (isInner) {
          ctx.rotate(-innerRotation); // Counter-rotate text so it remains upright
        }
        ctx.fillText(String(i), 0, 0); // Display 0, 100, ... 900
        ctx.restore(); // Restore after text drawing
      }

      // Draw minor ticks (e.g., 10, 20, etc.)
      for (let i = 0; i < MAX_VALUE; i += 10) {
        if (i % 100 === 0) continue; // Skip major ticks

        const angle = getAngleForValue(i);
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        const tickLength = i % 50 === 0 ? CANVAS_SCALE.TICK_MINOR * 1.5 : CANVAS_SCALE.TICK_MINOR; // longer for 50s
        ctx.moveTo(radius - size * tickLength, 0);
        ctx.lineTo(radius, 0); // Minor ticks are shorter
        ctx.strokeStyle = "#5eead4"; // Cyan ticks
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore(); // Restore context from initial translation/rotation
    },
    [getAngleForValue]
  );

  const drawGuideLine = useCallback((ctx, guide, color, textLabel, onInner = false) => {
    const { center, size, outerRadius, innerRotation } = sizeRef.current;

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
    ctx.lineTo(outerRadius + size * CANVAS_SCALE.GUIDE_EXTEND, 0); // Draw line outwards
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

    const textX = (outerRadius + size * CANVAS_SCALE.GUIDE_TEXT_OFFSET) * Math.cos(totalAngle);
    const textY = (outerRadius + size * CANVAS_SCALE.GUIDE_TEXT_OFFSET) * Math.sin(totalAngle);

    ctx.fillStyle = color;
    ctx.font = `bold ${size * CANVAS_SCALE.GUIDE_TEXT_SIZE}px 'Space Mono'`;
    ctx.fillText(textLabel, textX, textY);

    ctx.restore();
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const { size, center, outerRadius, innerRadius, innerRotation } = sizeRef.current;
    const { guideA, guideB } = guidesRef.current;

    ctx.clearRect(0, 0, size, size); // Clear entire canvas

    // Draw outer dark circle background
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
  }, [drawScale, drawGuideLine]); // Dependencies for useCallback

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

        // When the animation settles, calculate the result for A + B (only if this was a calculation)
        if (isCalculating && guidesRef.current.guideB.show) {
          // The core slide rule calculation for A + B
          // angle(A+B) = angle(A) + angle(B)
          const resultAngle = getAngleForValue(valueA) + getAngleForValue(valueB);
          const resultValue = getValueForAngle(resultAngle);

          // The result might be > MAX_VALUE, which means it wraps around.
          // e.g. 7 + 5 = 12, on a 0-10 scale this is 2.
          // `getValueForAngle` handles the modulo arithmetic via angle normalization.
          setResult(resultValue.toFixed(2));
          setActualResult((valueA + valueB).toFixed(2));
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

      if (valueA < 0 || valueB < 0) {
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

      // The inner disk needs to rotate such that the '0' of the inner disk
      // aligns with the value 'A' on the outer disk.
      // If '0' is at 0 rad, and 'A' is at angle(A), then inner disk rotates by angle(A)
      // to bring inner '0' to outer 'A'.
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

    const size = minDim;
    const center = { x: size / 2, y: size / 2 };
    const outerRadius = size * CANVAS_SCALE.OUTER_RADIUS;
    const innerRadius = size * CANVAS_SCALE.INNER_RADIUS;

    sizeRef.current = {
      size,
      center,
      outerRadius,
      innerRadius,
      innerRotation: innerRotationRef.current, // Update current rotation in sizeRef
    };

    setTimeout(() => {
      draw();
    }, 250);
  }, [draw]);

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

      const { center, innerRadius, size } = sizeRef.current;
      const dx = x - center.x;
      const dy = y - center.y;
      const distSq = dx * dx + dy * dy;

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
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "grab"; // Restore cursor
      }

      // Calculate the final value from the rotation
      const pink1AbsoluteAngle = innerRotationRef.current;
      const currentValue = getValueForAngle(pink1AbsoluteAngle, 0);

      // Update the value based on current rotation (snapping already handled during drag)
      const finalValue = snapToIntegers ? Math.round(currentValue / 10) * 10 : +currentValue.toFixed(3);
      setUserValueA(finalValue);

      setActualResult(`(Reading)`);

      console.log(`Final reading: ${finalValue}`);
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
        // Snap to 10 increments while dragging (like a safe lock)
        const currentValue = getValueForAngle(newRotation, 0);

        // Round to nearest 10
        const snappedValue = Math.round(currentValue / 10) * 10;

        // Ensure we stay within the 0-1000 range
        const clampedValue = Math.max(SCALE_MIN, Math.min(snappedValue, MAX_VALUE));

        // Calculate the angle for the snapped value
        const snappedAngle = getAngleForValue(clampedValue);

        // Find the closest equivalent angle considering the circular nature
        const currentNormalized = normalizeAngle(newRotation);
        const snappedNormalized = normalizeAngle(snappedAngle);

        // Calculate the shortest rotation to the snapped position
        let diff = snappedNormalized - currentNormalized;
        if (diff > Math.PI) {
          diff -= 2 * Math.PI;
        } else if (diff < -Math.PI) {
          diff += 2 * Math.PI;
        }

        // Apply the snapped rotation
        newRotation = currentNormalized + diff;
      }

      innerRotationRef.current = newRotation;
      targetRotationRef.current = innerRotationRef.current; // Set target to current for no animation
      sizeRef.current.innerRotation = innerRotationRef.current; // Update the rotation in sizeRef

      // Play click sound during dragging
      checkAndPlayClickSound(innerRotationRef.current);

      // Continuously update the display for what pink '1' is looking at during drag
      const pink1AbsoluteAngle = innerRotationRef.current; // Pink 1 is at 0 radians on its own scale (relative to its own disk)
      const readValue = getValueForAngle(pink1AbsoluteAngle, 0); // Read from the fixed outer scale
      const currentValue = snapToIntegers ? Math.round(readValue / 10) * 10 : +readValue.toFixed(3);

      setUserValueA(currentValue);
      setActualResult(`(Reading)`); // Indicate it's a direct reading, not multiplication result

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
    <div className="text-slate-200 flex flex-col md:flex-row items-center justify-center p-4 overflow-hidden w-full h-full  max-h-[45vh]">
      <div className="w-full md:w-1/2 lg:w-2/5 md:pr-8 flex flex-col justify-center" style={{ display: "none" }}>
        <div className="bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700">
          <h1 className="text-2xl font-bold text-cyan-400 mb-2">Linear Addition Rule</h1>
          {/* PINGWING TODO: think when should we show this text */}
          <p className="text-slate-400 mb-4">A tool that shows how addition can be represented as adding rotations.</p>

          {/* PINGWING TODO: when should we show how to use the slide rule? */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 mb-4">
            <h2 className="font-bold text-lg mb-2 text-slate-300">How It Works</h2>
            <p className="text-slate-400 text-sm">
              The rule is: <span className="font-mono text-green-500">A</span> +{" "}
              <span className="font-mono text-pink-500">B</span>. On the slide rule, "adding numbers" means adding
              rotations.
            </p>
            <ol className="list-decimal list-inside mt-2 text-sm text-slate-400 space-y-1">
              <li>
                Align the inner disk's <span className="font-bold text-pink-500">'0'</span> with number{" "}
                <span className="font-bold text-green-500">'A'</span> on the outer disk.
              </li>
              <li>
                Find number <span className="font-bold text-pink-500">'B'</span> on the inner disk.
              </li>
              <li>The number it points to on the outer disk is the answer (A + B).</li>
            </ol>
          </div>

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
                Snap to 10 increments when dragging
                <span className="block text-xs text-slate-500 mt-1">
                  {snapToIntegers
                    ? "Disk will snap to 10-unit increments (10, 20, 30...) like a safe lock"
                    : "Disk allows precise float values (12.5, 27.3...)"}
                </span>
              </span>
            </label>
          </div>

          <button
            onClick={handleCalculateClick}
            className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-lg"
          >
            Calculate A + B
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
              ? "The disk will snap to 10-unit increments while dragging."
              : "The disk allows precise float positioning."}
          </p>
        </div>
      </div>

      <div className="w-full h-full flex items-center justify-center flex-col gap-2">
        {/*TODO: use ref as a selector instead of id*/}
        <canvas id="slide-rule" ref={canvasRef} className="cursor-grab touch-none active:cursor-grabbing z-100" />
      </div>
    </div>
  );
};

export default LinearSlideRuleCalculator;
