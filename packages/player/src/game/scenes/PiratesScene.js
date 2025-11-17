/* global Phaser */
// You can write more code here

/* START OF COMPILED CODE */

class PiratesScene extends Phaser.Scene {
  constructor() {
    super("PiratesScene");

    /* START-USER-CTR-CODE */
    // Write your code here.
    /* END-USER-CTR-CODE */
  }

  /** @returns {void} */
  editorCreate() {
    // sea
    const sea = this.add.image(397, 308, "sea");
    sea.scaleX = 0.5;
    sea.scaleY = 0.5;

    this.events.emit("scene-awake");
  }

  /* START-USER-CODE */

  // Write your code here

  create() {
    this.editorCreate();
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
