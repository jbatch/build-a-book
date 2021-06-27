const CUR_COLOR = 'CUR_COLOR';
const CUR_SIZE = 'CUR_SIZE';

export function getCurrentColor() {
  return localStorage.getItem(CUR_COLOR);
}

export function setCurrentColor(color: string) {
  localStorage.setItem(CUR_COLOR, color);
}

export function getCurrentSize() {
  return Number(localStorage.getItem(CUR_SIZE));
}

export function setCurrentSize(size: number) {
  localStorage.setItem(CUR_SIZE, String(size));
}
