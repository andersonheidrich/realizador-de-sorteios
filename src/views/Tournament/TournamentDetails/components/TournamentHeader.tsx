import type { Tournament } from "@/types/types";

interface Props {
  tournament: Tournament;
  canEdit: boolean;
  isEditMode: boolean;
  isEditingInfo: boolean;
  setIsEditMode: (v: boolean) => void;
  setIsEditingInfo: (v: boolean) => void;
  onSave: () => void;
  onClean: () => void;
  onCancel: () => void;
}

const TournamentHeader = ({
  tournament,
  canEdit,
  isEditMode,
  isEditingInfo,
  setIsEditMode,
  setIsEditingInfo,
  onSave,
  onClean,
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
          Encerramento:{" "}
          {new Date(tournament.endDate).toLocaleDateString("pt-BR")}
        </span>
      </p>

      <div className="flex mb-6 gap-4">
        {canEdit && !isEditMode && !isEditingInfo && (
          <div>
            <button
              onClick={() => setIsEditingInfo(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
              title="Editar informações do torneio"
            >
              Editar Informações
            </button>
          </div>
        )}

        {canEdit && (
          <div className="flex gap-3">
            {!isEditMode ? (
              <button
                onClick={() => setIsEditMode(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                title="Gerenciar categorias do torneio"
              >
                Gerenciar Categorias
              </button>
            ) : (
              <>
                <button
                  onClick={onSave}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
                  title="Salvar categorias"
                >
                  Salvar Categorias
                </button>
                <button
                  onClick={onClean}
                  className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 cursor-pointer"
                  title="Limpar"
                >
                  Limpar
                </button>
                <button
                  onClick={onCancel}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                  title="Cancelar"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default TournamentHeader;
