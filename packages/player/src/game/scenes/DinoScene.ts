import Phaser from "phaser";
import { EventBus } from "../EventBus";

const BG_SCALE_FACTOR = 1.25;

export class DinoScene extends Phaser.Scene {
  private dino!: Phaser.GameObjects.Sprite;
  private bg!: Phaser.GameObjects.Video;
  private initialBgScale!: number;
  private dinoTween!: Phaser.Tweens.Tween;
  private currentScale: number = 1;
  private switchedToRun: boolean = false;
  private isJumping: boolean = false;
  // Add these properties to track screen dimensions
  private screenWidth!: number;
  private screenHeight!: number;

  constructor() {
    super({ key: "DinoScene" });
  }

  preload() {
    // Using the public/assets folder as recommended
    // this.load.image("background", "assets/background.jpg");
    this.load.video("background", "assets/background-palmy.mp4");
    this.load.atlas("dino", "assets/dino-atlas.png", "assets/dino-atlas.json");
    this.load.atlas("dinoIdle", "assets/dino-idle-atlas.png", "assets/dino-idle-atlas.json");
    this.load.atlas("dinoDead", "assets/dino-dead-atlas.png", "assets/dino-dead-atlas.json");
    this.load.atlas("dinoJump", "assets/dino-jump-atlas.png", "assets/dino-jump-atlas.json");
    this.load.atlas("dinoRun", "assets/dino-run-atlas.png", "assets/dino-run-atlas.json");
    this.load.image("dinoFront", "assets/dino-front.png");
    this.load.image("explode", "explode.png");
  }

  create() {
    // Store the current dimensions
    this.screenWidth = this.cameras.main.width;
    this.screenHeight = this.cameras.main.height;

    // Setup scene with current dimensions
    this.setupScene(this.screenWidth, this.screenHeight);

    // Add resize listener to handle window size changes
    this.scale.on("resize", this.handleResize, this);

    // Emit the scene-ready event, as recommended by the template docs
    EventBus.emit("current-scene-ready", this);
  }

  // New method to handle resize events
  private handleResize(gameSize: Phaser.Structs.Size) {
    const width = gameSize.width;
    const height = gameSize.height;

    // Update cached screen dimensions
    this.screenWidth = width;
    this.screenHeight = height;

    // Update camera
    this.cameras.main.setSize(width, height);

    // Reposition and rescale background
    this.updateBackgroundPosition(width, height);

    // Reposition dino (keep the same relative position)
    this.updateDinoPosition(width, height);
  }

  // New method to update background position on resize
  private updateBackgroundPosition(width: number, height: number) {
    if (!this.bg) return;

    // Recalculate the scale needed to cover the screen
    const scaleX = width / this.bg.width;
    const scaleY = height / this.bg.height;
    const minScale = Math.max(scaleX, scaleY);

    // Only update initialBgScale if this is a real resize, not our dynamic scaling effect
    this.initialBgScale = minScale * BG_SCALE_FACTOR;

    // Calculate effective scale based on current dino scale
    let effectiveScale = this.initialBgScale;

    // Apply the parallax effect if dino is scaled
    if (this.currentScale > 1) {
      // Use the same formula as in the event handler, but ensure minimum coverage
      effectiveScale = Math.max(this.initialBgScale * (1 - (this.currentScale - 1) * 0.08), minScale);
    }

    this.bg
      .setScale(effectiveScale)
      .setOrigin(0.5, 1)
      .setPosition(width / 2, height);
  }

  // New method to update dino position on resize
  private updateDinoPosition(width: number, height: number) {
    if (!this.dino) return;

    // Get current relative positions
    const relativeX = this.dino.x / this.screenWidth;

    // Update position, maintaining the same relative coordinates
    this.dino.setPosition(width * relativeX, height - 20);

    // If a tween is running, update its targets too
    if (this.dinoTween && this.dinoTween.isPlaying()) {
      // Update the end point of the tween
      this.dinoTween.updateTo("x", width * 0.9, true);
    }
  }

  // New method to set up the scene initially
  private setupScene(width: number, height: number) {
    // Add the background video
    this.bg = this.add.video(0, 0, "background");
    this.bg.play(true);

    // Apply the scale and position it
    this.bg
      .setOrigin(0.5, 1) // Set the anchor point to the bottom-center of the image
      .setPosition(width / 2, height); // Position the anchor at the bottom-center of the screen

    this.bg.once(
      "ready",
      () => {
        this.updateBackgroundPosition(this.cameras.main.width, this.cameras.main.height);
      },
      this
    );

    // Add the dino sprite, positioned at the bottom of the screen
    this.dino = this.add.sprite(width * 0.1, height - 20, "dino").setOrigin(0.5, 1);

    this.dino.setInteractive();
    this.dino.on("pointerdown", () => this.handleDinoJump());

    // Create animations
    this.createAnimations();

    // Start the walking animation
    this.dino.play("walk");

    // Create a tween to move the dino back and forth
    this.dinoTween = this.tweens.add({
      targets: this.dino,
      x: width * 0.9, // The destination X coordinate (90% of the screen width)
      duration: 4000, // Time in ms to travel one way
      ease: "Linear",
      yoyo: true, // Makes the tween reverse automatically
      repeat: -1, // Loops the tween forever
      onYoyo: () => {
        // Flip the sprite horizontally when it changes direction
        this.dino.toggleFlipX();
      },
      onRepeat: () => {
        // Flip it back when the tween repeats from the start
        this.dino.toggleFlipX();
      },
    });

    this.scheduleIdle();

    // Listen for events from the EventBus
    this.setupEventListeners();
  }

  // Extract animation setup to a separate method for better organization
  private createAnimations() {
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNames("dino", {
        prefix: "Walk (",
        start: 1,
        end: 10,
        suffix: ").png",
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNames("dinoIdle", {
        prefix: "Idle (",
        start: 1,
        end: 9,
        suffix: ").png",
      }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNames("dinoJump", {
        prefix: "Jump (",
        start: 1,
        end: 12,
        suffix: ").png",
      }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNames("dinoRun", {
        prefix: "Run (",
        start: 1,
        end: 8,
        suffix: ").png",
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "dead",
      frames: this.anims.generateFrameNames("dinoDead", {
        prefix: "Dead (",
        start: 1,
        end: 8,
        suffix: ").png",
      }),
      frameRate: 10,
      repeat: 0,
    });
  }

  // Extract event setup to a separate method
  private setupEventListeners() {
    EventBus.on("dino-scaled", (payload: { scale: number }) => {
      if (!payload || typeof payload.scale !== "number" || payload.scale <= 0) {
        return;
      }
      this.currentScale = payload.scale;

      // If dino is not on screen, don't do anything
      if (!this.dino.active) {
        return;
      }

      const dinoNewScale = Math.sqrt(payload.scale / 1.2) / 1.3;

      // Only scale background if dino scale is below 10
      const MAX_SCALE = 10;
      if (payload.scale < MAX_SCALE) {
        // Ensure background video is loaded and has valid dimensions
        if (!this.bg || !this.bg.width || !this.bg.height) {
          return;
        }

        // Calculate minimum scale needed to cover the screen
        const minScaleX = this.cameras.main.width / this.bg.width;
        const minScaleY = this.cameras.main.height / this.bg.height;
        const minScale = Math.max(minScaleX, minScaleY);

        // Ensure minScale is valid (not NaN or Infinity)
        if (!isFinite(minScale) || minScale <= 0) {
          return;
        }

        // Calculate the parallax effect scale (zooming out as dino grows)
        // Using a less aggressive scaling formula
        const parallaxScale = this.initialBgScale * (1 - (payload.scale - 1) * 0.08);

        // Ensure we never go below the minimum scale needed to cover the screen
        const bgNewScale = Math.max(parallaxScale, minScale);

        // Ensure the new scale is valid and reasonable
        if (isFinite(bgNewScale) && bgNewScale > 0) {
          this.tweens.add({
            targets: this.bg,
            scale: bgNewScale,
            duration: 500,
            ease: "Sine.InOut",
          });
        }
      }

      if (payload.scale > 3) {
        // Clear all pending delayed calls to prevent idle/animation interruptions during jump
        this.time.removeAllEvents();
        if (!this.switchedToRun) {
          this.dino.play("jump");
          this.switchedToRun = true;
        }

        this.dino.once(Phaser.Animations.Events.ANIMATION_COMPLETE + "-jump", () => {
          this.dino.play("run");
          this.dinoTween.timeScale = 2;
        });
      }

      if (payload.scale > 7) {
        const dinoX = this.dino.x;
        const dinoY = this.dino.y;
        this.dino.play("dead");
        this.dinoTween.timeScale = 1.5;
        this.dinoTween.stop();
        this.dino.once(Phaser.Animations.Events.ANIMATION_COMPLETE + "-dead", () => {
          this.dinoTween.pause();
        });

        const explosion = this.add.sprite(dinoX, dinoY, "explode").setOrigin(0.5, 0.75);
        explosion.setScale(0.5);

        this.tweens.add({
          targets: explosion,
          scale: 1.2,
          alpha: 0,
          duration: 1250,
          ease: "Cubic.easeOut",
          onComplete: () => {
            explosion.destroy();
          },
        });
      } else {
        // Use tweens for smooth scaling
        this.tweens.add({
          targets: this.dino,
          scale: dinoNewScale,
          duration: 500,
          ease: "Sine.InOut",
        });
      }
    });
  }

  // NEW: Extracted jump logic into a reusable method
  private handleDinoJump() {
    const currentAnimKey = this.dino.anims.currentAnim?.key;
    if (this.isJumping || currentAnimKey === "dead" || currentAnimKey === "idle") {
      return;
    }

    this.isJumping = true;
    this.time.removeAllEvents(); // Interrupt any scheduled idle animations

    const previousAnim = currentAnimKey || "walk";

    // **No longer pausing the movement tween** to maintain horizontal momentum.

    // 1. Play the visual jump animation
    this.dino.play("jump");

    // 2. Add a short vertical tween for the "hop" effect 🤸
    this.tweens.add({
      targets: this.dino,
      y: this.dino.y - 80, // Jump height in pixels
      duration: 550, // Time to reach the peak of the jump
      ease: "Sine.out", // A nice easing for the upward motion
      yoyo: true, // Automatically returns to the original y-position
    });

    // 3. When the *animation* completes, switch back to the previous animation
    this.dino.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "jump", () => {
      this.dino.play(previousAnim);
      this.isJumping = false;
      this.scheduleIdle(); // Reschedule the next idle
    });
  }

  private scheduleIdle() {
    if (this.currentScale < 4 && !this.isJumping) {
      // pick a random delay between 3 and 8 seconds
      const delay = Phaser.Math.Between(2000, 5000);
      this.time.delayedCall(delay, () => this.showIdle(), [], this);
    }
  }

  private showIdle() {
    // MODIFIED: Add a check to prevent idle from starting if a jump is in progress
    if (this.isJumping) return;

    this.dinoTween.pause();
    this.dino.stop();
    this.dino.play("idle");

    this.dino.once(Phaser.Animations.Events.ANIMATION_COMPLETE + "-idle", () => {
      // MODIFIED: Add a check here as well in case a jump was triggered during the idle anim
      if (this.isJumping) return;

      this.time.delayedCall(
        0,
        () => {
          this.dino.setTexture("dino");
          this.dino.play("idle");

          this.dino.once(Phaser.Animations.Events.ANIMATION_COMPLETE + "-idle", () => {
            // MODIFIED: And one final check for safety
            if (this.isJumping) return;

            this.dino.play("walk");
            this.dinoTween.resume();
            this.scheduleIdle();
          });
        },
        [],
        this
      );
    });
  }
}
