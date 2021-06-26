import { getCanvas } from './canvas';
import { safeEmit } from './sockets';

let mouseX: number;
let mouseY: number;
let mouseDown: boolean;

function initInputHandlers() {
  const canvas = getCanvas();
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mouseup', onMouseUp);
}

function onMouseDown() {
  mouseDown = true;
}
function onMouseUp() {
  mouseDown = false;
}

function onMouseMove(e: MouseEvent) {
  // safeEmit('input', { startX: mouseX, startY: mouseY, endX: e.offsetX, endY: e.offsetY, mouseDown: mouseDown });
  mouseX = e.offsetX;
  mouseY = e.offsetY;
}

export { initInputHandlers };
