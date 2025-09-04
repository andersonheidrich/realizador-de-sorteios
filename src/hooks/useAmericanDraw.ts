import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { groupPlayers } from "../utils/groupPlayers";
import { generateAmericanFormatRounds } from "../utils/generateAmericanFormatRounds";
import type { Player, Round } from "../types/types";

export function useAmericanDraw() {
  const [playerListText, setPlayerListText] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [numGroups, setNumGroups] = useState<number>(1);
  const [roundsResult, setRoundsResult] = useState<Round[][]>([]);

  const navigate = useNavigate();

  const addPlayerList = (): void => {
    const rawList = playerListText.split(/\r?\n|,/);
    const cleanedList = rawList
      .map((name) => name.replace(/^\s*\d+\s*[-.:]?\s*/g, "").trim())
      .filter((name) => name.length > 0 && !players.includes(name));

    setPlayers((prev) => [...prev, ...cleanedList]);
    setPlayerListText("");
  };

  const removePlayer = (nameToRemove: Player): void => {
    setPlayers((prev) => prev.filter((name) => name !== nameToRemove));
  };

  const handleDraw = (): void => {
    const totalPlayers = players.length;

    if (totalPlayers === 0) {
      alert("Adicione jogadores antes de sortear.");
      return;
    }

    if (totalPlayers % 4 !== 0) {
      alert("O número de jogadores deve ser divisível por 4.");
      return;
    }

    const expectedGroups = totalPlayers / 4;

    if (numGroups !== expectedGroups) {
      alert(
        `Você deve formar exatamente ${expectedGroups} grupo(s) para ${totalPlayers} jogadores.`
      );
      return;
    }

    const grouped = groupPlayers(players, numGroups);

    const isValid = grouped.every((group) => group.length === 4);
    if (!isValid) {
      alert(
        "Todos os grupos devem conter exatamente 4 jogadores. Sorteio cancelado."
      );
      return;
    }

    const roundsByGroup: Round[][] = grouped.map((group) =>
      generateAmericanFormatRounds(group, 3)
    );

    setRoundsResult(roundsByGroup);

    navigate("/sorteio/americano/grupos", {
      state: { rounds: roundsByGroup, players: grouped },
    });
  };

  return {
    playerListText,
    setPlayerListText,
    players,
    setPlayers,
    numGroups,
    setNumGroups,
    roundsResult,
    addPlayerList,
    removePlayer,
    handleDraw,
  };
}
