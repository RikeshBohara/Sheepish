export class Background {
  constructor(game) {
    this.game = game;
    this.cols = game.cols;
    this.rows = game.rows;
    this.width = game.GAME_CANVAS_WIDTH;
    this.height = game.GAME_CANVAS_HEIGHT;
    this.cellWidth = game.cellWidth;
    this.cellHeight = game.cellHeight;
  }
  draw(context) {
    const startLane = this.rows - 1;
    const roadLanes = this.rows - 6;
    const fastLane = this.rows - 7;
    const waterLanes = this.rows - 12;
    const grassLane = this.rows - 13;

    for (let x = 0; x < this.cols; x++) {
      context.fillStyle = "#a9aca4";
      context.fillRect(
        x * this.cols,
        startLane * this.cellHeight,
        this.width,
        this.cellHeight
      );
    }

    for (let x = 0; x < this.cols; x++) {
      for (let y = roadLanes; y < startLane; y++) {
        context.fillStyle = "#868882";
        context.fillRect(
          x * this.cellWidth,
          y * this.cellHeight,
          this.width,
          this.cellHeight + 1
        );
      }
    }

    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;
    context.setLineDash([25, 25]);

    for (let y = roadLanes; y < startLane; y++) {
      context.beginPath();
      context.moveTo(10, y * this.cellHeight - 2);
      context.lineTo(this.width, y * this.cellHeight - 2);
      context.stroke();
    }
    context.setLineDash([]);

    for (let x = 0; x < this.cols; x++) {
      context.fillStyle = "#a9aca4";
      context.fillRect(
        x * this.cellWidth,
        fastLane * this.cellHeight,
        this.width,
        this.cellHeight
      );
    }

    for (let x = 0; x < this.cols; x++) {
      for (let y = waterLanes; y < fastLane; y++) {
        context.fillStyle = "#0952ab";
        context.fillRect(
          x * this.cellWidth,
          y * this.cellHeight,
          this.width,
          this.cellHeight + 1
        );
      }
    }

    for (let x = 0; x < this.cols; x++) {
      context.fillStyle = "#008f00";
      context.fillRect(
        x * this.cellWidth,
        grassLane * this.cellHeight,
        this.width,
        this.cellHeight + 1
      );
    }

    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.strokeRect(2, 465, this.width - 4, this.cellHeight - 1);
    context.strokeRect(2, 268, this.width - 4, 465);
    context.strokeRect(2, 230, this.width - 4, this.cellHeight - 1);
    context.strokeRect(2, 39, this.width - 4, 192);
    context.strokeRect(2, 2, this.width - 4, this.cellHeight - 2);
  }
}
