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

export function sendUpdateSettings(gameSettings: GameSettings) {
  safeEmit('client-host-update-settings', { gameSettings });
}

export function sendHostStartMessage() {
  safeEmit('client-host-start');
}

export function sendPrompt(prompt: string) {
  safeEmit('client-submit-prompt', { prompt });
}

export function sendPromptVote(userId: string) {
  safeEmit('client-vote-prompt', { userId });
}

function _sendPlayerCursor(endX: number, endY: number) {
  safeEmit('client-location', { endX, endY });
}

const sendPlayerCursor = debounce(500, _sendPlayerCursor);
export { sendPlayerCursor };
