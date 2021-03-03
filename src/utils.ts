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
