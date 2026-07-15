export const defaultPersonImage = "/staff/pfp.jpg";

export function randomDigits(length = 4) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

export function randomLabel(prefix: string) {
  return `${prefix} ${randomDigits(5)}`;
}

export function randomPhone() {
  return `+961 1 ${randomDigits(3)} ${randomDigits(3)}`;
}

export function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length
  ) {
    return items;
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}
