import pino from 'pino';
import Player from './player';
import { SafeSocket } from '../sockets/safe-socket';
import Constants from '../../shared/constants';
import { createCanvas, Canvas, CanvasRenderingContext2D, Image } from 'canvas';

const FRAMES_PER_SECOND = 1; // 60;

const logger = pino();
export default class Game {
  // Game State
  room: string;
  page: number;
  status: RoomStatus;
  prompts?: Array<Prompt>;
  bookPages?: Array<BookPage>;
  currentPrompt?: Prompt;
  timeRemaining: number;
  timer?: ReturnType<typeof setInterval>;
  players: { [id: string]: Player };
  gameSettings: GameSettings;

  // Server state
  sockets: { [id: string]: SafeSocket };

  // Drawing stuff
  canvas: Canvas;
  canvasCtx: CanvasRenderingContext2D;
  lastUpdatedTime: number;
  shouldSendUpdate: boolean;
  constructor(room: string) {
    this.room = room;
    this.page = 0;
    this.status = 'lobby';
    this.prompts = [];
    this.bookPages = [];
    this.currentPrompt = undefined;
    this.timeRemaining = 0;
    this.timer = undefined;
    this.canvas = createCanvas(800, 450);
    this.canvasCtx = this.canvas.getContext('2d');

    this.sockets = {};
    this.players = {};
    this.gameSettings = {
      drawingTime: 60,
      pages: 10,
    };
    this.lastUpdatedTime = Date.now();
    this.shouldSendUpdate = false;
    // setInterval(this.update.bind(this), 1000 / FRAMES_PER_SECOND);
  }

  getRoomCode() {
    return this.room;
  }

  getPlayers() {
    return Object.values(this.players);
  }

  addPlayer(socket: SafeSocket, username: string) {
    this.sockets[socket.id] = socket;
    const color = '#' + ((Math.random() * 0xffffff) << 0).toString(16);
    const [x, y] = [
      (Math.random() * (0.8 - 0.2) + 0.2) * Constants.MAP_SIZE,
      (Math.random() * (0.8 - 0.2) + 0.2) * Constants.MAP_SIZE,
    ];
    this.players[socket.id] = new Player(socket.id, username, color, x, y);
    socket.safeEmit('server-welcome', { id: socket.id, color, backgroundImage: this.canvas.toDataURL() });
  }

  handleClientHostUpdateSettings(socket: SafeSocket, { gameSettings }: ClientHostUpdateSettings) {
    this.gameSettings = gameSettings;
    this.broadcastRoomState(socket);
    logger.info(`Updated game settings in room ${this.room} [%o]`, { gameSettings });
  }
  handleClientHostStart(socket: SafeSocket, clientHostStart: ClientHostStart) {
    logger.info(`Host started game in room ${this.room}`);
    this.currentPrompt = undefined;
    this.prompts = [];
    Object.values(this.players).map((p) => (p.actionPending = true));
    this.status = 'submitting-prompts';
    this.broadcastRoomState(socket);
  }
  handleClientSubmitPrompt(socket: SafeSocket, { prompt }: ClientSubmitPrompt) {
    this.prompts.push({ userId: socket.id, prompt, votes: 0 });
    const player = this._findPlayer(socket);
    player.actionPending = false;
    if (Object.values(this.players).every((p) => !p.actionPending)) {
      Object.values(this.players).map((p) => (p.actionPending = true));
      this.status = 'voting';
    }
    this.broadcastRoomState(socket);
  }
  handleClientVotePrompt(socket: SafeSocket, { userId }: ClientVotePrompt) {
    const votedForPrompt = this.prompts.find((p) => (p.userId = userId));
    if (!votedForPrompt) {
      return;
    }
    votedForPrompt.votes++;
    const player = this._findPlayer(socket);
    if (!player) {
      return; // Return to avoid crashing server if player disconnected before message got processed.
    }
    player.actionPending = false;
    if (Object.values(this.players).every((p) => !p.actionPending)) {
      this.status = 'drawing';
      Object.values(this.players).map((p) => (p.actionPending = true));
      this.currentPrompt = this._getWinningPrompt();
      this.prompts = [];
      this.timeRemaining = this.gameSettings.drawingTime;
      this.timer = setInterval(() => {
        this.timeRemaining--;
        if (this.timeRemaining === -1) {
          clearInterval(this.timer);
          const newBookPage: BookPage = { prompt: this.currentPrompt, imgStr: this.canvas.toDataURL() };
          this.bookPages.push(newBookPage);
          this.canvas = createCanvas(800, 450);
          this.canvasCtx = this.canvas.getContext('2d');
          this.page++;
          if (this.page === this.gameSettings.pages) {
            this.status = 'end';
            // Send back end state with all pages in it.
          } else {
            // Still move pages to create.
            this.status = 'submitting-prompts';
          }
        }
        this.broadcastRoomState(socket);
      }, 1000);
    }
    this.broadcastRoomState(socket);
  }

  removePlayer(socket: SafeSocket) {
    logger.info(`Removing player ${socket.id} from room ${this.room}.`);
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
      // Immediately broadcast new background to all clients in the same room
      socket.safeRoomEmit('AAAA', 'server-update-background', { backgroundImage: this.canvas.toDataURL() });
    };
    img.onerror = (err) => {
      throw err;
    };
    img.src = imageData;
  }

  handleClientCanvasReset(socket: SafeSocket) {
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    socket.safeBroadcast('server-update-background', { backgroundImage: this.canvas.toDataURL() });
  }

  broadcastRoomState(socket: SafeSocket) {
    socket.safeRoomEmit(this.room, 'server-room-state', this._serializeRoomState());
  }

  _serializeRoomState() {
    const requiredFields = {
      room: this.room,
      players: Object.entries(this.players).map(([_, player]) => player.serializeForUpdate()),
      page: this.page,
      status: this.status,
      gameSettings: this.gameSettings,
    };
    switch (this.status) {
      case 'lobby':
      case 'submitting-prompts':
      case 'end':
        return { ...requiredFields, bookPages: this.bookPages };
      case 'voting':
        return { ...requiredFields, prompts: this.prompts };
      case 'drawing':
        return { ...requiredFields, currentPrompt: this.currentPrompt, timeRemaining: this.timeRemaining };
    }
  }

  _findPlayer(socket: SafeSocket) {
    return Object.values(this.players).find((p) => p.id === socket.id);
  }

  _getWinningPrompt() {
    const maxVotes = this.prompts.map((p) => p.votes).reduce((prev, curr) => (curr > prev ? curr : prev), 0);
    const tiedPrompts = this.prompts.filter((p) => p.votes == maxVotes);
    return tiedPrompts[Math.floor(Math.random() * tiedPrompts.length)];
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
