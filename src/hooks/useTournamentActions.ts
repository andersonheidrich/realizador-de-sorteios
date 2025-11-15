/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useFlash } from "./useFlash";
import type { Category } from "@/types/types";
import api from "@/services/api";

export const useTournamentActions = (
  tournamentId: string | undefined,
  fetchTournamentById: (id: string) => Promise<void>,
  updateOriginalCategories: (categories: Category[]) => void
) => {
  const { showFlash } = useFlash();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isEditingInfo, setIsEditingInfo] = useState<boolean>(false);

  // Função para converter data para ISO
  const dateToISO = (dateString: string): string => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      12,
      0,
      0
    ).toISOString();
  };

  // Limpar alterações não salvas (restaura do backup)
  const handleCleanCategories = (resetCategories: () => void) => {
    const confirmed = window.confirm(
      "Tem certeza que deseja limpar todas as alterações não salvas?"
    );

    if (confirmed) {
      resetCategories();
      // Restaura do backup
      showFlash("Alterações limpas!", "info");
    }
  };

  // Cancelar edição (limpa e volta para visualização)
  const handleCancelEdit = (resetCategories: () => void) => {
    const confirmed = window.confirm(
      "Tem certeza que deseja cancelar? Todas as alterações não salvas serão perdidas."
    );

    if (confirmed) {
      resetCategories();
      // Restaura do backup
      setIsEditMode(false);
      showFlash("Edição cancelada!", "info");
    }
  };

  // Salvar informações básicas do torneio
  const handleSaveTournamentInfo = async (
    name: string,
    startDate: string,
    endDate?: string
  ) => {
    if (!tournamentId) return;

    try {
      await api.put(`/tournaments/${tournamentId}`, {
        name,
        startDate: dateToISO(startDate),
        endDate: endDate ? dateToISO(endDate) : undefined,
        date: dateToISO(startDate), // Compatibilidade
      });

      showFlash("Informações atualizadas com sucesso!", "success");
      await fetchTournamentById(tournamentId);
      setIsEditingInfo(false);
    } catch (err: any) {
      showFlash(
        err.response?.data?.message || "Erro ao atualizar informações!",
        "error"
      );
    }
  };

  // Salvar categorias no backend
  const handleSaveCategories = async (categories: Category[]) => {
    if (!tournamentId) return;

    try {
      await api.put(`/tournaments/${tournamentId}`, {
        categories: categories,
      });

      showFlash("Categorias salvas com sucesso!", "success");
      await fetchTournamentById(tournamentId);
      updateOriginalCategories(categories);
      // setIsEditMode(false);
    } catch (err: any) {
      showFlash(
        err.response?.data?.message || "Erro ao salvar categorias!",
        "error"
      );
    }
  };

  // Realizar sorteio de uma categoria
  const handleDrawCategory = async (
    categoryId: string,
    categories: Category[],
    setCategories: (categories: Category[]) => void
  ) => {
    if (!tournamentId) return;

    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    if (category.pairs.length < 4) {
      showFlash(
        "São necessárias pelo menos 4 duplas para realizar o sorteio!",
        "warning"
      );
      return;
    }

    try {
      const response = await api.post(
        `/tournaments/${tournamentId}/draw-category`,
        {
          categoryId,
        }
      );

      showFlash(
        `Sorteio da categoria ${category.name} realizado com sucesso!`,
        "success"
      );

      // Atualiza as categorias com os grupos gerados
      const updatedCategories = categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            groups: response.data.groups,
            isDrawn: true,
          };
        }
        return cat;
      });

      setCategories(updatedCategories);
      await fetchTournamentById(tournamentId);
    } catch (err: any) {
      showFlash(
        err.response?.data?.message || "Erro ao realizar sorteio!",
        "error"
      );
    }
  };

  // Atualiza placares modificados manualmente ao clicar no botão
  const handleScoreUpdate = async (
    scores: Record<string, { team1: string; team2: string }>,
    originalScores: Record<string, { team1: string; team2: string }>,
    setOriginalScores: (
      scores: Record<string, { team1: string; team2: string }>
    ) => void,
    isLoggedIn: boolean,
    isOwner: boolean
  ) => {
    if (!tournamentId) return;

    // Verifica autenticação
    if (!isLoggedIn) {
      showFlash(
        "Você precisa estar logado para atualizar os placares!",
        "warning"
      );
      return;
    }

    // Verifica propriedade
    if (!isOwner) {
      showFlash(
        "Apenas o criador do torneio pode atualizar os placares!",
        "error"
      );
      return;
    }

    const updates = [];

    for (const [key, value] of Object.entries(scores)) {
      const original = originalScores[key];
      const [catIndex, gi, mi] = key.split("-").map(Number);

      if (original?.team1 !== value.team1 || original?.team2 !== value.team2) {
        const { team1, team2 } = value;
        if (team1 !== "" && team2 !== "") {
          updates.push({
            categoryIndex: catIndex,
            groupIndex: gi,
            matchIndex: mi,
            team1Score: Number(team1),
            team2Score: Number(team2),
          });
        }
      }
    }

    if (updates.length === 0) {
      showFlash("Nenhuma alteração encontrada!", "info");
      return;
    }

    try {
      await api.put(`/tournaments/${tournamentId}/scores`, { updates });
      await fetchTournamentById(tournamentId);
      showFlash("Placares atualizados com sucesso!", "success");

      // Atualiza o snapshot original
      setOriginalScores(scores);
    } catch (err: any) {
      showFlash(
        err.response?.data?.message || "Erro ao atualizar placares!",
        "error"
      );
    }
  };

  return {
    isEditMode,
    isEditingInfo,
    setIsEditMode,
    setIsEditingInfo,
    handleCleanCategories,
    handleCancelEdit,
    handleSaveTournamentInfo,
    handleSaveCategories,
    handleDrawCategory,
    handleScoreUpdate,
  };
};
