import pino from 'pino';
import Player from './player';
import { SafeSocket } from '../sockets/safe-socket';
import Constants from '../../shared/constants';
import { createCanvas, Canvas, CanvasRenderingContext2D, Image } from 'canvas';

const FRAMES_PER_SECOND = 1; // 60;

const logger = pino();

export default class Game {
  canvas: Canvas;
  canvasCtx: CanvasRenderingContext2D;
  sockets: { [id: string]: SafeSocket };
  players: { [id: string]: Player };
  lastUpdatedTime: number;
  shouldSendUpdate: boolean;
  constructor() {
    this.canvas = createCanvas(800, 450);
    this.canvasCtx = this.canvas.getContext('2d');

    this.sockets = {};
    this.players = {};
    this.lastUpdatedTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / FRAMES_PER_SECOND);
  }

  addPlayer(socket: SafeSocket, username: string): { id: string; color: string } {
    this.sockets[socket.id] = socket;
    const color = '#' + ((Math.random() * 0xffffff) << 0).toString(16);
    const [x, y] = [
      (Math.random() * (0.8 - 0.2) + 0.2) * Constants.MAP_SIZE,
      (Math.random() * (0.8 - 0.2) + 0.2) * Constants.MAP_SIZE,
    ];
    this.players[socket.id] = new Player(socket.id, username, color, x, y);
    return { id: socket.id, color };
  }

  removePlayer(socket: SafeSocket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  handleInput(socket: SafeSocket, { endX, endY }: ClientLocation) {
    const player = this.players[socket.id];
    if (player) {
      player.x = endX;
      player.y = endY;
    }
  }

  handleDrawImage(socket: SafeSocket, { imageData }: ClientDraw) {
    const player = this.players[socket.id];
    if (!player) {
      return;
    }
    const img = new Image();
    img.onload = () => {
      this.canvasCtx.drawImage(img, 0, 0);
      // Immediately broadcast new background to all clients
      socket.safeBroadcast('server-update-background', { backgroundImage: this.canvas.toDataURL() });
    };
    img.onerror = (err) => {
      throw err;
    };
    img.src = imageData;
  }

  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdatedTime) / 1000;
    const lastUpdate = this.lastUpdatedTime;
    this.lastUpdatedTime = now;

    // Update all players
    Object.values(this.players).forEach((player) => {
      player.update(dt);
    });

    // Remove all players that died and send updated state to all players
    const cursors = Object.entries(this.players).map(([id, player]) => player.serializeForUpdate());
    const imageData = this.canvas.toDataURL();
    Object.entries(this.players).forEach(([id, player]) => {
      const socket = this.sockets[id];
      if (socket) {
        socket.safeEmit('server-update-cursors', {
          t: Date.now(),
          serverFps: 1 / dt,
          cursors,
        });
      }
    });
  }
}
