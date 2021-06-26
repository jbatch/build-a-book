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
    safeSocket.safeOn('client-disconnect', handleClientDisconnect);
    safeSocket.safeOn('client-location', handleClientLocation);
    safeSocket.safeOn('client-draw', handleClientDraw);

    function handleClientJoin({ username }: ClientJoin) {
      logger.info(`${client.id} (${username}) joining game`);
      client.username = username;
      // Put player in game.
      game.addPlayer(safeSocket, username);
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
      game.handleDrawImage(safeSocket, input);
    }
  });
}
