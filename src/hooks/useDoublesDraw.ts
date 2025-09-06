import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Pair, Group, Round, Match } from "@/types/types";

export function useDoublesDraw() {
  const [playerListText, setPlayerListText] = useState<string>("");
  const [players, setPlayers] = useState<string[]>([]);
  const [groups, setGroups] = useState<Group<string>[]>([]);

  const navigate = useNavigate();

  const parseInput = (): void => {
    const lines = playerListText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    setPlayers((prev) => [...prev, ...lines]);
    setPlayerListText("");
  };

  const removeEntry = (index: number): void => {
    const updated = [...players];
    updated.splice(index, 1);
    setPlayers(updated);
  };

  const shuffleArray = <T>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const cleanName = (name: string): string => {
    return name.replace(/^\d+\.\s*/, "").trim();
  };

  const generateDoubles = (): string[] => {
    const fixedDoubles: string[] = [];
    const individualPlayers: string[] = [];

    players.forEach((player) => {
      if (player.toLowerCase().includes(" e ")) {
        fixedDoubles.push(player);
      } else {
        individualPlayers.push(player);
      }
    });

    const shuffled = shuffleArray(individualPlayers);
    const randomDoubles: string[] = [];

    for (let i = 0; i < shuffled.length; i += 2) {
      if (i + 1 < shuffled.length) {
        randomDoubles.push(`${shuffled[i]} e ${shuffled[i + 1]}`);
      } else {
        randomDoubles.push(shuffled[i]);
      }
    }

    return [...fixedDoubles, ...randomDoubles];
  };

  const sortGroups = (): void => {
    const doubles = generateDoubles();

    const doublesWithSinglePlayer = doubles.filter((d) => !d.includes(" e "));
    if (doublesWithSinglePlayer.length > 0) {
      const count = doublesWithSinglePlayer.length;
      alert(
        `Existe(m) ${count} jogador(es) sozinho(s) sem dupla. Por favor, adicione mais jogador(es) para formar as duplas ou ajuste as entradas.`
      );
      return;
    }

    const shuffled = shuffleArray(doubles);
    let groups: string[][] = [];

    const totalDoubles = shuffled.length;
    const groupsOfThree = Math.floor(totalDoubles / 3);
    let i = 0;

    for (; i < groupsOfThree * 3; i += 3) {
      groups.push(shuffled.slice(i, i + 3));
    }

    const remainingDoubles = shuffled.slice(i);

    if (remainingDoubles.length === 1) {
      const extraDouble = remainingDoubles[0];

      const groupToShare = groups.find((g) => g.length === 3);
      if (!groupToShare) {
        alert("Não é possível reorganizar os grupos com a dupla restante.");
        return;
      }

      groups = groups.filter((g) => g !== groupToShare);

      const newGroups = [
        [groupToShare[0], groupToShare[1]],
        [groupToShare[2], extraDouble],
      ];

      groups.push(...newGroups);
    } else if (remainingDoubles.length === 2 || remainingDoubles.length === 4) {
      for (let j = 0; j < remainingDoubles.length; j += 2) {
        groups.push(remainingDoubles.slice(j, j + 2));
      }
    } else if (remainingDoubles.length !== 0) {
      alert(
        `Número inválido de duplas restantes (${remainingDoubles.length}). Ajuste para múltiplos de 3 ou sobras de 1, 2 ou 4.`
      );
      return;
    }

    const rounds: Round<Pair>[] = groups.map((group) => {
      const matches: Match<Pair>[] = [];
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          const double1: Pair = group[i].split(" / ").map(cleanName) as Pair;
          const double2: Pair = group[j].split(" / ").map(cleanName) as Pair;
          matches.push({ double1: [double1], double2: [double2] });
        }
      }
      return matches;
    });

    setGroups(groups);
    navigate("/sorteios/duplas/grupos", {
      state: { rounds, players: groups },
    });
  };

  return {
    playerListText,
    setPlayerListText,
    players,
    setPlayers,
    groups,
    parseInput,
    removeEntry,
    sortGroups,
  };
}
