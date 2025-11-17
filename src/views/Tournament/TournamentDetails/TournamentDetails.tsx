/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTournament } from "@/hooks/useTournament";
import { useTournamentOwnership } from "@/hooks/useTournamentOwnership";
import { useTournamentCategories } from "@/hooks/useTournamentCategories";
import { useTournamentScores } from "@/hooks/useTournamentScores";
import { useTournamentActions } from "@/hooks/useTournamentActions";
import {
  CategoryList,
  CategoryManager,
  TournamentHeader,
  TournamentInfoEditor,
} from "./components";
import { Modal } from "@/components";

const TournamentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { isLoggedIn, userId } = useAuth();
  const { tournament, fetchTournamentById, loading } = useTournament();
  const { isOwner, canEdit } = useTournamentOwnership(
    tournament,
    userId,
    isLoggedIn
  );

  const {
    categories,
    setCategories,
    resetCategories,
    updateOriginalCategories,
  } = useTournamentCategories(tournament);

  const { scores, originalScores, setScores, setOriginalScores } =
    useTournamentScores(tournament);

  const {
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
  } = useTournamentActions(
    tournament?._id,
    fetchTournamentById,
    updateOriginalCategories
  );

  /* Buscar torneio ao montar */
  useEffect(() => {
    if (!id) return;
    fetchTournamentById(id);
  }, [id]);

  // Estado de carregamento ou erro
  if (loading) {
    return (
      <section>
        <div className="flex flex-col w-full min-h-screen items-center justify-center pt-22 px-5 bg-white">
          <p className="text-gray-600">Carregando torneio...</p>
        </div>
      </section>
    );
  }

  if (!tournament) {
    return (
      <section>
        <div className="flex flex-col w-full min-h-screen items-center justify-center pt-22 px-5 bg-white">
          <p className="text-gray-600 mb-4">Torneio não encontrado!</p>
          <Link
            to={isLoggedIn ? "/my-tournaments" : "/"}
            className="text-blue-600 hover:underline font-medium"
          >
            ← Voltar
          </Link>
        </div>
      </section>
    );
  }

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
          onSave={() => handleSaveCategories(categories)}
          onClean={() => handleCleanCategories(resetCategories)}
          onCancel={() => handleCancelEdit(resetCategories)}
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
            onDrawCategory={(categoryId) =>
              handleDrawCategory(categoryId, categories, setCategories)
            }
          />
        ) : (
          <CategoryList
            categories={categories}
            canEdit={canEdit}
            scores={scores}
            onInputChange={setScores}
            onUpdateScores={() =>
              handleScoreUpdate(
                scores,
                originalScores,
                setOriginalScores,
                isLoggedIn,
                isOwner
              )
            }
          />
        )}

        {/* Navegação */}
        <div className="mt-8 mb-8 flex justify-between w-full max-w-6xl">
          <Link
            to={isLoggedIn ? "/my-tournaments" : "/"}
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
