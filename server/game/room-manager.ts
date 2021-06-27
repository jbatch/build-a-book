import pino from 'pino';
import { SafeSocket } from 'server/sockets/safe-socket';
import Game from './game';

const logger = pino();

export default class RoomManager {
  games: { [room: string]: Game };
  constructor() {
    this.games = {};
  }

  createNewGame(socket: SafeSocket, room: string, hostUsername: string) {
    if (this.games[room]) {
      throw new Error('Trying to create a room that already exists');
    }
    const game = new Game(room);
    game.addPlayer(socket, hostUsername);
    this.games[room] = game;
  }

  removePlayerFromRoom(socket: SafeSocket) {
    const game = this.findGameForSocket(socket);
    if (!game) {
      throw new Error(`Game not found to remove player ${socket.id} from`);
    }
    game.removePlayer(socket);
    if (game.getPlayers().length == 0) {
      logger.info(`Deleting room ${game.getRoomCode()} because last player left game`);
      delete this.games[game.getRoomCode()];
    } else {
      logger.info(`Remaining players in room: ${game.getPlayers().length}`);
    }
  }

  findGameForSocket(socket: SafeSocket) {
    return Object.values(this.games).find((g) => g.getPlayers());
  }
}
