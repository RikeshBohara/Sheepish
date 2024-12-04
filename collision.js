export class CollisionHandler {
  constructor(game) {
    this.game = game;
    this.gameOver = false;
    this.backgroundAudio = new Audio("./audio/background.mp3");
    this.backgroundAudio.loop = true;
    this.backgroundAudio.volume = 0.2;

    this.isMuted = false;

    this.startTimer();
    this.updateScoreDisplay();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.backgroundAudio.muted = this.isMuted;

    this.updateMuteDisplay();
  }

  updateMuteDisplay() {
    if (this.game.scoreCtx) {
      this.game.scoreCtx.clearRect(
        420,
        this.game.SCORE_CANVAS_HEIGHT - 50,
        80,
        40
      );

      this.game.scoreCtx.font = "18px Arial";
      this.game.scoreCtx.fillStyle = "gold";

      const muteText = this.isMuted ? "Unmute" : "Mute";
      this.game.scoreCtx.fillText(
        muteText,
        420,
        this.game.SCORE_CANVAS_HEIGHT - 20
      );
    }
  }

  setupScoreCanvasListeners() {
    const scoreCanvas = document.getElementById("scoreCanvas");
    scoreCanvas.addEventListener("click", (event) => {
      const rect = scoreCanvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (
        x >= 420 &&
        x <= 500 &&
        y >= this.game.SCORE_CANVAS_HEIGHT - 50 &&
        y <= this.game.SCORE_CANVAS_HEIGHT - 10
      ) {
        this.toggleMute();
      }
    });
  }

  startBackgroundAudio() {
    this.backgroundAudio.play();
    this.updateMuteDisplay();
    this.setupScoreCanvasListeners();
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

    this.backgroundAudio.pause();
    this.backgroundAudio.currentTime = 0;

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
      this.backgroundAudio.play();
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
