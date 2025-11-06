/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Category } from "@/types/types";
import CategoryCard from "./CategoryCard";

interface Props {
  categories: Category[];
  canEdit: boolean;
  scores: Record<string, { team1: string; team2: string }>;
  onInputChange: React.Dispatch<React.SetStateAction<any>>;
  onUpdateScores: () => void;
}

const CategoryList = ({
  categories,
  canEdit,
  scores,
  onInputChange,
  onUpdateScores,
}: Props) => {
  return (
    <>
      {categories?.length ? (
        categories.map((category, catIndex) => (
          <CategoryCard
            key={category.id}
            category={category}
            catIndex={catIndex}
            canEdit={canEdit}
            scores={scores}
            onInputChange={onInputChange}
          />
        ))
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg w-full max-w-2xl">
          <p className="text-gray-600 mb-4">
            Este torneio ainda não possui categorias ou grupos.
          </p>
          {canEdit && (
            <p className="text-sm text-gray-500">
              Clique em "Gerenciar Categorias" para começar!
            </p>
          )}
        </div>
      )}

      {canEdit && categories.some((cat) => cat.isDrawn) && (
        <button
          onClick={onUpdateScores}
          className="mt-8 px-6 py-3 rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
        >
          Atualizar Classificação
        </button>
      )}
    </>
  );
};

export default CategoryList;
