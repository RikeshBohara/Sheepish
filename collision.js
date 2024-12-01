export class CollisionHandler {
  constructor(game) {
    this.game = game;
    this.startTimer();
    this.updateScoreDisplay();
  }

  collision(player, obstacle) {
    const playerPos = player.getPosition();
    const playerWidth = this.game.cellWidth - 20;
    const playerHeight = this.game.cellHeight - 8;

    return !(
      playerPos.x > obstacle.x + obstacle.width ||
      playerPos.x + playerWidth < obstacle.x ||
      playerPos.y > obstacle.y + obstacle.height ||
      playerPos.y + playerHeight < obstacle.y
    );
  }

  handleObstacles() {
    const player = this.game.player;
    const playerPos = player.getPosition();

    for (let i = 0; i < this.game.cars.length; i++) {
      if (this.collision(player, this.game.cars[i])) {
        this.resetPlayer();
        return;
      }
    }

    if (player.row >= 1 && player.row <= 5) {
      let safe = false;
      for (let i = 0; i < this.game.logs.length; i++) {
        let log = this.game.logs[i];
        if (this.collision(player, log)) {
          player.col +=
            log.direction === "right"
              ? log.speed / this.game.cellWidth
              : -log.speed / this.game.cellWidth;
          safe = true;
          break;
        }
      }

      if (!safe) {
        this.resetPlayer();
      }
    }

    if (player.row < 0) {
      this.handleSuccess();
    }
  }

  resetPlayer() {
    this.game.player.col = 5;
    this.game.player.row = 12;

    this.game.lives = this.game.lives - 1;
    if (this.game.score > 0) {
      this.game.score -= 50;
    }

    this.updateScoreDisplay();
    this.startTimer();

    if (this.game.lives === 0) {
      this.resetGame();
    }
  }

  handleSuccess() {
    this.game.score += 100;

    this.game.player.col = 5;
    this.game.player.row = 12;

    this.updateScoreDisplay();
    this.startTimer();
  }

  resetGame() {
    this.game.player.col = 5;
    this.game.player.row = 12;

    this.game.score = 0;

    this.game.lives = 3;

    this.game.cars = [];
    this.game.logs = [];
    this.game.createVehicles();
    this.game.createRafts();

    this.updateScoreDisplay();
    this.startTimer();

    const gameOver = document.querySelector(".gameOver");
    const canvas = document.querySelector(".canvas");

    gameOver.style.display = "block";
    canvas.style.display = "none";
  }

  updateScoreDisplay() {
    this.lives = 3;
    if (this.game.scoreCtx) {
      this.game.scoreCtx.clearRect(80, 70, 100, 30);
      this.game.scoreCtx.clearRect(
        65,
        this.game.SCORE_CANVAS_HEIGHT - 40,
        100,
        30
      );

      this.game.scoreCtx.fillStyle = "gold";
      this.game.scoreCtx.fillText(`${this.game.score}`, 80, 80);

      this.game.scoreCtx.fillText(
        `${this.game.lives}`,
        65,
        this.game.SCORE_CANVAS_HEIGHT - 20
      );
    }
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timer = 25;
    this.timerInterval = setInterval(() => {
      this.timer--;

      this.updateTimerDisplay();

      if (this.timer === 0) {
        this.resetPlayer();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    if (this.game.scoreCtx) {
      this.game.scoreCtx.clearRect(420, 70, 100, 30);
      this.game.scoreCtx.fillStyle = "gold";
      this.game.scoreCtx.fillText(`TIME: ${this.timer}`, 420, 80);
    }
  }

  handleTime() {
    if (this.game.scoreCtx) {
      this.game.scoreCtx.fillStyle = "gold";
      this.game.scoreCtx.fillText(`TIME: ${this.game.time}`, 420, 110);
    }
  }
}
