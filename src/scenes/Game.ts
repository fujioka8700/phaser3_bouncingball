import { Scene } from "phaser";
import { gameConfigs, gameOptions } from "../utils/constants";

export class Game extends Scene {
  constructor() {
    super("PlayGame");
  }

  obstacleGroup: Phaser.Physics.Arcade.Group;
  ball: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  ground: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  firstBounce: number;
  topScore: number;
  score: number;
  scoreText: Phaser.GameObjects.Text;

  preload() {
    this.load.setPath("assets");

    this.load.image("ground", "ground.png");
    this.load.image("ball", "ball.png");
    this.load.image("obstacle", "obstacle.png");
  }

  create() {
    this.firstBounce = 0;

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

    this.input.on("pointerdown", this.boost, this); // 特定のイベント(マウスクリック)のリスナーを追加する

    this.ball = this.physics.add.sprite(
      (gameConfigs.width / 10) * 2,
      (gameConfigs.height / 4) * 3 - gameOptions.bounceHeight,
      "ball",
    );
    this.ball.body.gravity.y = gameOptions.ballGravity; // 重力による加速度
    this.ball.setBounce(1); // 跳ねる値
    this.ball.setCircle(25); // 当たり判定を円形にする

    this.score = 0;
    this.topScore =
      localStorage.getItem(gameOptions.localStorageName) == null
        ? 0
        : Number(localStorage.getItem(gameOptions.localStorageName));
    this.scoreText = this.add.text(10, 10, "", { fontSize: gameOptions.fontSize });
    this.updateScore(this.score);
  }

  updateScore(inc: number) {
    this.score += inc;
    this.scoreText.text = `Score: ${this.score} \nBest: ${this.topScore}`;
  }

  boost() {
    // 最初のみクリック不可
    if (this.firstBounce != 0) {
      this.ball.body.velocity.y = gameOptions.ballPower; // クリック時、ボールの速度を上げる
    }
  }

  getRightmostObstacle() {
    let rightmostObstacle = 0;
    this.obstacleGroup.getChildren().forEach(function (obstacle: any) {
      rightmostObstacle = Math.max(rightmostObstacle, obstacle.x);
    });
    return rightmostObstacle;
  }

  update() {
    // ボールと地面の衝突判定をする
    this.physics.world.collide(
      this.ground,
      this.ball,
      function (this: Game) {
        if (this.firstBounce == 0) {
          this.firstBounce = this.ball.body.velocity.y; // ボールと地面の衝突時、ボールの速度を測定する
        } else {
          this.ball.body.velocity.y = this.firstBounce; // ボールと地面の衝突時、ボールの速度を最初の状態に戻す
        }
      },
      undefined,
      this,
    );

    // ボールと障害物の衝突判定をする
    this.physics.world.collide(
      this.ball,
      this.obstacleGroup,
      function (this: Game) {
        localStorage.setItem(gameOptions.localStorageName, String(Math.max(this.score, this.topScore)));
        this.scene.start("PlayGame"); // ゲームを最初からスタートする
      },
      undefined,
      this,
    );

    this.obstacleGroup.getChildren().forEach(function (this: Game, obstacle: any) {
      if (obstacle.getBounds().right < 0) {
        this.updateScore(1);

        // 障害物が左端に行き、消えたら一番左に移動する
        obstacle.x =
          this.getRightmostObstacle() +
          Phaser.Math.Between(gameOptions.obstacleDistanceRange[0], gameOptions.obstacleDistanceRange[1]);
      }
    }, this);
  }
}
