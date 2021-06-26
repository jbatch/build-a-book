import { debounce } from 'throttle-debounce';
import { clearPlayerCanvas, drawPlayer, getCanvas } from './canvas';
import { sendPlayerCanvas } from './network';
import { safeEmit } from './sockets';

let mouseX: number;
let mouseY: number;
let mouseDown: boolean;

function initInputHandlers() {
  const canvas = getCanvas();
  canvas.addEventListener('mousemove', debounce(500, onMouseMove));
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mouseup', onMouseUp);
}

function onMouseDown() {
  mouseDown = true;
}
function onMouseUp() {
  mouseDown = false;
  sendPlayerCanvas();
  clearPlayerCanvas();
}

function onMouseMove(e: MouseEvent) {
  const startX = mouseX;
  const startY = mouseY;
  const endX = e.offsetX;
  const endY = e.offsetY;
  safeEmit('client-location', { endX, endY });
  if (mouseDown) {
    drawPlayer(startX, startY, endX, endY);
  }
  mouseX = e.offsetX;
  mouseY = e.offsetY;
}

function getMousePos() {
  return {
    x: mouseX,
    y: mouseY,
  };
}

export { initInputHandlers, getMousePos };
