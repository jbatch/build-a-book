import { getGameState } from './game-state';
import { sendClientJoinMessage, sendHostStartMessage, sendPromptVote } from './network';

export enum SCREENS {
  HOME,
  LOBBY,
  GAME,
  VOTING,
  PROMPTS,
}

const screens = {
  [SCREENS.HOME]: '#screen-home',
  [SCREENS.LOBBY]: '#screen-lobby',
  [SCREENS.GAME]: '#screen-game',
  [SCREENS.VOTING]: '#screen-voting',
  [SCREENS.PROMPTS]: '#screen-prompts',
};

export function initUi() {
  // set up event handlers for button clicks, etc
  const usernameInput = document.getElementById('username') as HTMLInputElement;
  const playBtn = document.getElementById('play-btn');
  const hostPrivateGameButton = document.getElementById('host-private-game-btn');
  const inviteBtn = document.getElementById('invite-btn');
  const startBtn = document.getElementById('start-btn');

  playBtn.addEventListener('click', () => sendClientJoinMessage(usernameInput.value, 'AAAA'));
  hostPrivateGameButton.addEventListener('click', () => sendClientJoinMessage(usernameInput.value, 'AAAA'));
  startBtn.addEventListener('click', sendHostStartMessage);
}

export function showScreen(screen: SCREENS) {
  const allScreenIds = Object.values(screens).join(',');
  [...document.querySelectorAll(allScreenIds)].forEach((el) => el.classList.add('hidden'));
  document.querySelector(screens[screen]).classList.remove('hidden');

  if (screen === SCREENS.VOTING) {
    addVotingEventHandlers();
  }
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

export function drawPlayersInPrompt() {
  const players = getGameState().players;
  const lobbyEl = document.getElementById('prompt-players-list');

  lobbyEl.innerHTML = '';
  players.forEach((player) => {
    const el = document.createElement('div');
    el.classList.add('row');
    el.innerHTML = `<a class="btn-floating"><i class="material-icons">person</i></a><span class="ml2"></span>`;
    el.querySelector('span').innerText = player.username;
    lobbyEl.appendChild(el);
  });
}

export function drawPlayersInVoting() {
  const players = getGameState().players;
  const lobbyEl = document.getElementById('voting-players-list');

  lobbyEl.innerHTML = '';
  players.forEach((player) => {
    const el = document.createElement('div');
    el.classList.add('row');
    el.innerHTML = `<a class="btn-floating"><i class="material-icons">person</i></a><span class="ml2"></span>`;
    el.querySelector('span').innerText = player.username;
    lobbyEl.appendChild(el);
  });
}

function addVotingEventHandlers() {
  const votingEls = document.querySelectorAll('#prompt-voting-list .row');
  console.log({ votingEls });
  votingEls.forEach((el: HTMLDivElement) =>
    el.addEventListener('click', () => {
      const userId = el.dataset['userid'];
      if (userId) sendPromptVote(userId);
    })
  );
}
