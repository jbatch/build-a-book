import { debounce } from 'throttle-debounce';
import { getPlayerCanvas } from './canvas';
import { safeEmit } from './sockets';

export function sendClientJoinMessage(username: string, room: string) {
  safeEmit('client-join', { username, room });
}

export function sendPlayerCanvas() {
  const playerCanvas = getPlayerCanvas();
  const playerImgStr = playerCanvas.toDataURL();
  safeEmit('client-draw', { imageData: playerImgStr });
}

export function sendCanvasResetMessage() {
  safeEmit('client-canvas-reset', {});
}

export function sendHostStartMessage() {
  safeEmit('client-host-start');
}

function _sendPlayerCursor(endX: number, endY: number) {
  safeEmit('client-location', { endX, endY });
}

const sendPlayerCursor = debounce(500, _sendPlayerCursor);
export { sendPlayerCursor };
