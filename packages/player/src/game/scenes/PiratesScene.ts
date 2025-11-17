// @ts-nocheck
// You can write more code here

/* START OF COMPILED CODE */

import BackgroundFloating from "../components/BackgroundFloating";
import ShipFloating from "../components/ShipFloating";
import CannonBall from "../components/CannonBall";
import HealthController from "../components/HealthController";
import TweenPosition from "../components/TweenPosition";
import Aim from "../components/Aim";
import CaptainDialog from "../pirates/scripts/prefabs/CaptainDialog";
/* START-USER-IMPORTS */
// @ts-nocheck
import { PIRATES_DELAY } from "./consts";
import { slideRuleApi } from "@/components/bridges/SlideRuleBridge";
/* END-USER-IMPORTS */

export default class PiratesScene extends Phaser.Scene {
  constructor() {
    super("PiratesScene");

    /* START-USER-CTR-CODE */
    // Write your code here.
    /* END-USER-CTR-CODE */
  }

  preload(): void {
    this.load.pack("asset-pack", "public/assets/asset-pack.json");
  }

  editorCreate(): void {
    // background
    const background = this.add.container(0, 0);

    // sky_extended
    const sky_extended = this.add.image(912, 256, "sky_extended");
    sky_extended.scaleX = 1.2;
    sky_extended.scaleY = 1.3;
    background.add(sky_extended);

    // sea_alone
    const sea_alone = this.add.image(752, 808, "sea-alone");
    sea_alone.scaleX = 1.2;
    background.add(sea_alone);

    // sea
    const sea = this.add.image(0, 0, "sea");
    sea.setOrigin(0, 0);
    sea.visible = false;

    // ShipsMiniGame
    this.add.container(0, 0);

    // ship_far_pirate
    const ship_far_pirate = this.add.container(1391.2081000467824, 522.2013212209986);

    // ship_far_pirate_image
    const ship_far_pirate_image = this.add.image(-15.20810004678242, -74.20132122099858, "ship-far-pirate");
    ship_far_pirate_image.scaleX = 0.25;
    ship_far_pirate_image.scaleY = 0.25;
    ship_far_pirate_image.flipX = true;
    ship_far_pirate.add(ship_far_pirate_image);

    // gradientFx_1
    ship_far_pirate_image.preFX!.addGradient(16711680, 16711680, 1, 0, 0, 0, 1, 0);

    // fire
    const fire = this.add.sprite(-63, -10, "_MISSING");
    fire.visible = false;
    fire.play("turret-fire");
    ship_far_pirate.add(fire);

    // target_pointer
    const target_pointer = this.add.container(1, 14);
    ship_far_pirate.add(target_pointer);

    // aim_1
    const aim_1 = this.add.container(-3687.2081298828125, -482.2012939453125);
    aim_1.visible = false;
    ship_far_pirate.add(aim_1);

    // target_pointer_1
    const target_pointer_1 = this.add.container(-63, -10);
    ship_far_pirate.add(target_pointer_1);

    // ship-player
    const ship_player = this.add.container(440, 608);

    // fire_1
    const fire_1 = this.add.sprite(1.53780170418446, 238.10074697089476, "_MISSING");
    fire_1.scaleX = 3;
    fire_1.scaleY = 3;
    fire_1.visible = false;
    ship_player.add(fire_1);

    // ship_far
    const ship_far = this.add.image(1.53780170418446, -1.899253029105239, "ship-far");
    ship_player.add(ship_far);

    // gradientFx
    ship_far.preFX!.addGradient(16711680, 16711680, 1, 0, 0, 0, 1, 0);

    // source-pointer
    const source_pointer = this.add.container(-22, 294);
    ship_player.add(source_pointer);

    // aim
    const aim = this.add.container(-400, -568);
    ship_player.add(aim);

    // CaptainDialog
    const captainDialog = new CaptainDialog(this, 768, 544);
    this.add.existing(captainDialog);

    // HUD
    const hUD = this.add.container(0, 8);

    // flag_1
    const flag_1 = this.add.image(1248, 80, "Flag 2 copy");
    flag_1.scaleX = 0.2;
    flag_1.scaleY = 0.2;
    flag_1.angle = -2;
    hUD.add(flag_1);

    // flag
    const flag = this.add.image(288, 80, "Flag 1");
    flag.scaleX = 0.2;
    flag.scaleY = 0.2;
    flag.angle = 2;
    flag.flipX = true;
    hUD.add(flag);

    // flag_Pole
    const flag_Pole = this.add.image(336, 48, "Flag Pole");
    flag_Pole.scaleX = 0.2;
    flag_Pole.scaleY = 0.2;
    hUD.add(flag_Pole);

    // flag_Pole_1
    const flag_Pole_1 = this.add.image(1200, 48, "Flag Pole");
    flag_Pole_1.scaleX = 0.2;
    flag_Pole_1.scaleY = 0.2;
    flag_Pole_1.flipX = true;
    hUD.add(flag_Pole_1);

    // hud_2
    const hud_2 = this.add.image(768, 48, "Hud 2");
    hud_2.scaleX = 0.25;
    hud_2.scaleY = 0.25;
    hud_2.visible = false;
    hUD.add(hud_2);

    // threeslice_2
    const threeslice_2 = this.add.nineslice(768, 48, "Hud 2", undefined, 2200, 0, 200, 200, 0, 0);
    threeslice_2.scaleX = 0.3;
    threeslice_2.scaleY = 0.25;
    hUD.add(threeslice_2);

    // player_hp_3
    const player_hp_3 = this.add.image(496, 48, "Heart");
    player_hp_3.scaleX = 0.15;
    player_hp_3.scaleY = 0.15;
    hUD.add(player_hp_3);

    // player_hp_2
    const player_hp_2 = this.add.image(568, 48, "Heart");
    player_hp_2.scaleX = 0.15;
    player_hp_2.scaleY = 0.15;
    hUD.add(player_hp_2);

    // player_hp_1
    const player_hp_1 = this.add.image(640, 48, "Heart");
    player_hp_1.scaleX = 0.15;
    player_hp_1.scaleY = 0.15;
    hUD.add(player_hp_1);

    // enemy_hp_3
    const enemy_hp_3 = this.add.image(1040, 48, "Heart");
    enemy_hp_3.scaleX = 0.15;
    enemy_hp_3.scaleY = 0.15;
    hUD.add(enemy_hp_3);

    // enemy_hp_2
    const enemy_hp_2 = this.add.image(968, 48, "Heart");
    enemy_hp_2.scaleX = 0.15;
    enemy_hp_2.scaleY = 0.15;
    hUD.add(enemy_hp_2);

    // enemy_hp_1
    const enemy_hp_1 = this.add.image(896, 48, "Heart");
    enemy_hp_1.scaleX = 0.15;
    enemy_hp_1.scaleY = 0.15;
    hUD.add(enemy_hp_1);

    // scroll_2
    const scroll_2 = this.add.image(768, 40, "Scroll 2");
    scroll_2.scaleX = 0.055;
    scroll_2.scaleY = 0.06;
    hUD.add(scroll_2);

    // frame_1
    const frame_1 = this.add.image(768, 1040, "Frame");
    frame_1.scaleX = 0.8;
    frame_1.scaleY = 0.8;
    frame_1.flipY = true;
    frame_1.visible = false;
    hUD.add(frame_1);

    // swords
    const swords = this.add.image(768, 40, "Swords");
    swords.scaleX = 0.1;
    swords.scaleY = 0.1;
    hUD.add(swords);

    // pixelateFx_1
    hUD.postFX!.addPixelate(0);

    // threeslice_1
    const threeslice_1 = this.add.nineslice(768, 1024, "Frame", undefined, 4000, 0, 400, 400, 0, 0);
    threeslice_1.scaleX = 0.5;
    threeslice_1.scaleY = 0.5;
    threeslice_1.angle = -180;
    hUD.add(threeslice_1);

    // sky_extended (components)
    const sky_extendedBackgroundFloating = new BackgroundFloating(sky_extended);
    sky_extendedBackgroundFloating.EffectScale = 10;

    // sea_alone (components)
    const sea_aloneBackgroundFloating = new BackgroundFloating(sea_alone);
    sea_aloneBackgroundFloating.EffectScale = 10;

    // ship_far_pirate (components)
    new ShipFloating(ship_far_pirate);
    const ship_far_pirateBackgroundFloating = new BackgroundFloating(ship_far_pirate);
    ship_far_pirateBackgroundFloating.EffectScale = 10;

    const ship_far_pirateCannonBall = new CannonBall(ship_far_pirate);
    ship_far_pirateCannonBall.aim = aim_1;
    ship_far_pirateCannonBall.Tag = "enemy";
    ship_far_pirateCannonBall.fireAnim = fire;
    ship_far_pirateCannonBall.sizeFactor = -1;
    ship_far_pirateCannonBall.isEnemy = true;
    ship_far_pirateCannonBall.enemyGradient = ship_far;
    ship_far_pirateCannonBall.enemyHealthController = ship_player;
    const ship_far_pirateHealthController = new HealthController(ship_far_pirate);
    ship_far_pirateHealthController.hitPoint01 = enemy_hp_1;
    ship_far_pirateHealthController.hitPoint02 = enemy_hp_2;
    ship_far_pirateHealthController.hitPoint03 = enemy_hp_3;
    ship_far_pirateHealthController.IsEnemy = true;
    // @ts-ignore
    const ship_far_pirateTweenPosition = new TweenPosition(ship_far_pirate);
    ship_far_pirateTweenPosition.tweenTarget = ship_far_pirate;

    // aim_1 (components)
    const aim_1Aim = new Aim(aim_1);
    aim_1Aim.Source = target_pointer_1;
    aim_1Aim.Target = source_pointer;

    // ship_player (components)
    new ShipFloating(ship_player);
    const ship_playerBackgroundFloating = new BackgroundFloating(ship_player);
    ship_playerBackgroundFloating.EffectScale = 6;
    const ship_playerCannonBall = new CannonBall(ship_player);
    ship_playerCannonBall.aim = aim;
    ship_playerCannonBall.Tag = "player";
    ship_playerCannonBall.fireAnim = fire_1;
    ship_playerCannonBall.enemyGradient = ship_far_pirate_image;
    ship_playerCannonBall.enemyHealthController = ship_far_pirate;
    const ship_playerHealthController = new HealthController(ship_player);
    ship_playerHealthController.hitPoint01 = player_hp_1;
    ship_playerHealthController.hitPoint02 = player_hp_2;
    ship_playerHealthController.hitPoint03 = player_hp_3;

    // aim (components)
    const aimAim = new Aim(aim);
    aimAim.Source = source_pointer;
    aimAim.Target = target_pointer;

    this.events.emit("scene-awake");
  }

  /* START-USER-CODE */

  // Write your code here

  create() {
    this.editorCreate();
    const narratorBubbleX = this.scale.width / 2;
    const narratorBubbleY = this.scale.height / 4;
    const narratorBubbleWidth = 400; // Adjust based on text; can measure dynamically
    const narratorBubbleHeight = 100;
    const narratorGraphics = this.createRectangularBubble(
      narratorBubbleX,
      narratorBubbleY,
      narratorBubbleWidth,
      narratorBubbleHeight
    );
    const narratorText = this.add
      .text(narratorBubbleX, narratorBubbleY, "Back in 1590, on the high seas...", {
        fontSize: "24px",
        color: "#000000",
        wordWrap: { width: narratorBubbleWidth - 40 }, // Padding inside bubble
        align: "center",
      })
      .setOrigin(0.5);

    setTimeout(() => {
      this.tweens.add({
        targets: [narratorGraphics, narratorText],
        alpha: 0,
        duration: 200,
        ease: "Sine.easeInOut",
      });
      const expectedA = 4;
      const expectedB = 2;
      window.bus.emit("showDialog_capitan", {
        messages: [
          "Quick! Pirates approaching!",
          "We need to defend the ship!",
          `Calculate ${expectedA} * ${expectedB} so we can aim the cannon at the enemy!`,
        ],
        btn1Label: "continue",
        onComplete: () => {
          console.log("captainDialog onComplete");
          slideRuleApi.emitCmdShowSlideRule(null);
          slideRuleApi.emitCmdTrackMultiplication({ a: expectedA, b: expectedB });
          const existingEl = document.getElementById("multiplication-hint");
          if (!existingEl) {
            const el = document.createElement("div");
            el.id = "multiplication-hint";
            el.innerText = `${expectedA} × ${expectedB}`;
            el.style.position = "fixed";
            el.style.top = "24px";
            el.style.right = "32px";
            el.style.zIndex = "1000";
            el.style.background = "rgba(0,0,0,0.7)";
            el.style.color = "#fff";
            el.style.fontSize = "2rem";
            el.style.fontWeight = "bold";
            el.style.padding = "12px 24px";
            el.style.borderRadius = "12px";
            el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
            el.style.pointerEvents = "none";
            document.body.appendChild(el);
          }
        },
        onDialogProgress: (progress) => {
          console.log("captainDialog onDialogProgress", progress);
        },
      });
    }, PIRATES_DELAY);
  }
  createRectangularBubble(x, y, width, height) {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 0.8); // White fill with semi-transparency
    graphics.fillRect(x - width / 2, y - height / 2, width, height);
    graphics.lineStyle(2, 0x000000, 1); // Black border
    graphics.strokeRect(x - width / 2, y - height / 2, width, height);
    return graphics;
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
