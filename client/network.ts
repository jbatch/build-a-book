import { debounce } from 'throttle-debounce';
import { getPlayerCanvas } from './canvas';
import { safeEmit } from './sockets';

function randomRoomCode() {
  const fromList = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += fromList[Math.floor(Math.random() * fromList.length)];
  }
  return code;
}

export function sendClientJoinMessage(username: string) {
  const urlParams = new URLSearchParams(window.location.search);
  const roomIdParam = urlParams.get('roomId');
  const roomCode = roomIdParam || randomRoomCode();
  safeEmit('client-join', { username, room: roomCode });
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
export function sendEndRound() {
  safeEmit('client-end-round');
}

function _sendPlayerCursor(endX: number, endY: number) {
  safeEmit('client-location', { endX, endY });
}

const sendPlayerCursor = debounce(500, _sendPlayerCursor);
export { sendPlayerCursor };
