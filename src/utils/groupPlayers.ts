import type { Group, Player } from "../types/types";

export const groupPlayers = (players: Player[], numGroups: number): Group[] => {
  const shuffled = [...players].sort(() => 0.5 - Math.random());
  const groups: Group[] = Array.from({ length: numGroups }, () => []);

  shuffled.forEach((player, index) => {
    groups[index % numGroups].push(player);
  });

  return groups;
};
