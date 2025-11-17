import Phaser from "phaser";
import PiratesScene from "@/game/scenes/PiratesScene.ts";
import { DinoScene } from "./scenes/DinoScene";

export const launchPirates = (containerId: string) => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1536,
    height: 1024,
    backgroundColor: "#242424",
    render: {
      pixelArt: true,
    },
    parent: containerId,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    transparent: true,
    scene: [PiratesScene],
  };

  console.log("launchPirates", config);
  return new Phaser.Game(config);
};

export const launchDino = (containerId: string, backgroundOnly?: boolean) => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth * 0.7,
    height: window.innerHeight,
    parent: containerId,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    transparent: true,
    scene: [DinoScene],
    callbacks: {
      preBoot: (game) => {
        game.registry.set("backgroundOnly", !!backgroundOnly);
      },
    },
  };

  return new Phaser.Game(config);
};
