import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import type { Pair, Group, Round, Match } from "@/types/types";

export function useDoublesDraw() {
  const [playerListText, setPlayerListText] = useState<string>("");
  const [players, setPlayers] = useState<string[]>([]);
  const [groups, setGroups] = useState<Group<string>[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // === Adicionar jogadores manualmente ===
  const parseInput = (): void => {
    const lines = playerListText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    setPlayers((prev) => [...prev, ...lines]);
    setPlayerListText("");
  };

  // === Remover um jogador ===
  const removeEntry = (index: number): void => {
    const updated = [...players];
    updated.splice(index, 1);
    setPlayers(updated);
  };

  // === Funções auxiliares ===
  const shuffleArray = <T>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const cleanName = (name: string): string => {
    return name.replace(/^\d+\.\s*/, "").trim();
  };

  // === Gerar duplas aleatórias ===
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

  // === Sortear grupos e salvar no backend ===
  const sortGroups = async (): Promise<void> => {
    const doubles = generateDoubles();

    // validação
    const doublesWithSinglePlayer = doubles.filter((d) => !d.includes(" e "));
    if (doublesWithSinglePlayer.length > 0) {
      alert(
        `Existe(m) ${doublesWithSinglePlayer.length} jogador(es) sozinho(s). Adicione mais jogador(es) para formar duplas.`
      );
      return;
    }

    const shuffled = shuffleArray(doubles);
    let groups: string[][] = [];

    const totalDoubles = shuffled.length;
    const groupsOfThree = Math.floor(totalDoubles / 3);
    let i = 0;

    // cria grupos de 3 duplas
    for (; i < groupsOfThree * 3; i += 3) {
      groups.push(shuffled.slice(i, i + 3));
    }

    // trata sobras
    const remainingDoubles = shuffled.slice(i);

    if (remainingDoubles.length === 1) {
      const extraDouble = remainingDoubles[0];
      const groupToShare = groups.find((g) => g.length === 3);
      if (!groupToShare) {
        alert("Não foi possível reorganizar os grupos com a dupla restante.");
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
        `Número inválido de duplas restantes (${remainingDoubles.length}). Ajuste o total.`
      );
      return;
    }

    // gera as rodadas
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

    // monta objeto Draw
    const drawData = {
      title: `Sorteio - ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString(),
      type: "doubles",
      players,
      teams: doubles.map((d) => d.split(" e ").map(cleanName)),
      groups,
      rounds,
    };

    // salva no backend
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await api.post("draws/create", drawData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // redireciona para a tela de grupos
      navigate("/draws/doubles/groups", {
        state: { rounds, players: groups },
      });
    } catch (error) {
      console.error("Erro ao salvar sorteio:", error);
      alert("Erro ao salvar o sorteio no servidor.");
    } finally {
      setLoading(false);
      setGroups(groups);
    }
  };

  return {
    playerListText,
    setPlayerListText,
    players,
    setPlayers,
    groups,
    loading,
    parseInput,
    removeEntry,
    sortGroups,
  };
}
