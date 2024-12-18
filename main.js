import { Player } from "./player.js";
import { Background } from "./background.js";
import { Car, Log } from "./obstacle.js";
import { CollisionHandler } from "./collision.js";

window.addEventListener("load", function () {
  const gameCanvas = document.getElementById("gameCanvas");
  const ctx = gameCanvas.getContext("2d");

  const scoreCanvas = document.getElementById("scoreCanvas");
  const scoreCtx = scoreCanvas.getContext("2d");

  class Game {
    constructor(gameCanvas, scoreCanvas, ctx, scoreCtx) {
      this.GAME_CANVAS_WIDTH = gameCanvas.width;
      this.GAME_CANVAS_HEIGHT = gameCanvas.height;
      this.SCORE_CANVAS_WIDTH = scoreCanvas.width;
      this.SCORE_CANVAS_HEIGHT = scoreCanvas.height;

      this.ctx = ctx;
      this.scoreCtx = scoreCtx;

      this.cols = 11;
      this.rows = 13;
      this.cellWidth = this.GAME_CANVAS_WIDTH / this.cols;
      this.cellHeight = this.GAME_CANVAS_HEIGHT / this.rows;

      this.background = null;
      this.player = null;
      this.score = 0;
      this.lives = 3;
      this.time = 25;
      this.cars = [];
      this.logs = [];
      this.collisionHandler = null;

      const startButton = document.getElementById("start");
      startButton.addEventListener("click", () => this.start());
    }

    start() {
      this.background = new Background(this);
      this.player = new Player(this, this.cellWidth);
      this.collisionHandler = new CollisionHandler(this);

      this.collisionHandler.startBackgroundAudio();

      this.score = 0;
      this.lives = 3;
      this.time = 25;

      this.cars = [];
      this.logs = [];

      this.createVehicles();
      this.createRafts();

      this.setupCanvas();

      this.collisionHandler.startTimer();
      this.collisionHandler.updateScoreDisplay();

      this.setupKeydownListener();

      this.animate();
    }

    setupCanvas() {
      this.scoreCtx.font = "40px Times New Roman";
      this.scoreCtx.fillStyle = "#d3d3d3";
      this.scoreCtx.textAlign = "center";
      this.scoreCtx.fillText("SHEEPISH!", this.SCORE_CANVAS_WIDTH / 2, 80);
      this.scoreCtx.font = "18px Arial";
      this.scoreCtx.fillStyle = "gold";
      this.scoreCtx.textAlign = "start";
      this.scoreCtx.fillText("SCORE: ", 20, 110);
      this.scoreCtx.fillText(`TIME: ${this.time}`, 420, 110);
      this.scoreCtx.fillText("Lives: ", 20, this.SCORE_CANVAS_HEIGHT - 20);
    }

    createVehicles() {
      const carConfigs = [
        {
          yPos: 8.6,
          width: this.cellWidth * 3,
          height: this.cellHeight - 5,
          images: ["./images/truck2.png", "./images/truck3.png"],
          speed: 2,
          direction: "right",
          count: 2,
          spacing: 150,
        },
        {
          yPos: 9.6,
          width: this.cellWidth * 2,
          height: this.cellHeight - 5,
          images: ["./images/car4.png", "./images/car5.png"],
          speed: 2,
          direction: "left",
          count: 2,
          spacing: 150,
        },
        {
          yPos: 10.6,
          width: this.cellWidth * 2,
          height: this.cellHeight - 5,
          images: ["./images/truck1.png", "./images/truck3.png"],
          speed: 3,
          direction: "right",
          count: 2,
          spacing: 200,
        },
        {
          yPos: 11.6,
          width: this.cellWidth * 2,
          height: this.cellHeight - 5,
          images: ["./images/car3.png", "./images/car5.png"],
          speed: 3,
          direction: "left",
          count: 2,
          spacing: 200,
        },
        {
          yPos: 12.6,
          width: this.cellWidth * 2,
          height: this.cellHeight - 5,
          images: ["./images/car1.png", "./images/car2.png"],
          speed: 2,
          direction: "right",
          count: 2,
          spacing: 250,
        },
      ];

      carConfigs.forEach((config) => {
        for (let i = 0; i < config.count; i++) {
          const imageIndex = i % config.images.length;

          const xPos =
            config.direction === "right"
              ? -(i * (config.width + config.spacing))
              : this.GAME_CANVAS_WIDTH + i * (config.width + config.spacing);
          this.cars.push(
            new Car(
              xPos,
              this.cellHeight * config.yPos -
                this.cellHeight -
                (config.height === this.cellHeight ? 5 : 25),
              config.width,
              config.height,
              config.images[imageIndex],
              config.speed,
              config.direction
            )
          );
        }
      });
    }

    createRafts() {
      const raftConfigs = [
        {
          yPos: 6.2,
          width: this.cellWidth * 2,
          height: this.cellHeight - 7,
          img: "./images/log.png",
          speed: 3,
          direction: "left",
          count: 3,
          spacing: 80,
        },
        {
          yPos: 5.2,
          width: this.cellWidth * 2,
          height: this.cellHeight - 7,
          img: "./images/boat1.png",
          speed: 2,
          direction: "right",
          count: 3,
          spacing: 80,
        },
        {
          yPos: 4.2,
          width: this.cellWidth,
          height: this.cellHeight - 7,
          img: "./images/turtle1.png",
          speed: 2,
          direction: "left",
          count: 4,
          spacing: 100,
        },
        {
          yPos: 3.2,
          width: this.cellWidth * 2,
          height: this.cellHeight - 7,
          img: "./images/log.png",
          speed: 2,
          direction: "right",
          count: 3,
          spacing: 80,
        },
        {
          yPos: 2.2,
          width: this.cellWidth,
          height: this.cellHeight - 7,
          img: "./images/turtle1.png",
          speed: 3,
          direction: "left",
          count: 3,
          spacing: 100,
        },
      ];

      raftConfigs.forEach((config) => {
        for (let i = 0; i < config.count; i++) {
          const startX =
            config.direction === "left"
              ? this.GAME_CANVAS_WIDTH + i * (config.width + config.spacing)
              : -(i * (config.width + config.spacing));

          this.logs.push(
            new Log(
              startX,
              this.cellHeight * config.yPos - this.cellHeight,
              config.width,
              config.height,
              config.img,
              config.speed,
              config.direction
            )
          );
        }
      });
    }

    draw(context) {
      this.background.draw(context);
      this.logs.forEach((log) => log.draw(context));
      this.player.draw(context);
      this.cars.forEach((car) => car.draw(context));
    }

    update() {
      this.cars.forEach((car) => car.update());
      this.logs.forEach((log) => log.update());
      this.collisionHandler.handleObstacles();
    }

    setupKeydownListener() {
      window.addEventListener("keydown", (event) => this.handleKeydown(event));
    }

    handleKeydown(event) {
      if (event.key === "a" || event.key === "A") this.player.move("left");
      if (event.key === "d" || event.key === "D") this.player.move("right");
      if (event.key === "w" || event.key === "W") this.player.move("up");
      if (event.key === "s" || event.key === "S") this.player.move("down");
    }

    animate() {
      this.ctx.clearRect(0, 0, this.GAME_CANVAS_WIDTH, this.GAME_CANVAS_HEIGHT);
      this.update();
      this.draw(this.ctx);
      requestAnimationFrame(() => this.animate());
    }
  }

  const game = new Game(gameCanvas, scoreCanvas, ctx, scoreCtx);
});
