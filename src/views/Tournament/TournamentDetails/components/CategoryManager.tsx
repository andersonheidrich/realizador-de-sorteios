import { useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import type { Category } from "@/types/types";
import { useFlash } from "@/hooks/useFlash";

interface Props {
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
  onDrawCategory: (categoryId: string) => void;
}

const CategoryManager = ({
  categories,
  onCategoriesChange,
  onDrawCategory,
}: Props) => {
  const { showFlash } = useFlash();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [pairsText, setPairsText] = useState("");

  // Adicionar nova categoria
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      showFlash("Digite o nome da categoria!", "warning");
      return;
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      pairs: [],
      isDrawn: false,
    };

    onCategoriesChange([...categories, newCategory]);
    setNewCategoryName("");
  };

  // Remover categoria
  const handleRemoveCategory = (categoryId: string) => {
    if (confirm("Tem certeza que deseja remover esta categoria?")) {
      onCategoriesChange(categories.filter((c) => c.id !== categoryId));
      if (selectedCategory === categoryId) {
        setSelectedCategory(null);
      }
    }
  };

  // Adicionar duplas à categoria selecionada
  const handleAddPairs = () => {
    if (!selectedCategory) {
      showFlash("Selecione uma categoria primeiro!", "warning");
      return;
    }

    if (!pairsText.trim()) {
      showFlash("Digite as duplas!", "warning");
      return;
    }

    // Parse das duplas
    const newPairs = pairsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const players = line
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p.length > 0);
        return { players: players.map((name) => ({ name })) };
      })
      .filter((pair) => pair.players.length === 2);

    if (newPairs.length === 0) {
      showFlash("Nenhuma dupla válida encontrada!", "warning");
      return;
    }

    // Atualiza a categoria com as novas duplas
    const updatedCategories = categories.map((cat) => {
      const catId = cat.id;
      if (catId === selectedCategory) {
        return {
          ...cat,
          pairs: [...cat.pairs, ...newPairs],
        };
      }
      return cat;
    });

    onCategoriesChange(updatedCategories);
    setPairsText("");
  };

  // Remover dupla de uma categoria
  const handleRemovePair = (categoryId: string, pairIndex: number) => {
    const updatedCategories = categories.map((cat) => {
      const catId = cat.id;
      if (catId === categoryId) {
        return {
          ...cat,
          pairs: cat.pairs.filter((_, index) => index !== pairIndex),
        };
      }
      return cat;
    });

    onCategoriesChange(updatedCategories);
  };

  return (
    <div className="w-full max-w-6xl mx-auto sm:p-6">
      <h2 className="text-2xl font-bold mb-6">Gerenciar Categorias</h2>

      {/* Adicionar nova categoria */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Adicionar Categoria</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nome da categoria (Ex: Pro, A, B, C...)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            // onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
          />
          <button
            onClick={handleAddCategory}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 cursor-pointer transition-colors duration-300"
          >
            <Plus size={18} />
            Adicionar
          </button>
        </div>
      </div>

      {/* Lista de categorias */}
      <div className="grid md:grid-cols-2 gap-6">
        {categories.map((category) => {
          const catId = category.id;
          return (
            <div
              key={catId}
              className="border-2 border-gray-300 rounded-lg p-4 bg-white"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  {category.name}
                  <span className="text-sm font-normal text-gray-500">
                    ({category.pairs.length} duplas)
                  </span>
                </h3>
                <button
                  onClick={() => handleRemoveCategory(catId!)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded cursor-pointer transition-colors duration-300"
                  title="Remover categoria"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Lista de duplas */}
              <div className="mb-4 max-h-60 overflow-y-auto">
                {category.pairs.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">
                    Nenhuma dupla adicionada
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {category.pairs.map((pair, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded"
                      >
                        <span className="text-sm">
                          {pair.players.map((p) => p.name).join(" / ")}
                        </span>
                        <button
                          onClick={() => handleRemovePair(catId!, index)}
                          className="text-red-600 hover:text-red-800 cursor-pointer transition-colors duration-300"
                          title="Remover dupla"
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Botões de ação */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCategory(catId!)}
                  className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer ${
                    selectedCategory === catId
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-300"
                  }`}
                >
                  <Users size={16} />
                  Adicionar Duplas
                </button>

                {category.pairs.length >= 4 && (
                  <button
                    onClick={() => onDrawCategory(catId!)}
                    disabled={category.isDrawn}
                    className={`flex-1 px-4 py-2 rounded-lg cursor-pointer ${
                      category.isDrawn
                        ? "bg-green-600 text-white cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700 transition-colors duration-300"
                    }`}
                  >
                    {category.isDrawn ? "✓ Sorteado" : "Sortear"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Formulário para adicionar duplas */}
      {selectedCategory && (
        <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-300 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">
            Adicionar Duplas à Categoria:{" "}
            <span className="text-blue-600">
              {categories.find((c) => c.id === selectedCategory)?.name}
            </span>
          </h3>
          <textarea
            placeholder={`- Cada linha representa uma dupla\n- Separe os nomes com vírgula\n- Cada dupla deve ter exatamente dois jogadores\n\nExemplo:\nAna,Carlos\nBia,João\nClara,Pedro`}
            value={pairsText}
            onChange={(e) => setPairsText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none mb-3"
            rows={8}
          />
          <div className="flex gap-3">
            <button
              onClick={handleAddPairs}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors duration-300"
            >
              Adicionar Duplas
            </button>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setPairsText("");
              }}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 cursor-pointer transition-colors duration-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {categories.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Nenhuma categoria adicionada ainda.</p>
          <p className="text-sm mt-2">
            Comece adicionando uma categoria acima!
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
