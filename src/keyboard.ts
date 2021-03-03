type fn = { (): void };
type handlerList = fn[][];

export class Keyboard {
  private isKeydown: boolean[] = [];
  private keydownEvent: handlerList = [];
  private keydownOnceEvent: handlerList = [];
  private keyupEvent: handlerList = [];
  constructor() {
    document.addEventListener('keydown', (e) => {
      const keyCode = e.keyCode;
      let bl = false;
      if (!this.isKeydown[keyCode]) {
        bl = this.exec(this.keydownOnceEvent, keyCode);
      }
      bl = this.exec(this.keydownEvent, keyCode);
      this.isKeydown[keyCode] = true;
      if (bl) {
        e.preventDefault();
      }
    });

    document.addEventListener('keyup', (e) => {
      const keyCode = e.keyCode;
      if (this.exec(this.keyupEvent, keyCode)) {
        e.preventDefault();
      }
      this.isKeydown[keyCode] = false;
    });
  }
  private exec(list: handlerList, keyCode: number): boolean {
    const handlers = list[keyCode];
    if (handlers) {
      handlers.forEach((item: fn) => {
        item();
      });
      return true;
    }
    return false;
  }
  addKeydownEvent(keyCode: number, handler: fn) {
    if (!this.keydownEvent[keyCode]) {
      this.keydownEvent[keyCode] = [handler];
      return;
    }
    this.keydownEvent[keyCode].push(handler);
  }
  addKeydownOnceEvent(keyCode: number, handler: fn) {
    if (!this.keydownOnceEvent[keyCode]) {
      this.keydownOnceEvent[keyCode] = [handler];
      return;
    }
    this.keydownEvent[keyCode].push(handler);
  }
  addKeyupEvent(keyCode: number, handler: fn) {
    if (!this.keyupEvent[keyCode]) {
      this.keyupEvent[keyCode] = [handler];
      return;
    }
    this.keyupEvent[keyCode].push(handler);
  }
  getKeydownList(): ReadonlyArray<boolean> {
    return this.isKeydown;
  }
}

export const keyboard = new Keyboard();
