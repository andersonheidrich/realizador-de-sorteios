/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "@/services/api";
import { useTournament } from "@/hooks/useTournament";
import { useFlash } from "@/hooks/useFlash";
import type { Category, Group, Match } from "@/types/types";
import {
  CategoryList,
  CategoryManager,
  TournamentHeader,
  TournamentInfoEditor,
} from "./components";
import { Modal } from "@/components";

const TournamentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { tournament, fetchTournamentById, loading } = useTournament();
  const { showFlash } = useFlash();

  const [scores, setScores] = useState<
    Record<string, { team1: string; team2: string }>
  >({});
  const [originalScores, setOriginalScores] = useState<
    Record<string, { team1: string; team2: string }>
  >({});
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isEditingInfo, setIsEditingInfo] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [originalCategories, setOriginalCategories] = useState<Category[]>([]);

  // Permissão para editar (precisa estar logado E ser o dono)
  const canEdit = isLoggedIn && isOwner;

  /* Verifica autenticação ao montar */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (token && storedUserId) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  /* Buscar torneio ao montar */
  useEffect(() => {
    if (!id) return;
    fetchTournamentById(id);
  }, [id]);

  /* Verifica se o usuário é o dono do torneio */
  useEffect(() => {
    if (tournament && userId) {
      // Verifica se tournament.user é string (ID) ou objeto (populado)
      const tournamentUserId =
        typeof tournament.user === "string"
          ? tournament.user
          : tournament.user?._id || tournament.user?.id;

      const owner = tournamentUserId === userId;
      setIsOwner(owner);
    } else {
      setIsOwner(false);
    }
  }, [tournament, userId]);

  // Carrega categorias do torneio
  useEffect(() => {
    if (tournament?.categories) {
      setCategories(tournament.categories);
      setOriginalCategories(JSON.parse(JSON.stringify(tournament.categories)));
    }
  }, [tournament]);

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
  const handleCleanCategories = () => {
    const confirmed = window.confirm(
      "Tem certeza que deseja limpar todas as alterações não salvas?"
    );

    if (confirmed) {
      setCategories(JSON.parse(JSON.stringify(originalCategories))); // Restaura do backup
      showFlash("Alterações limpas!", "info");
    }
  };

  // Cancelar edição (limpa e volta para visualização)
  const handleCancelEdit = async () => {
    const confirmed = window.confirm(
      "Tem certeza que deseja cancelar? Todas as alterações não salvas serão perdidas."
    );

    if (confirmed) {
      setCategories(JSON.parse(JSON.stringify(originalCategories))); // Restaura do backup
      setIsEditMode(false);
      showFlash("Edição cancelada", "info");
    }
  };

  // Salvar informações básicas do torneio
  const handleSaveTournamentInfo = async (
    name: string,
    startDate: string,
    endDate?: string
  ) => {
    if (!tournament?._id) return;

    try {
      await api.put(`/tournaments/${tournament._id}`, {
        name,
        startDate: dateToISO(startDate),
        endDate: endDate ? dateToISO(endDate) : undefined,
        date: dateToISO(startDate), // Compatibilidade
      });

      showFlash("Informações atualizadas com sucesso!", "success");
      await fetchTournamentById(tournament._id);
      setIsEditingInfo(false);
    } catch (err: any) {
      showFlash(
        err.response?.data?.message || "Erro ao atualizar informações",
        "error"
      );
    }
  };

  // Salvar categorias no backend
  const handleSaveCategories = async () => {
    if (!tournament?._id) return;

    try {
      await api.put(`/tournaments/${tournament._id}`, {
        categories: categories,
      });

      showFlash("Categorias salvas com sucesso!", "success");
      await fetchTournamentById(tournament._id);
      setOriginalCategories(JSON.parse(JSON.stringify(categories)));
      setIsEditMode(false);
    } catch (err: any) {
      showFlash(
        err.response?.data?.message || "Erro ao salvar categorias!",
        "error"
      );
    }
  };

  // Realizar sorteio de uma categoria
  const handleDrawCategory = async (categoryId: string) => {
    if (!tournament?._id) return;

    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    if (category.pairs.length < 4) {
      showFlash(
        "É necessário pelo menos 4 duplas para realizar o sorteio",
        "warning"
      );
      return;
    }

    try {
      const response = await api.post(
        `/tournaments/${tournament._id}/draw-category`,
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
      await fetchTournamentById(tournament._id);
    } catch (err: any) {
      showFlash(
        err.response?.data?.message || "Erro ao realizar sorteio",
        "error"
      );
    }
  };

  // Atualiza placares modificados manualmente ao clicar no botão
  const handleScoreUpdate = async () => {
    if (!tournament?._id) return;

    // Verifica autenticação
    if (!isLoggedIn) {
      showFlash(
        "Você precisa estar logado para atualizar os placares",
        "warning"
      );
      return;
    }

    // Verifica propriedade
    if (!isOwner) {
      showFlash(
        "Apenas o criador do torneio pode atualizar os placares",
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
      await api.put(`/tournaments/${tournament._id}/scores`, { updates });
      await fetchTournamentById(tournament._id!);
      showFlash("Placares atualizados com sucesso!", "success");

      // Atualiza o snapshot original
      setOriginalScores(scores);
    } catch (err: any) {
      console.error("Erro ao atualizar placares:", err);
      showFlash(
        err.response?.data?.message || "Erro ao atualizar placares",
        "error"
      );
    }
  };

  if (loading) return <p className="p-6">Carregando...</p>;
  if (!tournament) return <p className="p-6">Torneio não encontrado</p>;

  return (
    <section>
      <div className="flex flex-col w-full min-h-screen items-center pt-22 px-5 bg-white">
        {/* Cabeçalho */}
        <TournamentHeader
          tournament={tournament}
          canEdit={canEdit}
          isEditMode={isEditMode}
          isEditingInfo={isEditingInfo}
          setIsEditMode={setIsEditMode}
          setIsEditingInfo={setIsEditingInfo}
          onSave={handleSaveCategories}
          onClean={handleCleanCategories}
          onCancel={handleCancelEdit}
        />

        {/* Editor de informações básicas */}
        <Modal
          isOpen={isEditingInfo}
          onClose={() => setIsEditingInfo(false)}
          title="Editar Informações do Torneio"
        >
          <TournamentInfoEditor
            initialName={tournament.name}
            initialStartDate={tournament.startDate}
            initialEndDate={tournament.endDate}
            onSave={handleSaveTournamentInfo}
            onCancel={() => setIsEditingInfo(false)}
          />
        </Modal>

        {/* Modo de Edição - Gerenciar Categorias */}
        {isEditMode && canEdit ? (
          <CategoryManager
            categories={categories}
            onCategoriesChange={setCategories}
            onDrawCategory={handleDrawCategory}
          />
        ) : (
          <CategoryList
            categories={categories}
            canEdit={canEdit}
            scores={scores}
            onInputChange={setScores}
            onUpdateScores={handleScoreUpdate}
          />
        )}

        {/* Navegação */}
        <div className="mt-8 mb-8 flex justify-between w-full max-w-6xl">
          <Link
            to="/my-tournaments"
            className="text-blue-600 hover:underline font-medium"
          >
            ← Voltar
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TournamentDetails;
