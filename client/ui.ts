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

export function showScreen(screen: SCREENS) {
  const allScreenIds = Object.values(screens).join(',');
  [...document.querySelectorAll(allScreenIds)].forEach((el) => el.classList.add('hidden'));
  document.querySelector(screens[screen]).classList.remove('hidden');
}

export function drawPlayersInLobby() {
  const players = ['Luke', 'Bob', 'Alice', 'Tom Cruise'];
  const lobbyEl = document.getElementById('lobby-players-list');

  lobbyEl.innerHTML = '';
  players.forEach((player) => {
    const el = document.createElement('div');
    el.classList.add('row');
    el.innerHTML = `<a class="btn-floating"><i class="material-icons">person</i></a><span class="ml2"></span>`;
    el.querySelector('span').innerText = player;
    lobbyEl.appendChild(el);
  });
}
