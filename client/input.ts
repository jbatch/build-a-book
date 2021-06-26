import { getCanvas } from './canvas';
import { safeEmit } from './sockets';

function initInputHandlers() {
  const canvas = getCanvas();
  canvas.addEventListener('mousemove', onMouseMove);
}

function onMouseMove(e: MouseEvent) {
  const x = e.offsetX;
  const y = e.offsetY;
  // console.log({ x, y });
  safeEmit('input', { x, y });
}

export { initInputHandlers };
