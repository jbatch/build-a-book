import { getGameState } from './game-state';
import { sendHostStartMessage } from './network';

export enum SCREENS {
  HOME,
  LOBBY,
  GAME,
}

const screens = {
  [SCREENS.HOME]: '#screen-home',
  [SCREENS.LOBBY]: '#screen-lobby',
  [SCREENS.GAME]: '#screen-game',
};

export function initUi() {
  // set up event handlers for button clicks, etc
  const inviteBtn = document.getElementById('invite-btn');
  const startBtn = document.getElementById('start-btn');
  startBtn.addEventListener('click', sendHostStartMessage);
}

export function showScreen(screen: SCREENS) {
  const allScreenIds = Object.values(screens).join(',');
  [...document.querySelectorAll(allScreenIds)].forEach((el) => el.classList.add('hidden'));
  document.querySelector(screens[screen]).classList.remove('hidden');
}

export function drawPlayersInLobby() {
  const players = getGameState().players;
  const lobbyEl = document.getElementById('lobby-players-list');

  lobbyEl.innerHTML = '';
  players.forEach((player) => {
    const el = document.createElement('div');
    el.classList.add('row');
    el.innerHTML = `<a class="btn-floating"><i class="material-icons">person</i></a><span class="ml2"></span>`;
    el.querySelector('span').innerText = player.username;
    lobbyEl.appendChild(el);
  });
}
