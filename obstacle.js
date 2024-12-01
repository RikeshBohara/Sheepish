export class Car {
  constructor(x, y, width, height, imageSrc, speed, direction) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = imageSrc;
    this.speed = speed;
    this.direction = direction;
  }

  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    if (this.direction === "right") {
      this.x += this.speed;
      if (this.x > gameCanvas.width) {
        this.x = -this.width;
      }
    } else if (this.direction === "left") {
      this.x -= this.speed;
      if (this.x < -gameCanvas.width) {
        this.x = gameCanvas.width;
      }
    }
  }
}

export class Log {
  constructor(x, y, width, height, imageSrc, speed, direction) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = imageSrc;
    this.speed = speed;
    this.direction = direction;
  }

  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    if (this.direction === "right") {
      this.x += this.speed;
      if (this.x > gameCanvas.width) {
        this.x = -this.width;
      }
    } else if (this.direction === "left") {
      this.x -= this.speed;
      if (this.x + this.width < 0) {
        this.x = gameCanvas.width;
      }
    }
  }
}
