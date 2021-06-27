import socketIo from 'socket.io';
import http from 'http';
import pino from 'pino';
import Game from '../game/game';
import { getSafeSocket } from './safe-socket';

const logger = pino();

export function configureSockets(appServer: http.Server, game: Game) {
  const server = socketIo(appServer, { pingTimeout: 2000, pingInterval: 10000 });
  logger.info('Started socket.io server on');

  server.on('connect', (client: socketIo.Socket & { username: string }) => {
    logger.info('Client connected');
    const safeSocket = getSafeSocket(client, server);

    // Setup event listeners for client
    safeSocket.safeOn('client-join', handleClientJoin);
    safeSocket.safeOn('client-host-settings-update', handleClientHostUpdateSettings);
    safeSocket.safeOn('client-host-start', handleClientHostStart);
    safeSocket.safeOn('client-submit-prompt', handleClientSubmitPrompt);
    safeSocket.safeOn('client-vote-prompt', handleClientVotePrompt);
    safeSocket.safeOn('disconnect', handleClientDisconnect);
    safeSocket.safeOn('client-location', handleClientLocation);
    safeSocket.safeOn('client-draw', handleClientDraw);
    safeSocket.safeOn('client-canvas-reset', handleClientCanvasReset);

    function handleClientJoin({ username, room }: ClientJoin) {
      logger.info(`${client.id} (${username}) joining game. Room: ${room}`);
      client.username = username;
      safeSocket.join(room);
      // Put player in game.
      game.addPlayer(safeSocket, username);
    }

    function handleClientHostUpdateSettings(clientHostUpdateSettings: ClientHostUpdateSettings) {
      game.handleClientHostUpdateSettings(safeSocket, clientHostUpdateSettings);
    }
    function handleClientHostStart(clientHostStart: ClientHostStart) {
      game.handleClientHostStart(safeSocket, clientHostStart);
    }
    function handleClientSubmitPrompt(clientSubmitPrompt: ClientSubmitPrompt) {
      game.handleClientSubmitPrompt(safeSocket, clientSubmitPrompt);
    }
    function handleClientVotePrompt(clientVotePrompt: ClientVotePrompt) {
      game.handleClientVotePrompt(safeSocket, clientVotePrompt);
    }

    function handleClientDisconnect() {
      logger.info(`${client.id} (${client.username || 'unknown'}) disconnected`);
      // Remove player from game.
      game.removePlayer(safeSocket);
    }

    function handleClientLocation(input: ClientLocation) {
      game.handleInput(safeSocket, input);
    }

    function handleClientDraw(input: ClientDraw) {
      // logger.info("Got [handleClientDraw]: %o", input)
      game.handleDrawImage(safeSocket, input);
    }

    function handleClientCanvasReset() {
      game.handleClientCanvasReset(safeSocket);
    }
  });
}
