import { getPlayerCanvas } from "./canvas";
import { safeEmit } from "./sockets";

function sendPlayerCanvas() {
  const playerCanvas = getPlayerCanvas();
  const playerImgStr = playerCanvas.toDataURL();
  safeEmit('draw-image', { imageData: playerImgStr})
}

export { sendPlayerCanvas }