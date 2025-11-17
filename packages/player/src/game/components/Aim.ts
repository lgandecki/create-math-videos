// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import { slideRuleApi } from "@/components/bridges/SlideRuleBridge.js";
import UserComponent from "../../../phaserjs_editor_scripts_base/UserComponent.js";
/* END-USER-IMPORTS */

export default class Aim extends UserComponent {
  constructor(gameObject: Phaser.GameObjects.Container) {
    super(gameObject);

    this.gameObject = gameObject;
    (gameObject as any)["__Aim"] = this;

    /* START-USER-CTR-CODE */
    this.aimFactor = 1;
    this.trail = [];
    // Write your code here.
    /* END-USER-CTR-CODE */
  }

  static getComponent(gameObject: Phaser.GameObjects.Container): Aim {
    return (gameObject as any)["__Aim"];
  }

  private gameObject: Phaser.GameObjects.Container;
  public Source!: Phaser.GameObjects.GameObject;
  public Target!: Phaser.GameObjects.GameObject;

  /* START-USER-CODE */

  private aimLine: Phaser.GameObjects.Graphics;
  public aimFactor: number = 1;
  public trail: Phaser.Math.Vector2[] = [];
  public showAim: boolean = false;
  awake() {
    window.bus.on("aimControl", this.aimControl);

    // @ts-ignore
    this.aimLine = this.scene.add.graphics();
    this.aimLine.displayList.moveDown(this.aimLine); // thickness, colour, alpha
    this.aimLine.displayList.moveDown(this.aimLine); // thickness, colour, alpha
    this.aimLine.displayList.moveDown(this.aimLine); // thickness, colour, alpha
    this.aimFactor = 0.1;
    this.trail = [];
    slideRuleApi.onCmdShowSlideRule(() => {
      this.showAim = true;
    });
    slideRuleApi.onCmdHideSlideRule(() => {
      this.showAim = false;
    });
  }

  destroy() {
    window.bus.off("aimControl", this.aimControl);
  }

  public aimControl = (aimValue: number) => {
    this.aimFactor = Phaser.Math.Clamp(Math.sqrt(aimValue), 0.5, 1.5);
    this.updateAim();
  };

  updateAim() {
    // @ts-ignore
    const sourcePosition = this.Source.getWorldPoint();
    // @ts-ignore
    const targetPosition = this.Target.getWorldPoint();
    const start = new Phaser.Math.Vector2(sourcePosition.x, sourcePosition.y);
    const end = Phaser.Math.LinearXY(
      start,
      new Phaser.Math.Vector2(targetPosition.x, targetPosition.y),
      this.aimFactor
    );
    this.trail = this.parabolaPoints(start, end, 30, 300); // 30 mids, 120-px apex
  }

  update() {
    // wipe the old line
    this.aimLine.clear();
    this.updateAim();

    if (this.gameObject.visible == false) return;
    if (this.gameObject.parentContainer.visible == false) return;
    if (!this.showAim) return;
    this.aimLine.lineStyle(5, 0xffe300, 1);
    this.aimLine.beginPath();
    this.trail.forEach((p, i) => (i ? this.aimLine.lineTo(p.x, p.y) : this.aimLine.moveTo(p.x, p.y)));
    this.aimLine.strokePath();
  }

  /**
   * Build a parabolic path between two points.
   *
   * @param {Phaser.Math.Vector2|{x:number,y:number}} from   Start point.
   * @param {Phaser.Math.Vector2|{x:number,y:number}} to     End point.
   * @param {number} count            How many *middle* points you want (set 0 to get just [from,to]).
   * @param {number} height=100       How high the arc rises, in pixels, above the straight line.
   *                                   Positive values arch upward (remember Phaser’s y-axis grows downward).
   * @returns {Phaser.Math.Vector2[]} Array of points length `count + 2` (start → … → end).
   */
  parabolaPoints(from, to, count, height = 300) {
    const pts = [];

    for (let i = 0; i <= count + 1; i++) {
      const t = i / (count + 1); // 0 → 1 inclusive
      const x = Phaser.Math.Linear(from.x, to.x, t); // straight-line lerp in X
      const y0 = Phaser.Math.Linear(from.y, to.y, t); // straight-line lerp in Y
      const y = y0 - height * 4 * t * (1 - t); // 4t(1-t) gives a unit parabola peaking at t = 0.5
      pts.push(new Phaser.Math.Vector2(x, y));
    }

    return pts;
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
