import type { Player } from "../types/types";

export const pairKey = (p1: Player, p2: Player): string =>
  [p1, p2].sort().join("||");

export const alreadyPlayedTogether = (
  history: Set<string>,
  p1: Player,
  p2: Player
): boolean => {
  return history.has(pairKey(p1, p2));
};
