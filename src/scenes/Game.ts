import { Scene } from "phaser";
import { gameConfigs, gameOptions } from "../utils/constants";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  obstacleGroup: Phaser.Physics.Arcade.Group;
  ball: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  ground: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  preload() {
    this.load.setPath("assets");

    this.load.image("ground", "ground.png");
    this.load.image("ball", "ball.png");
    this.load.image("obstacle", "obstacle.png");
  }

  create() {
    this.ground = this.physics.add.sprite(gameConfigs.width / 2, (gameConfigs.height / 4) * 3, "ground");
    this.ground.setImmovable(true); // 衝突しても不動にする

    this.obstacleGroup = this.physics.add.group();
    let obstacleX: number = gameConfigs.width;
    for (let i = 0; i < 10; i++) {
      let obstacle: any = this.obstacleGroup.create(obstacleX, this.ground.getBounds().top, "obstacle");
      obstacle.setOrigin(0.5, 1); // 各グループメンバーの原点X、原点Yを設定する
      obstacle.setImmovable(true);
      obstacleX += Phaser.Math.Between(gameOptions.obstacleDistanceRange[0], gameOptions.obstacleDistanceRange[1]);
    }
    this.obstacleGroup.setVelocityX(-gameOptions.obstacleSpeed); // 障害物を左に動かす

    this.ball = this.physics.add.sprite(
      (gameConfigs.width / 10) * 2,
      (gameConfigs.height / 4) * 3 - gameOptions.bounceHeight,
      "ball",
    );
    this.ball.body.gravity.y = gameOptions.ballGravity; // 重力による加速度
    this.ball.setBounce(1); // 跳ねる値
  }

  getRightmostObstacle() {
    let rightmostObstacle = 0;
    this.obstacleGroup.getChildren().forEach(function (obstacle: any) {
      rightmostObstacle = Math.max(rightmostObstacle, obstacle.x);
    });
    return rightmostObstacle;
  }

  update() {
    // 2つの物理オブジェクト、衝突判定をつける
    this.physics.world.collide(this.ground, this.ball, function () {}, undefined, this);
    this.physics.world.collide(this.ball, this.obstacleGroup, function () {}, undefined, this);

    this.obstacleGroup.getChildren().forEach(function (this: Game, obstacle: any) {
      if (obstacle.getBounds().right < 0) {
        obstacle.x =
          this.getRightmostObstacle() +
          Phaser.Math.Between(gameOptions.obstacleDistanceRange[0], gameOptions.obstacleDistanceRange[1]);
      }
    }, this);
  }
}
