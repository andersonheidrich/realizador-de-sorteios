import type { Match, Pair, Round } from "@/types/types";
import { shuffleArray } from "./shuffleArray";

export const generateDoublesFormatRounds = (
  pairs: Pair[],
  numRounds: number
): Round<Pair>[] => {
  const rounds: Round<Pair>[] = [];

  for (let r = 0; r < numRounds; r++) {
    const shuffled = shuffleArray(pairs);
    const round: Round<Pair> = [];

    for (let i = 0; i < shuffled.length; i += 2) {
      if (i + 1 < shuffled.length) {
        const match: Match<Pair> = {
          double1: [shuffled[i]],
          double2: [shuffled[i + 1]],
        };
        round.push(match);
      }
    }

    rounds.push(round);
  }

  return rounds;
};
