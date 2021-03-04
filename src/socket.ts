import { Vec2 } from 'planck-js';
import { IMessageEvent, w3cwebsocket } from 'websocket';

export interface SendMsg {
  playerId: number;
  pos: Vec2;
}

type Handler = { (msg: SendMsg): void };

export class Socket {
  constructor() {
    this.client = new w3cwebsocket('ws://localhost:8080/', 'echo-protocol');
    this.client.onclose = this.onclose.bind(this);
    this.client.onerror = this.onerror.bind(this);
    this.client.onopen = this.onopen.bind(this);
    this.client.onmessage = this.onmessage.bind(this);
  }
  private handler: Handler = () => {};
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
      const data: SendMsg = JSON.parse(e.data);
      this.handler(data);
    }
  }
  send(msg: SendMsg) {
    if (!this.isOpen) {
      return;
    }
    this.client.send(JSON.stringify(msg));
  }
  setHandler(handler: Handler) {
    this.handler = handler;
  }
}
