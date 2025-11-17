// You can write more code here

/* START OF COMPILED CODE */

import OnEventScript from "./OnEventScript";
import ScriptNode from "../../../phaserjs_editor_scripts_base/ScriptNode";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class OnPointerDownScript extends OnEventScript {
  constructor(parent: ScriptNode | Phaser.GameObjects.GameObject | Phaser.Scene) {
    super(parent);

    // this (prefab fields)
    this.eventName = "pointerdown";

    /* START-USER-CTR-CODE */
    // Write your code here.
    /* END-USER-CTR-CODE */
  }

  /* START-USER-CODE */

  override awake(): void {
    // @ts-ignore
    if (!this.gameObject) {
      return;
    }

    // @ts-ignore
    if (!this.gameObject.input) {
      // @ts-ignore
      this.gameObject.setInteractive();
    }

    super.awake();
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
