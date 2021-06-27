import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import pino from 'pino';

import Game from './game/game';
import { configureSockets } from './sockets/sockets';
import http from 'http';
import path from 'path';
import RoomManager from './game/room-manager';

const logger = pino();

async function main() {
  const app = express();
  const server = http.createServer(app);
  // Create single instance of game for all players to use
  const game = new Game('AAAA');
  const roomManager = new RoomManager();

  // Initalize socketIO
  configureSockets(server, roomManager);

  if ((process.env.NODE_ENV = 'production')) {
    app.use(express.static(path.join(__dirname, '..', 'client')));
  }

  const port = Number(process.env.PORT) || 9000;
  const host = process.env.HOST || 'localhost';
  try {
    server.listen(port, host, () => {
      logger.info(`listening on ${host}:${port}`);
    });
  } catch (error) {
    logger.error('Uncaught error: ', error);
  }
}

main().catch((error: any) => {
  logger.error({ msg: 'Fatal error occured', err: error, stack: error.stack });
});
