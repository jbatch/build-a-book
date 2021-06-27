import { getGameState, GameState } from './game-state';
import { sendClientJoinMessage, sendHostStartMessage, sendPrompt, sendPromptVote, sendUpdateSettings } from './network';
import copy from 'copy-to-clipboard';

export enum SCREENS {
  HOME,
  LOBBY,
  GAME,
  VOTING,
  PROMPTS,
  END,
}

const screens = {
  [SCREENS.HOME]: '#screen-home',
  [SCREENS.LOBBY]: '#screen-lobby',
  [SCREENS.GAME]: '#screen-game',
  [SCREENS.VOTING]: '#screen-voting',
  [SCREENS.PROMPTS]: '#screen-prompts',
  [SCREENS.END]: '#screen-end',
};

export function initUi() {
  // set up event handlers for button clicks, etc
  const usernameInput = document.getElementById('username') as HTMLInputElement;
  const playBtn = document.getElementById('play-btn');
  const hostPrivateGameButton = document.getElementById('host-private-game-btn');
  const inviteBtn = document.getElementById('invite-btn');
  const startBtn = document.getElementById('start-btn');
  const submitPromptBtn = document.getElementById('submit-prompt-btn');
  const urlParams = new URLSearchParams(window.location.search);
  const roomIdParam = urlParams.get('roomId');

  hostPrivateGameButton.addEventListener('click', () => sendClientJoinMessage(usernameInput.value));
  startBtn.addEventListener('click', sendHostStartMessage);
  submitPromptBtn.addEventListener('click', () => {
    const prompt = (document.getElementById('prompt-input') as HTMLInputElement).value;
    sendPrompt(prompt);
    console.log('sending', { prompt });
  });
  inviteBtn.addEventListener('click', () => {
    copy(`${window.location.origin}?roomId=${roomIdParam}`);
    inviteBtn.innerText = 'Copied!';
    setTimeout(() => {
      inviteBtn.innerText = 'Copy Invite Link';
    }, 3000);
  });
  if (roomIdParam) hostPrivateGameButton.innerText = 'Join game';
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
    const waitingStr = player.actionPending ? ' (waiting...)' : '';
    el.querySelector('span').innerText = player.username + waitingStr;
    if (player.actionPending) el.querySelector('.btn-floating').classList.add('disabled');

    lobbyEl.appendChild(el);
  });
}

export function drawPageNumberInSubmittingPrompts() {
  const gameState = getGameState();
  const heading = document.getElementById('submitting-prompts-heading') as HTMLHeadingElement;
  const promptInput = document.getElementById('prompt-input') as HTMLInputElement;
  const promptInputLabel = document.getElementById('prompt-input-label');

  heading.innerText = `What do you want to say on page ${gameState.currentPage + 1}?`;
  promptInput.value = '';
  promptInputLabel.innerText = `Page ${gameState.currentPage + 1} should say:`;
}

export function drawPlayersInVoting() {
  const players = getGameState().players;
  const lobbyEl = document.getElementById('voting-players-list');

  lobbyEl.innerHTML = '';
  players.forEach((player) => {
    const el = document.createElement('div');
    el.classList.add('row');
    el.innerHTML = `<a class="btn-floating"><i class="material-icons">person</i></a><span class="ml2"></span>`;
    const waitingStr = player.actionPending ? ' (waiting...)' : '';
    el.querySelector('span').innerText = player.username + waitingStr;
    if (player.actionPending) el.querySelector('.btn-floating').classList.add('disabled');
    lobbyEl.appendChild(el);
  });
}

export function addVotingEventHandlers() {
  const votingEls = document.querySelectorAll('#prompt-voting-list .row');
  votingEls.forEach((el: HTMLDivElement) =>
    el.addEventListener('click', () => {
      const userId = el.dataset['userid'];
      if (userId) sendPromptVote(userId);
    })
  );
}

export function drawPromptsInVoting() {
  const gameState = getGameState();
  const prompts = gameState.prompts;
  const promptsContainer = document.getElementById('prompt-voting-list');
  promptsContainer.innerHTML = '';
  const heading = document.createElement('h4');
  heading.innerText = `Choose the best sentence for page ${gameState.currentPage + 1}`;
  promptsContainer.appendChild(heading);

  prompts.forEach((prompt) => {
    const el = document.createElement('div');
    el.dataset['userid'] = prompt.userId;
    el.classList.add('row');
    el.innerHTML = `<div class="col s6 offset-s2 card grey lighten-4"><div class="card-content center-align"><h6></h6></div></div>`;
    el.querySelector('h6').innerText = prompt.prompt;
    promptsContainer.appendChild(el);
  });
}

export function addPromptToDrawing() {
  const state = getGameState();
  if (state.currentScreen !== SCREENS.GAME) return;
  const promptEl = document.querySelector('#drawing-prompt') as HTMLHeadingElement;
  promptEl.innerText = `"${state.currentPrompt.prompt}"`;
}

export function updateTimerInDrawing() {
  const state = getGameState();
  const timerEl = document.querySelector('#screen-game .timer span') as HTMLSpanElement;
  timerEl.innerText = `${state.timeRemaining}s`;
}

export function drawUpdatedSettings() {
  const gameSettings = getGameState().gameSettings;
  const numPagesInput = document.getElementById('num_pages') as HTMLInputElement;
  const drawTimeInput = document.getElementById('draw_time') as HTMLInputElement;

  numPagesInput.value = String(gameSettings.pages);
  drawTimeInput.value = String(gameSettings.drawingTime);
}

export function addSettingsUpdatedHandlers() {
  const numPagesInput = document.getElementById('num_pages') as HTMLInputElement;
  const drawTimeInput = document.getElementById('draw_time') as HTMLInputElement;

  const sendUpdatedSettings = () => {
    const pages = numPagesInput.value;
    const drawingTime = drawTimeInput.value;
    // Check values are valid
    // TODO Add min/max bounds to these numbers
    if (isNaN(parseInt(pages)) || isNaN(parseInt(drawingTime))) {
      // Don't update settings with invalid values
      return;
    }
    sendUpdateSettings({ pages: Number(pages), drawingTime: Number(drawingTime) });
  };
  numPagesInput.addEventListener('blur', sendUpdatedSettings);
  drawTimeInput.addEventListener('blur', sendUpdatedSettings);
}

export function showFinalGif() {}
