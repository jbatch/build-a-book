import { debounce } from 'throttle-debounce';

import { getGameState } from './game-state';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
const height = 450;
const width = 800;

function initCanvas() {
  canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  ctx = canvas.getContext('2d');

  resizeCanvas();
  window.addEventListener('resize', debounce(40, resizeCanvas));
}

function resizeCanvas() {
  canvas.height = height;
  canvas.width = width;
  drawCanvas();
}

function drawCanvas() {
  const state = getGameState();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawCursors() {}

function getCanvas() {
  return canvas;
}

export { initCanvas, getCanvas };
