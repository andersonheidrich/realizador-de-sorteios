import type { Match, Pair, Player, Round } from "../types/types";
import { shuffleArray } from "./shuffleArray";
import { pairKey, alreadyPlayedTogether } from "./pairs";

export const generateAmericanFormatRounds = (
  players: Player[],
  numRounds: number
): Round[] => {
  const rounds: Round[] = [];
  const partnerHistory = new Set<string>();

  for (let r = 0; r < numRounds; r++) {
    let attempts = 0;
    const maxAttempts = 100;
    const round: Round = [];
    let shuffled = shuffleArray(players);

    while (shuffled.length >= 4 && attempts < maxAttempts) {
      const group = shuffled.slice(0, 4);

      const validPairings: [Pair, Pair][] = [
        [
          [group[0], group[1]],
          [group[2], group[3]],
        ],
        [
          [group[0], group[2]],
          [group[1], group[3]],
        ],
        [
          [group[0], group[3]],
          [group[1], group[2]],
        ],
      ];

      let chosen: Match | null = null;
      for (const [pair1, pair2] of validPairings) {
        if (
          !alreadyPlayedTogether(partnerHistory, pair1[0], pair1[1]) &&
          !alreadyPlayedTogether(partnerHistory, pair2[0], pair2[1])
        ) {
          chosen = { double1: pair1, double2: pair2 };
          partnerHistory.add(pairKey(pair1[0], pair1[1]));
          partnerHistory.add(pairKey(pair2[0], pair2[1]));
          break;
        }
      }

      if (chosen) {
        round.push(chosen);
        shuffled.splice(0, 4);
      } else {
        shuffled = shuffleArray(shuffled);
        attempts++;
      }
    }

    rounds.push(round);
  }

  return rounds;
};
