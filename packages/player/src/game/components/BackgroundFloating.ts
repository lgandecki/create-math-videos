// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import UserComponent from "../../../phaserjs_editor_scripts_base/UserComponent.js";
/* END-USER-IMPORTS */

export default class BackgroundFloating extends UserComponent {
  constructor(gameObject: Phaser.GameObjects.Image) {
    super(gameObject);

    this.gameObject = gameObject;
    (gameObject as any)["__BackgroundFloating"] = this;

    /* START-USER-CTR-CODE */
    // Write your code here.
    /* END-USER-CTR-CODE */
  }

  static getComponent(gameObject: Phaser.GameObjects.Image): BackgroundFloating {
    return (gameObject as any)["__BackgroundFloating"];
  }

  private gameObject: Phaser.GameObjects.Image;
  public EffectScale: number = 1;

  /* START-USER-CODE */

  // Write your code here.

  start() {
    // this.scene.tweens.add({
    //   targets: this.gameObject,
    //   x: { from: this.gameObject.x - 8 * this.EffectScale, to: this.gameObject.x + 8 * this.EffectScale },
    //   duration: 12000,
    //   yoyo: true,
    //   loop: -1,
    //   ease: "Sine.easeInOut",
    // });

    // this.scene.tweens.add({
    //   targets: bg,
    //   y: { from: 0, to: 10 },
    //   duration: 2000,
    //   yoyo: true,
    //   loop: -1,
    //   ease: "Sine.easeInOut",
    // });

    // @ts-ignore
    this.scene.tweens.add({
      targets: this.gameObject,
      y: { from: this.gameObject.y - this.EffectScale / 2, to: this.gameObject.y + this.EffectScale / 2 },
      duration: 2000,
      yoyo: true,
      loop: -1,
      ease: "Sine.easeInOut",
    });
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
