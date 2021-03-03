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
