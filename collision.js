export class CollisionHandler {
  constructor(game) {
    this.game = game;
    this.gameOver = false;
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
    if (this.gameOver) return;

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
    if (this.gameOver) return;

    const crash = new Audio("./audio/fail.mp3");
    this.game.player.col = 5;
    this.game.player.row = 12;

    this.game.lives = this.game.lives - 1;
    if (this.game.score > 0) {
      this.game.score -= 50;
    }
    crash.play();
    this.updateScoreDisplay();
    this.startTimer();

    if (this.game.lives === 0) {
      this.resetGame();
    }
  }

  handleSuccess() {
    const success = new Audio("./audio/success.mp3");
    if (this.gameOver) return;

    this.game.score += 100;

    this.game.player.col = 5;
    this.game.player.row = 12;
    success.play();
    this.updateScoreDisplay();
    this.startTimer();
  }

  resetGame() {
    if (this.gameOver) return;

    this.gameOver = true;
    clearInterval(this.timerInterval);

    this.game.player.col = 5;
    this.game.player.row = 12;

    this.game.score = 0;
    this.game.lives = 3;

    this.game.cars = [];
    this.game.logs = [];
    this.game.createVehicles();
    this.game.createRafts();

    const gameOver = document.querySelector(".gameOver");
    const canvas = document.querySelector(".canvas");
    const again = document.getElementById("again");
    const gameOverAudio = new Audio("./audio/gameOver.mp3");
    gameOverAudio.play();

    gameOver.style.display = "block";
    canvas.style.display = "none";

    again.addEventListener("click", () => {
      this.startTimer();
      this.updateScoreDisplay();
      this.gameOver = false;
      gameOver.style.display = "none";
      canvas.style.display = "block";
    });
  }

  updateScoreDisplay() {
    if (this.game.scoreCtx) {
      this.game.scoreCtx.clearRect(90, 95, 100, 30);
      this.game.scoreCtx.clearRect(
        70,
        this.game.SCORE_CANVAS_HEIGHT - 40,
        100,
        30
      );

      this.game.scoreCtx.fillStyle = "gold";
      this.game.scoreCtx.fillText(`${this.game.score}`, 95, 110);

      this.game.scoreCtx.fillText(
        `${this.game.lives}`,
        70,
        this.game.SCORE_CANVAS_HEIGHT - 20
      );
    }
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timer = 25;

    this.timerInterval = setInterval(() => {
      if (this.gameOver) {
        clearInterval(this.timerInterval);
        return;
      }

      this.timer--;
      this.updateTimerDisplay();

      if (this.timer === 0) {
        this.resetPlayer();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    if (this.game.scoreCtx) {
      this.game.scoreCtx.clearRect(420, 90, 100, 30);
      this.game.scoreCtx.fillStyle = "gold";
      this.game.scoreCtx.fillText(`TIME: ${this.timer}`, 420, 110);
    }
  }

  handleTime() {
    if (this.game.scoreCtx) {
      this.game.scoreCtx.fillStyle = "gold";
      this.game.scoreCtx.fillText(`TIME: ${this.game.time}`, 420, 110);
    }
  }
}
