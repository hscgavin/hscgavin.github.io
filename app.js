(function () {
  class Circle {
    /**
     * Create object Circle
     * @param {number} x
     * @param {number} y
     * this.r is radius
     * this._mx,this._my are distance circle move
     */
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.r = Math.random() * 20;
      this._mx = Math.random();
      this._my = Math.random();
    }

    /**
     * Generate random color
     * @returns {string}
     */

    getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    /**
     * Draw Circle
     * @param ctx
     */
    drawCircle(ctx) {
      ctx.beginPath();
      // Draw circle based on the centre of a circle (x, y) and radius of circle (r)
      ctx.arc(this.x, this.y, this.r, 0, 360)
      ctx.closePath();
      ctx.fillStyle = "rgba(180, 180, 180, 0.2)";
      ctx.fill();
    }

    /**
     * Draw line between circles
     * To avoid drawing too many lines
     * We set distance threshold, only within this distance we draw a line
     * @param ctx
     * @param circle
     */
    drawLine(ctx, circle) {
      let dx = this.x - circle.x;
      let dy = this.y - circle.y;
      let d = Math.sqrt(dx * dx + dy * dy)
      if (d < 160) {
        ctx.beginPath();
        // Draw a line
        ctx.moveTo(this.x, this.y);   // start point
        ctx.lineTo(circle.x, circle.y);   // end point
        ctx.closePath();
        ctx.strokeStyle = 'rgba(215, 215, 215, 0.3)';
        ctx.stroke();
      }
    }

    /**
     * Cirle can only move within the canvas
     * @param w
     * @param h
     */
    move(w, h) {
      this._mx = (this.x < w && this.x > 0) ? this._mx : (-this._mx);
      this._my = (this.y < h && this.y > 0) ? this._my : (-this._my);
      this.x += this._mx / 2;
      this.y += this._my / 2;
    }
  }
  /**
   * Mouse movement circle
   */
  class MouseCircle extends Circle {
    constructor(x, y) {
      super(x, y)
    }

    drawCircle(ctx) {
      ctx.beginPath();
      this.r = (this.r < 18 && this.r > 2) ? this.r + (Math.random() * 2 - 1) : 5;
      ctx.arc(this.x, this.y, this.r, 0, 360);
      ctx.closePath();
      ctx.fillStyle = this.getRandomColor();
      ctx.fill();

    }
  }

  window.app = {};
  app.Circle = Circle;
  app.MouseCircle = MouseCircle;

})(window);

(function (window) {
  //requestAnimationFrame to update page
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');
  let w = canvas.width = canvas.offsetWidth;
  let h = canvas.height = canvas.offsetHeight;
  let circles = [];
  let mouse_circle = new app.MouseCircle(0, 0)

  let draw = function () {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < circles.length; i++) {
      circles[i].move(w, h);
      circles[i].drawCircle(ctx);
      for (j = i + 1; j < circles.length; j++) {
        circles[i].drawLine(ctx, circles[j])
      }
    }
    if (mouse_circle.x) {
      mouse_circle.drawCircle(ctx);
      for (var k = 1; k < circles.length; k++) {
        mouse_circle.drawLine(ctx, circles[k])
      }
    }
    requestAnimationFrame(draw)
  }

  let init = function (num) {
    for (var i = 0; i < num; i++) {
      circles.push(new app.Circle(Math.random() * w, Math.random() * h));
    }
    draw();
  }
  window.addEventListener('load', init(70));
  window.onmousemove = function (e) {
    e = e || window.event;
    mouse_circle.x = e.clientX;
    mouse_circle.y = e.clientY;
  }
  window.onmouseout = function () {
    mouse_circle.x = null;
    mouse_circle.y = null;
  };

})(window);