import { Game as MainGame } from "./scenes/Game";
import { AUTO, Game, Scale, Types } from "phaser";
import { gameConfigs } from "./utils/constants";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
  type: AUTO,
  width: gameConfigs.width,
  height: gameConfigs.height,
  parent: "game-container",
  backgroundColor: gameConfigs.backgroundColor,
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
  },
  scene: [MainGame],
};

export default new Game(config);
