let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
const height = 450;
const width = 800;

function initCanvas() {
  canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  ctx = canvas.getContext('2d');
}

function resizeCanvas() {
  canvas.height = height;
  canvas.width = width;
  drawCanvas();
}

function drawCanvas() {
  // ctx.clearRect()
}

export { initCanvas };
