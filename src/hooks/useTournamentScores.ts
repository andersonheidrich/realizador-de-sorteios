import { useEffect, useState } from "react";
import type { Category, Group, Match, Tournament } from "@/types/types";

export const useTournamentScores = (tournament: Tournament | null) => {
  const [scores, setScores] = useState<
    Record<string, { team1: string; team2: string }>
  >({});
  const [originalScores, setOriginalScores] = useState<
    Record<string, { team1: string; team2: string }>
  >({});

  // Inicializa os placares (estado atual e original)
  useEffect(() => {
    if (!tournament?.categories?.length) return;

    const init: Record<string, { team1: string; team2: string }> = {};

    tournament.categories.forEach((category: Category, catIndex: number) => {
      category.groups?.forEach((group: Group, gi: number) => {
        group.matches.forEach((match: Match, mi: number) => {
          if (match.score) {
            const [a, b] = match.score.split("-").map((v: string) => v.trim());
            init[`${catIndex}-${gi}-${mi}`] = {
              team1: a || "",
              team2: b || "",
            };
          } else {
            init[`${catIndex}-${gi}-${mi}`] = { team1: "", team2: "" };
          }
        });
      });
    });

    setScores(init);
    setOriginalScores(init);
  }, [tournament]);

  return { scores, originalScores, setScores, setOriginalScores };
};
