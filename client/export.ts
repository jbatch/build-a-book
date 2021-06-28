import fileSaver from 'file-saver';

import { getCanvas } from './canvas';
import { getGameState } from './game-state';
import { printPromptToCanvas } from './page-printer';
import { drawPlayersInPrompt, showFinalGif } from './ui';

const gifExporter = require('./lib/gifExporter');

export async function createBookGif() {
  const state = getGameState();
  const bookPages = state.bookPages;
  const drawingCanvas = getCanvas();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.height = drawingCanvas.height + 80;
  canvas.width = drawingCanvas.width;
  canvas.style.border = '1px solid black';
  canvas.style.marginLeft = '50px';
  // document.body.appendChild(canvas);

  async function drawPageToCanvas(page: BookPage) {
    const gameState = getGameState();
    const img = await createImageFromStr(page.imgStr);
    printPromptToCanvas(page.prompt.prompt, ctx);
    ctx.drawImage(img, 0, 0);
  }

  const gif = new gifExporter({
    workerPath: 'js/Animated_GIF.worker.min.js',
  });
  gif.setSize(canvas.width, canvas.height);
  gif.setDelay(2000);
  gif.onRenderProgress((progress: number) => {
    const completionPercentage = (progress * 100).toFixed(2);
    console.log('Export Progress: ', completionPercentage);
  });

  for (let i = 0; i < bookPages.length; i++) {
    await drawPageToCanvas(bookPages[i]);
    gif.addFrameImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
  }

  gif.getBase64GIF((base64encodedImg: string) => {
    // need to also get image as a blob for use in downloading (and giving us an accurate size)
    // Cool hack to convert b64string to blob!
    fetch(base64encodedImg)
      .then((res) => res.blob())
      .then((imgBlob) => {
        const imgSizeMb = (imgBlob.size / 1000000).toFixed(2);
        console.log('Done', { imgSizeMb });

        const outgif = document.createElement('img');
        outgif.src = base64encodedImg;
        outgif.style.border = '1px solid black';
        document.getElementById('gif-container').appendChild(outgif);

        const downloadBtn = document.getElementById('download-gif-btn');
        downloadBtn.classList.remove('hidden');
        downloadBtn.addEventListener('click', () => {
          fileSaver.saveAs(imgBlob, 'book.gif');
        });

        document.getElementById('gif-export-loading-indicators').classList.add('hidden');
      });
  });
}

function createImageFromStr(str: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.onload = () => {
      resolve(img);
    };
    img.src = str;
  });
}
