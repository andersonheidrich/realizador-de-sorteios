import type { SortOption, TournamentFilterProps } from "./interfaces";
import { ArrowUp, ArrowDown } from "lucide-react";

const Filter = ({
  tournaments,
  onFilteredChange,
  sortBy,
  onSortChange,
}: TournamentFilterProps) => {
  const handleSortChange = (newSortBy: SortOption) => {
    onSortChange(newSortBy);

    const sorted = [...tournaments].sort((a, b) => {
      switch (newSortBy) {
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "name-asc":
          return a.name.localeCompare(b.name, "pt-BR");
        case "name-desc":
          return b.name.localeCompare(a.name, "pt-BR");
        default:
          return 0;
      }
    });

    onFilteredChange(sorted);
  };

  const isActive = (option: SortOption) => sortBy === option;

  return (
    <div className="w-full p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between gap-4">
        <span className="text-md font-medium text-gray-700">Ordenar por:</span>

        {/* Filtros por Data */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Data:</span>
          <button
            onClick={() => handleSortChange("date-asc")}
            className={`p-2 rounded-md transition-all cursor-pointer ${
              isActive("date-asc")
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600 hover:bg-blue-100"
            }`}
            title="Data mais antiga primeiro"
          >
            <ArrowUp size={18} />
          </button>
          <button
            onClick={() => handleSortChange("date-desc")}
            className={`p-2 rounded-md transition-all cursor-pointer ${
              isActive("date-desc")
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600 hover:bg-blue-100"
            }`}
            title="Data mais recente primeiro"
          >
            <ArrowDown size={18} />
          </button>
        </div>

        {/* Filtros por Nome */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Nome:</span>
          <button
            onClick={() => handleSortChange("name-asc")}
            className={`px-3 py-2 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
              isActive("name-asc")
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600 hover:bg-blue-100"
            }`}
            title="A-Z"
          >
            <ArrowUp size={14} />
            <span className="text-xs font-bold">A-Z</span>
          </button>
          <button
            onClick={() => handleSortChange("name-desc")}
            className={`px-3 py-2 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
              isActive("name-desc")
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600 hover:bg-blue-100"
            }`}
            title="Z-A"
          >
            <ArrowDown size={14} />
            <span className="text-xs font-bold">Z-A</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
