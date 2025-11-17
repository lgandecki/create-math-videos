// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class HealthController {
  constructor(gameObject: Phaser.GameObjects.Container) {
    this.gameObject = gameObject;
    (gameObject as any)["__HealthController"] = this;

    /* START-USER-CTR-CODE */
    // Write your code here.
    this.hitPoints = 3;
    /* END-USER-CTR-CODE */
  }

  static getComponent(gameObject: Phaser.GameObjects.Container): HealthController {
    return (gameObject as any)["__HealthController"];
  }

  private gameObject: Phaser.GameObjects.Container;
  public hitPoint01!: Phaser.GameObjects.GameObject;
  public hitPoint02!: Phaser.GameObjects.GameObject;
  public hitPoint03!: Phaser.GameObjects.GameObject;
  public IsEnemy: boolean = false;

  /* START-USER-CODE */

  public hitPoints: number = 3;
  // Write your code here.

  public hit(damage: number) {
    this.hitPoints -= damage;

    // @ts-ignore
    this.hitPoint01.visible = this.hitPoints > 0;
    // @ts-ignore
    this.hitPoint02.visible = this.hitPoints > 1;
    // @ts-ignore
    this.hitPoint03.visible = this.hitPoints > 2;

    if (this.IsEnemy) {
      window.bus.emit("hit_enemy", this.hitPoints);
    } else {
      window.bus.emit("hit_player", this.hitPoints);
    }

    if (this.hitPoints <= 0) {
      if (this.IsEnemy) {
        window.bus.emit("game_won");
      } else {
        window.bus.emit("game_over");
      }
      this.gameObject.visible = false;
    }
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
