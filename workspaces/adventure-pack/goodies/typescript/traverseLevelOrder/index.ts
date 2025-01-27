import { isNonNullish } from "../isNonNullish";

export function* traverseLevelOrder<
  T extends { left?: T | null | undefined; right?: T | null | undefined },
>(root: T | null | undefined): Generator<T[], void, void> {
  if (root == null) {
    return;
  }

  let level = [root];
  do {
    yield level;

    level = level
      .flatMap((node) => [node.left, node.right])
      .filter(isNonNullish);
  } while (level.length > 0);
}
