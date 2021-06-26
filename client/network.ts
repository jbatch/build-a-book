import { debounce } from 'throttle-debounce';
import { getPlayerCanvas } from './canvas';
import { safeEmit } from './sockets';

function sendPlayerCanvas() {
  const playerCanvas = getPlayerCanvas();
  const playerImgStr = playerCanvas.toDataURL();
  safeEmit('client-draw', { imageData: playerImgStr });
}

function _sendPlayerCursor(endX: number, endY: number) {
  console.log('sending location');
  safeEmit('client-location', { endX, endY });
}

const sendPlayerCursor = debounce(500, _sendPlayerCursor);

export { sendPlayerCanvas, sendPlayerCursor };
