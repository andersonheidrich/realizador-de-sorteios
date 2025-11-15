import { useEffect, useState } from "react";
import type { Category, Tournament } from "@/types/types";

export const useTournamentCategories = (tournament: Tournament | null) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [originalCategories, setOriginalCategories] = useState<Category[]>([]);

  // Carrega categorias do torneio
  useEffect(() => {
    if (tournament?.categories) {
      setCategories(tournament.categories);
      setOriginalCategories(JSON.parse(JSON.stringify(tournament.categories)));
    }
  }, [tournament]);

  // Reseta categorias
  const resetCategories = () => {
    setCategories(JSON.parse(JSON.stringify(originalCategories)));
  };

  // Atualiza categorias
  const updateOriginalCategories = (newCategories: Category[]) => {
    setOriginalCategories(JSON.parse(JSON.stringify(newCategories)));
  };

  return {
    categories,
    originalCategories,
    setCategories,
    resetCategories,
    updateOriginalCategories,
  };
};
