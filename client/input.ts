import { getCanvas } from './canvas';
import { safeEmit } from './sockets';

let mouseX: number;
let mouseY: number;

function initInputHandlers() {
  const canvas = getCanvas();
  canvas.addEventListener('mousemove', onMouseMove);
}

function onMouseMove(e: MouseEvent) {
  safeEmit('input', { startX: mouseX, startY: mouseY, endX: e.offsetX, endY: e.offsetY });
  mouseX = e.offsetX;
  mouseY = e.offsetY;
}

export { initInputHandlers };
