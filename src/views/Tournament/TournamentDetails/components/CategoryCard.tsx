/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Category } from "@/types/types";
import GroupCard from "./GroupCard";

interface Props {
  category: Category;
  catIndex: number;
  canEdit: boolean;
  scores: Record<string, { team1: string; team2: string }>;
  onInputChange: React.Dispatch<React.SetStateAction<any>>;
}

const CategoryCard = ({
  category,
  catIndex,
  canEdit,
  scores,
  onInputChange,
}: Props) => {
  return (
    <div key={category.id} className="w-full max-w-6xl mb-12">
      <h2 className="text-2xl font-bold mb-4 text-center bg-yellow-500 py-3 rounded-lg">
        Categoria: {category.name}
      </h2>

      {!category.isDrawn || !category.groups?.length ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            {category.pairs.length < 4
              ? `Esta categoria precisa de pelo menos 4 duplas para realizar o sorteio (${category.pairs.length}/4)`
              : "O sorteio ainda não foi realizado para esta categoria"}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {category.groups.map((group: any, gi: number) => (
            <GroupCard
              key={group.name}
              group={group}
              catIndex={catIndex}
              groupIndex={gi}
              canEdit={canEdit}
              scores={scores}
              onInputChange={onInputChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
