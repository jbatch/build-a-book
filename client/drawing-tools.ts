import { setCurrentColor, setCurrentSize } from './local-storage';
import { sendCanvasResetMessage, sendEndRound } from './network';

const sizes = { 'circle-sml': 1, 'circle-med': 3, 'circle-lrg': 6, 'circle-xlg': 10 };
const colors = {
  red: 'red',
  orange: 'orange',
  yellow: 'yellow',
  green: 'green',
  blue: 'blue',
  indigo: 'indigo',
  violet: 'violet',
  brown: 'brown',
  black: 'black',
  white: 'white',
};

export function initDrawingTools() {
  const sizeControlButtons = document.querySelectorAll('.size-controls a.btn-floating');
  const colorControlButtons = document.querySelectorAll('.color-controls a.btn-floating');
  const resetButton = document.querySelector('.reset-controls #reset-button');
  const endRoundButton = document.querySelector('.reset-controls #end-round-button');

  sizeControlButtons.forEach((btn) => btn.addEventListener('click', onSizeChange));
  colorControlButtons.forEach((btn) => btn.addEventListener('click', onColorChange));
  resetButton.addEventListener('click', onResetClick);
  endRoundButton.addEventListener('click', sendEndRound);
}

function onSizeChange(e: MouseEvent) {
  const target = e.target as HTMLAnchorElement;
  const selectedSize = Object.keys(sizes).find((sizeClass) =>
    target.className.includes(sizeClass)
  ) as keyof typeof sizes;
  if (!selectedSize) return;
  setCurrentSize(sizes[selectedSize]);
}

function onColorChange(e: MouseEvent) {
  const target = e.target as HTMLAnchorElement;
  const selectedColor = Object.keys(colors).find((color) =>
    target.className.includes(`swatch-${color}`)
  ) as keyof typeof colors;
  if (!selectedColor) return;
  setCurrentColor(colors[selectedColor]);
}

function onResetClick() {
  sendCanvasResetMessage();
}
