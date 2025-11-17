// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import UserComponent from "../../../phaserjs_editor_scripts_base/UserComponent.js";
import { PIRATES_DELAY } from "../scenes/consts";
/* END-USER-IMPORTS */

export default class TweenPosition extends UserComponent {
  constructor(gameObject: Phaser.GameObjects.Image) {
    super(gameObject);

    this.gameObject = gameObject;
    (gameObject as any)["__TweenPosition"] = this;

    /* START-USER-CTR-CODE */
    // Write your code here.
    /* END-USER-CTR-CODE */
  }

  static getComponent(gameObject: Phaser.GameObjects.Image): TweenPosition {
    return (gameObject as any)["__TweenPosition"];
  }

  private gameObject: Phaser.GameObjects.Image;
  public tweenTarget!: Phaser.GameObjects.GameObject;

  /* START-USER-CODE */

  start() {
    this.gameObject.setPosition(this.gameObject.x + 300, this.gameObject.y);

    setTimeout(() => {
      // @ts-ignore
      this.scene.tweens.add({
        targets: this.gameObject,
        x: { from: this.gameObject.x, to: this.gameObject.x - 300 },
        duration: PIRATES_DELAY,
        ease: "Sine.easeInOut",
      });
    }, 500);
  }
  // Write your code here.

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
