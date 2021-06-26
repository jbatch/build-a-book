import { getPlayerCanvas } from "./canvas";
import { safeEmit } from "./sockets";

function sendPlayerCanvas() {
  const playerCanvas = getPlayerCanvas();
  const playerImgStr = playerCanvas.toDataURL();
  safeEmit('client-draw', { imageData: playerImgStr})
}

export { sendPlayerCanvas }