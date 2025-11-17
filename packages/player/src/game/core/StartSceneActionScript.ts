// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import { ScriptNode } from "../../../phaserjs_editor_scripts_base";
/* END-USER-IMPORTS */

export default class StartSceneActionScript extends ScriptNode {
  constructor(parent: ScriptNode | Phaser.GameObjects.GameObject | Phaser.Scene) {
    super(parent);

    /* START-USER-CTR-CODE */
    // Write your code here.
    /* END-USER-CTR-CODE */
  }

  public sceneKey: string = "";

  /* START-USER-CODE */

  // @ts-ignore
  override execute(...args: any[]): void {
    // @ts-ignore
    this.scene.scene.start(this.sceneKey, ...args);
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
