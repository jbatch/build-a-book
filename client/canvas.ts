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
  const state = getGameState();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCursors();
}

function drawCursors() {
  const gameState = getGameState();
  if (!gameState) return;

  gameState.cursors.forEach((c) => {
    console.log('drawing', c);
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
