// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import UserComponent from "../../../phaserjs_editor_scripts_base/UserComponent.js";
/* END-USER-IMPORTS */

export default class Dialog extends UserComponent {
  constructor(gameObject: Phaser.GameObjects.Container) {
    super(gameObject);

    this.gameObject = gameObject;
    (gameObject as any)["__Dialog"] = this;

    /* START-USER-CTR-CODE */
    // Write your code here.
    /* END-USER-CTR-CODE */
  }

  static getComponent(gameObject: Phaser.GameObjects.Container): Dialog {
    return (gameObject as any)["__Dialog"];
  }

  private gameObject: Phaser.GameObjects.Container;
  public DialogId: string = "";
  public MessageText!: Phaser.GameObjects.Text;
  public Button1!: Phaser.GameObjects.Text;

  /* START-USER-CODE */
  private onComplete: () => void = () => {};
  private onDialogProgress: (progress: number) => void = () => {};

  private messages: string[] = [];

  awake() {
    console.log(`awakeDialog_${this.DialogId}`);
    window.bus.on(`showDialog_${this.DialogId}`, this.showDialog);
    window.bus.on(`hideDialog_${this.DialogId}`, this.hideDialog);
  }

  destroy() {
    console.log(`destroyDialog_${this.DialogId}`);
    window.bus.off(`showDialog_${this.DialogId}`, this.showDialog);
    window.bus.off(`hideDialog_${this.DialogId}`, this.hideDialog);
  }

  update() {
    // console.log(`construct_${this.DialogId}`)
  }

  showDialog = ({ messages, btn1Label, onComplete, onDialogProgress }) => {
    console.log(`showDialog_${this.DialogId}`);
    if (btn1Label) {
      this.Button1.visible = true;
      this.Button1.text = btn1Label;
    }
    if (onComplete) {
      this.onComplete = onComplete;
    }
    if (onDialogProgress) {
      this.onDialogProgress = onDialogProgress;
    }

    this.messages = messages;
    this.printNextMessage();
    this.gameObject.visible = true;
    this.gameObject.scene.tweens.add({
      targets: this.gameObject,
      alpha: 1,
      duration: 250,
      ease: "Sine.easeInOut",
    });
  };

  hideDialog = () => {
    console.log(`hideDialog_${this.DialogId}`);
    // this.gameObject.visible = false;
    // this.gameObject.alpha = 0;
    this.gameObject.scene.tweens.add({
      targets: this.gameObject,
      alpha: 0,
      duration: 250,
      ease: "Sine.easeInOut",
    });
  };

  public printNextMessage = () => {
    if (!this.MessageText) return;
    if (!this.messages.length) {
      this.onComplete();
      this.hideDialog();
      return;
    }
    console.log(`printNextMessage_${this.DialogId}`, this.messages[0]);
    this.onDialogProgress(this.messages.length);
    this.animNextMessage();
  };

  animNextMessage = () => {
    this.gameObject.scene.tweens.add({
      targets: this.MessageText,
      alpha: 0,
      duration: 150,
      ease: "Sine.easeInOut",
      onComplete: () => {
        if (!this.messages.length) {
          this.hideDialog();
          return;
        }
        this.MessageText.text = this.messages.shift();
        this.gameObject.scene.tweens.add({
          targets: this.MessageText,
          alpha: 1,
          duration: 150,
        });
      },
    });
  };

  // Write your code here.

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
