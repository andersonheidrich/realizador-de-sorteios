import type { Tournament } from "@/types/types";

interface Props {
  tournament: Tournament;
  canEdit: boolean;
  isEditMode: boolean;
  setIsEditMode: (v: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
}

const TournamentHeader = ({
  tournament,
  canEdit,
  isEditMode,
  setIsEditMode,
  onSave,
  onCancel,
}: Props) => {
  return (
    <header className="flex flex-col items-center">
      <h1 className="mt-8 mb-4 text-3xl font-bold">{tournament.name}</h1>
      <p className="mb-4 sm:text-xl">
        <span className="font-medium">
          Início: {new Date(tournament.startDate).toLocaleDateString("pt-BR")}
        </span>
        <span> — </span>
        <span className="font-medium">
          Término: {new Date(tournament.endDate).toLocaleDateString("pt-BR")}
        </span>
      </p>

      {canEdit && (
        <div className="mb-6 flex gap-3">
          {!isEditMode ? (
            <button
              onClick={() => setIsEditMode(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Gerenciar Categorias
            </button>
          ) : (
            <>
              <button
                onClick={onSave}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
              >
                Salvar Categorias
              </button>
              <button
                onClick={onCancel}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 cursor-pointer"
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default TournamentHeader;
