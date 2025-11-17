// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import UserComponent from "../../../phaserjs_editor_scripts_base/UserComponent.js";
import Aim from "./Aim.js";
import { CannonBallModel } from "@/game/pirates/scripts/models/CannonBallModel.ts";
/* END-USER-IMPORTS */

export default class CannonBall extends UserComponent {
  constructor(gameObject: Phaser.GameObjects.Image) {
    super(gameObject);

    this.gameObject = gameObject;
    (gameObject as any)["__CannonBall"] = this;

    /* START-USER-CTR-CODE */
    // Write your code here.
    /* END-USER-CTR-CODE */
  }

  static getComponent(gameObject: Phaser.GameObjects.Image): CannonBall {
    return (gameObject as any)["__CannonBall"];
  }

  private gameObject: Phaser.GameObjects.Image;
  public aim!: Aim;
  public Tag: string = "";
  public fireAnim!: Phaser.GameObjects.GameObject;
  public sizeFactor: number = 1;
  public isEnemy: boolean = false;
  public enemyGradient!: Phaser.GameObjects.GameObject;
  public enemyHealthController!: Phaser.GameObjects.GameObject;

  /* START-USER-CODE */
  private cannonBallsGraphics: Phaser.GameObjects.Graphics;
  private cannonBalls: CannonBallModel[] = [];

  awake() {
    window.bus.on(`fire_${this.Tag}`, this.fire);

    // @ts-ignore
    this.cannonBallsGraphics = this.scene.add.graphics();

    this.cannonBallsGraphics.displayList.moveDown(this.cannonBallsGraphics);
    this.cannonBallsGraphics.displayList.moveDown(this.cannonBallsGraphics);
    this.cannonBallsGraphics.displayList.moveDown(this.cannonBallsGraphics);
  }

  destroy() {
    window.bus.off(`fire_${this.Tag}`, this.fire);
  }

  fire = (shouldMiss: boolean = false) => {
    if (shouldMiss) {
      // @ts-ignore
      this.aim.__Aim.aimControl(Math.random() * 0.1 + 0.3);
    } else if (this.isEnemy) {
      // @ts-ignore
      this.aim.__Aim.aimControl(1);
    }

    // @ts-ignore
    const willHit = Math.abs(1 - this.aim.__Aim.aimFactor) < 0.01;
    // @ts-ignore
    this.cannonBalls.push(new CannonBallModel(0, willHit, this.aim.__Aim.trail));
    // @ts-ignore
    // this.fireAnim.anims.restart()
    // @ts-ignore
    this.fireAnim.visible = true;
    // @ts-ignore
    this.fireAnim.anims.play("turret-fire");
  };

  enemyHit() {
    // @ts-ignore
    const tweenTarget = this.enemyGradient.preFX.list[0];
    this.gameObject.scene.tweens.add({
      targets: tweenTarget,
      alpha: 0.7,
      duration: 150,
      yoyo: true,
      loop: 2,
      ease: "Sine.easeInOut",
    });
    // @ts-ignore
    this.enemyHealthController.__HealthController.hit(1);
  }

  update(time, delta) {
    // wipe the old line
    this.cannonBallsGraphics.clear();
    this.cannonBallsGraphics.fillStyle(0x111111, 1);
    this.cannonBalls.forEach((cannonBall) => {
      cannonBall.lifeTime += delta / 1000;
      const cannonBallPosition = cannonBall.getCurrentPosition(500);
      this.cannonBallsGraphics.fillCircle(
        cannonBallPosition.x,
        cannonBallPosition.y,
        12 * Math.max(0.8, this.sizeFactor < 0 ? cannonBall.lifeTime : 2 - cannonBall.lifeTime)
      );
      if (cannonBall.lifeTime >= 1) {
        // TODO Explode
      }
    });

    if (this.cannonBalls.filter((c) => c.isDone && c.willHit)?.length > 0) {
      this.enemyHit();
    }

    this.cannonBalls = this.cannonBalls.filter((c) => c.isDone == false);
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
