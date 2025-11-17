// You can write more code here

/* START OF COMPILED CODE */

import Dialog from "../../../components/Dialog";
import OnPointerDownScript from "../../../core/OnPointerDownScript";
import PrintNextDialogMessage from "../../../core/PrintNextDialogMessage";
import StartSceneActionScript from "../../../core/StartSceneActionScript";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class CaptainDialog extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x?: number, y?: number) {
    super(scene, x ?? 412, y ?? 299);

    this.scaleX = 0.6;
    this.scaleY = 0.6;
    this.visible = false;

    // background
    const background = scene.add.image(59.957635255214086, 216.40225286632375, "_MISSING");
    background.scaleX = 1000;
    background.scaleY = 1000;
    background.alpha = 0.72;
    background.alphaTopLeft = 0.72;
    background.alphaTopRight = 0.72;
    background.alphaBottomLeft = 0.72;
    background.alphaBottomRight = 0.72;
    background.tintFill = true;
    background.tintTopLeft = 0;
    background.tintTopRight = 0;
    background.tintBottomLeft = 0;
    background.tintBottomRight = 0;
    this.add(background);

    // captain_speaks
    const captain_speaks = scene.add.video(-550.0423647447859, -413.59774713367625, "captain-speaks");
    captain_speaks.setOrigin(0, 0);
    captain_speaks.play(true);
    this.add(captain_speaks);

    // Button_1
    const button_1 = scene.add.text(9.957635255214086, 323.40225286632375, "", {});
    button_1.setInteractive(new Phaser.Geom.Rectangle(0, 0, 425, 82.1484375), Phaser.Geom.Rectangle.Contains);
    button_1.setOrigin(0.5, 0.5);
    button_1.visible = false;
    button_1.text = "New text";
    button_1.setStyle({ align: "center", backgroundColor: "#6c6c6cff", fontSize: "80px" });
    button_1.setPadding({ left: 20, right: 20 });
    this.add(button_1);

    // onPointerDownScript
    const onPointerDownScript = new OnPointerDownScript(button_1);

    // printNextDialogMessage
    const printNextDialogMessage = new PrintNextDialogMessage(onPointerDownScript);

    // Button_3
    const button_3 = scene.add.text(-232.0423647447859, 321.40225286632375, "", {});
    button_3.setInteractive(new Phaser.Geom.Rectangle(0, 0, 425, 82.1484375), Phaser.Geom.Rectangle.Contains);
    button_3.setOrigin(0.5, 0.5);
    button_3.visible = false;
    button_3.text = "New text";
    button_3.setStyle({ align: "center", backgroundColor: "#6c6c6cff", fontSize: "80px" });
    button_3.setPadding({ left: 20, right: 20 });
    this.add(button_3);

    // onPointerDownScript_1
    const onPointerDownScript_1 = new OnPointerDownScript(button_3);

    // startSceneActionScript_1
    new StartSceneActionScript(onPointerDownScript_1);

    // Button_2
    const button_2 = scene.add.text(247.9576352552141, 321.40225286632375, "", {});
    button_2.setInteractive(new Phaser.Geom.Rectangle(0, 0, 425, 82.1484375), Phaser.Geom.Rectangle.Contains);
    button_2.setOrigin(0.5, 0.5);
    button_2.visible = false;
    button_2.text = "New text";
    button_2.setStyle({ align: "center", backgroundColor: "#6c6c6cff", fontSize: "80px" });
    button_2.setPadding({ left: 20, right: 20 });
    this.add(button_2);

    // onPointerDownScript_2
    const onPointerDownScript_2 = new OnPointerDownScript(button_2);

    // startSceneActionScript_2
    new StartSceneActionScript(onPointerDownScript_2);

    // Message
    const message = scene.add.text(9.957635255214086, 99.40225286632375, "", {});
    message.setOrigin(0.5, 0.5);
    message.text =
      "New text New text New text New text New text New text New text New text New text New text New text New text New text ";
    message.setStyle({ align: "center", backgroundColor: "", fontSize: "80px", fontStyle: "italic", maxLines: 4 });
    message.setPadding({ left: 20, right: 20 });
    message.setWordWrapWidth(1100);
    this.add(message);

    // dialogFrame
    const dialogFrame = scene.add.container(-686.666639380986, -498.3333135313466);
    this.add(dialogFrame);

    // nineslice_1
    const nineslice_1 = scene.add.nineslice(
      686.6666259765626,
      496.3332927227029,
      "Hud copy",
      undefined,
      2450,
      1900,
      200,
      200,
      200,
      200
    );
    nineslice_1.scaleX = 0.5;
    nineslice_1.scaleY = 0.5;
    dialogFrame.add(nineslice_1);

    // frame
    const frame = scene.add.image(686.6666259765626, 36.3333141803741, "Frame");
    frame.scaleX = 0.6;
    frame.scaleY = 0.65;
    dialogFrame.add(frame);

    // pixelateFx
    dialogFrame.postFX!.addPixelate(0.5);

    // this (components)
    const thisDialog = new Dialog(this);
    thisDialog.DialogId = "capitan";
    thisDialog.MessageText = message;
    thisDialog.Button1 = button_1;

    // printNextDialogMessage (prefab fields)
    // @ts-ignore
    printNextDialogMessage.Dialog = this.__Dialog;

    /* START-USER-CTR-CODE */
    // Write your code here.
    /* END-USER-CTR-CODE */
  }

  /* START-USER-CODE */

  // Write your code here.

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
