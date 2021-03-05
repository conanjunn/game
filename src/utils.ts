import seedrandom from 'seedrandom';

type Iterator<T> = {
  getNext(): Iterator<T>;
} | null;

export const iterate = <C>(iterator: Iterator<C>, fn: { (item: C): void }) => {
  if (!iterator) {
    return;
  }
  fn(<C>(<unknown>iterator));
  iterate(iterator.getNext(), fn);
};

export const throttle = (max: number, callback: () => void) => {
  let counter = 0;
  return (amount: number) => {
    counter += amount;
    if (counter >= max) {
      callback();
      counter = 0;
    }
  };
};

export class SeedRandom {
  constructor(seed: string) {
    this.ran = seedrandom(seed);
  }

  private ran: seedrandom.prng;
  random(min: number, max: number): number {
    return min + Math.floor(this.ran() * (max - min + 1));
  }
  randomMulti(min: number, max: number, count: number) {
    const ret = [];
    for (let index = 0; index < count; index++) {
      ret.push(this.random(min, max));
    }
    return ret;
  }
}
