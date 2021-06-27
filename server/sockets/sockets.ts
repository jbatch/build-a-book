import socketIo from 'socket.io';
import http from 'http';
import pino from 'pino';
import { getSafeSocket } from './safe-socket';
import RoomManager from '../game/room-manager';

const logger = pino();

export function configureSockets(appServer: http.Server, roomManager: RoomManager) {
  const server = socketIo(appServer, { pingTimeout: 2000, pingInterval: 10000 });
  logger.info('Started socket.io server on');

  server.on('connect', (client: socketIo.Socket & { username: string }) => {
    logger.info('Client connected');
    const safeSocket = getSafeSocket(client, server);

    // Setup event listeners for client
    safeSocket.safeOn('client-join', handleClientJoin);
    safeSocket.safeOn('client-host-update-settings', handleClientHostUpdateSettings);
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
      let game = roomManager.findGameForSocket(safeSocket);
      if (game) {
        game.addPlayer(safeSocket, username);
      } else {
        game = roomManager.createNewGame(safeSocket, room, username);
      }
      game.broadcastRoomState(safeSocket);
    }

    function handleClientHostUpdateSettings(clientHostUpdateSettings: ClientHostUpdateSettings) {
      const game = roomManager.findGameForSocket(safeSocket);
      game.handleClientHostUpdateSettings(safeSocket, clientHostUpdateSettings);
    }
    function handleClientHostStart(clientHostStart: ClientHostStart) {
      const game = roomManager.findGameForSocket(safeSocket);
      game.handleClientHostStart(safeSocket, clientHostStart);
    }
    function handleClientSubmitPrompt(clientSubmitPrompt: ClientSubmitPrompt) {
      const game = roomManager.findGameForSocket(safeSocket);
      game.handleClientSubmitPrompt(safeSocket, clientSubmitPrompt);
    }
    function handleClientVotePrompt(clientVotePrompt: ClientVotePrompt) {
      const game = roomManager.findGameForSocket(safeSocket);
      game.handleClientVotePrompt(safeSocket, clientVotePrompt);
    }

    function handleClientDisconnect() {
      logger.info(`${client.id} (${client.username || 'unknown'}) disconnected`);
      try {
        roomManager.removePlayerFromRoom(safeSocket);
      } catch (error) {}
    }

    function handleClientLocation(input: ClientLocation) {
      const game = roomManager.findGameForSocket(safeSocket);
      game.handleInput(safeSocket, input);
    }

    function handleClientDraw(input: ClientDraw) {
      const game = roomManager.findGameForSocket(safeSocket);
      if (!game) {
        return;
      }
      game.handleDrawImage(safeSocket, input);
    }

    function handleClientCanvasReset() {
      const game = roomManager.findGameForSocket(safeSocket);
      game.handleClientCanvasReset(safeSocket);
    }
  });
}
