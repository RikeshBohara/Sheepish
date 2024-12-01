export class Player {
  constructor(game) {
    this.game = game;
    this.col = 5;
    this.row = 12;

    this.image = document.getElementById("sheep");
  }

  getPosition() {
    const cellWidth = this.game.cellWidth;
    const cellHeight = this.game.cellHeight;
    const x = this.col * cellWidth;
    const y = this.row * cellHeight + 6;
    return { x, y };
  }

  move(direction) {
    const cols = this.game.cols;
    const rows = this.game.rows;

    if (direction === "left" && this.col > 0) this.col--;
    if (direction === "right" && this.col < cols - 1) this.col++;
    if (direction === "up") this.row--;
    if (direction === "down" && this.row < rows - 1) this.row++;
  }

  update() {}

  draw(context) {
    const { x, y } = this.getPosition();
    // context.fillStyle = "red";
    // context.fillRect(x, y, this.game.cellWidth - 20, this.game.cellHeight - 8);
    context.drawImage(
      this.image,
      x,
      y,
      this.game.cellWidth - 20,
      this.game.cellHeight - 6
    );
  }
}
