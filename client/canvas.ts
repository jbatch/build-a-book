import { debounce } from 'throttle-debounce';

import { getGameState } from './game-state';

const FPS = 60;
const height = 450;
const width = 800;

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let renderInterval: ReturnType<typeof setInterval>;

function initCanvas() {
  canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  ctx = canvas.getContext('2d');

  resizeCanvas();
  window.addEventListener('resize', debounce(40, resizeCanvas));
}

function resizeCanvas() {
  canvas.height = height;
  canvas.width = width;
  drawAll();
}

function drawAll() {
  const gameState = getGameState();
  if (!gameState) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  drawBuffer(gameState);
  drawCursors(gameState);
  ctx.stroke();
}
function drawBuffer(gameState: GameStateMessage) {
  const buffer = gameState.canvasBuffer;
  if (!gameState.canvasBuffer.length) return;
  console.log('buffer', { buffer: buffer.length });
  var array = new Uint8ClampedArray(buffer);
  var imageData = new ImageData(array, canvas.width, canvas.height);

  ctx.putImageData(imageData, 0, 0);
}

function drawCursors(gameState: GameStateMessage) {
  gameState.cursors.forEach((c) => {
    ctx.rect(c.x, c.y, 10, 10);
  });
  console.log(gameState?.cursors);
}

function getCanvas() {
  return canvas;
}

function startRenderInterval() {
  renderInterval = setInterval(drawAll, 1000 / FPS);
}

function stopRenderInterval() {
  clearInterval(renderInterval);
}

export { initCanvas, getCanvas, startRenderInterval, stopRenderInterval };
