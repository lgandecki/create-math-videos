// @ts-nocheck
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../../phaserjs_editor_scripts_base/ScriptNode";
/* START-USER-IMPORTS */
import Dialog from "../../game/components/Dialog";
/* END-USER-IMPORTS */

export default class PrintNextDialogMessage extends ScriptNode {
  constructor(parent: ScriptNode | Phaser.GameObjects.GameObject | Phaser.Scene) {
    super(parent);

    /* START-USER-CTR-CODE */
    // Write your code here.
    /* END-USER-CTR-CODE */
  }

  public Dialog!: Dialog;

  /* START-USER-CODE */

  // Write your code here.
  override execute(...args: any[]): void {
    this.Dialog.printNextMessage();
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
