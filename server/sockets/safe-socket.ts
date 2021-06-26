import { Socket, Server } from 'socket.io';

export type SafeSocket = Socket & {
  safeBroadcast: <Event extends keyof SocketEvents>(event: Event, payload?: SocketEvents[Event]) => void;
  safeEmit: <Event extends keyof SocketEvents>(event: Event, payload?: SocketEvents[Event]) => void;
  safeOn: <Event extends keyof SocketEvents>(event: Event, callback: (payload?: SocketEvents[Event]) => void) => void;
  safeRoomEmit: <Event extends keyof SocketEvents>(
    roomCode: string,
    event: Event,
    payload?: SocketEvents[Event]
  ) => void;
};

export function getSafeSocket(client: Socket, server: Server): SafeSocket {
  function safeBroadcast<Event extends keyof SocketEvents>(event: Event, payload?: SocketEvents[Event]): void {
    server.emit(event, payload);
  }
  function safeEmit<Event extends keyof SocketEvents>(event: Event, payload?: SocketEvents[Event]): void {
    client.emit(event, payload);
  }
  function safeOn<Event extends keyof SocketEvents>(event: Event, callback: (payload?: SocketEvents[Event]) => void) {
    client.on(event, callback);
  }
  function safeRoomEmit<Event extends keyof SocketEvents>(
    roomCode: string,
    event: Event,
    payload?: SocketEvents[Event]
  ) {
    server.to(roomCode).emit(event, payload);
  }
  return Object.assign(client, { safeBroadcast, safeEmit, safeOn, safeRoomEmit });
}
