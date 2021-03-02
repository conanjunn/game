interface Iterator<T> {
  getNext(): Iterator<T> | null;
}

export const iterate = <C>(
  iterator: Iterator<C> | null,
  fn: { (item: Iterator<C>): void }
) => {
  if (!iterator) {
    return;
  }
  fn(iterator);
  iterate(iterator.getNext(), fn);
};
