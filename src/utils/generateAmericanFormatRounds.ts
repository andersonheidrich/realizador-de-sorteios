import type { Match, Pair, Player, Round } from "../types/types";

declare function shuffleArray<T>(array: T[]): T[];
declare function alreadyPlayedTogether(
  history: Pair[],
  player1: Player,
  player2: Player
): boolean;

export const generateAmericanFormatRounds = (
  players: Player[],
  numRounds: number
): Round[] => {
  const rounds: Round[] = [];
  const partnerHistory: Pair[] = [];

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
          partnerHistory.push(pair1);
          partnerHistory.push(pair2);
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
