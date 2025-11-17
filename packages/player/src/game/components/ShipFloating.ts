// @ts-nocheck
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import UserComponent from "../../../phaserjs_editor_scripts_base/UserComponent.js";
/* END-USER-IMPORTS */

export default class ShipFloating extends UserComponent {
  constructor(gameObject: Phaser.GameObjects.Image) {
    super(gameObject);

    this.gameObject = gameObject;
    (gameObject as any)["__ShipFloating"] = this;

    /* START-USER-CTR-CODE */
    // Write your code here.
    /* END-USER-CTR-CODE */
  }

  static getComponent(gameObject: Phaser.GameObjects.Image): ShipFloating {
    return (gameObject as any)["__ShipFloating"];
  }

  private gameObject: Phaser.GameObjects.Image;
  public EffectScale: number = 1;

  /* START-USER-CODE */

  // Write your code here.

  start() {
    this.scene.tweens.add({
      targets: this.gameObject,
      y: { from: this.gameObject.y - 5 * this.EffectScale, to: this.gameObject.y + 5 * this.EffectScale },
      duration: 1200 + Math.random() * 200,
      yoyo: true,
      loop: -1,
      ease: "Sine.easeInOut",
    });
    this.scene.tweens.add({
      targets: this.gameObject,
      angle: { from: -1 * this.EffectScale, to: 1 * this.EffectScale },
      duration: 2000 + Math.random() * 400,
      yoyo: true,
      loop: -1,
      ease: "Sine.easeInOut",
    });
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
