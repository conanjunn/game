import { Vec2 } from 'planck-js';
import { IMessageEvent, w3cwebsocket } from 'websocket';

type Type1 = {
  type: 1;
  playerId: number;
  pos: Vec2;
};

type Type2 = {
  type: 2;
  playerId: number;
};

export type Types = Type1 | Type2;

export class Socket {
  constructor(id: number) {
    this.client = new w3cwebsocket(
      `ws://localhost:8080?id=${id}`,
      'echo-protocol'
    );
    this.playerId = id;
    this.client.onclose = this.onclose.bind(this);
    this.client.onerror = this.onerror.bind(this);
    this.client.onopen = this.onopen.bind(this);
    this.client.onmessage = this.onmessage.bind(this);
  }
  private playerId: number;
  private handlers: { (resp: Types): void }[] = [];
  private client: w3cwebsocket;
  private isOpen: boolean = false;
  private onerror() {
    console.log('Connection Error');
  }
  private onopen() {
    console.log('WebSocket Client Connected');
    this.isOpen = true;
  }
  private onclose() {
    console.log('echo-protocol Client Closed');
  }
  private onmessage(e: IMessageEvent) {
    if (typeof e.data === 'string') {
      console.log("Received: '" + e.data + "'");
      const data: Types = JSON.parse(e.data);
      if (data.playerId === this.playerId) {
        return;
      }
      this.handlers.forEach((item) => {
        item(data);
      });
    }
  }
  send(msg: Types) {
    if (!this.isOpen) {
      return;
    }
    this.client.send(JSON.stringify(msg));
  }
  addHandler(handler: { (resp: Types): void }) {
    this.handlers.push(handler);
  }
}
