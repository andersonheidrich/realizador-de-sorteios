import type { SortOption, TournamentFilterProps } from "./interfaces";
import { ArrowUp, ArrowDown } from "lucide-react";

const Filter = ({
  sortBy,
  onSortChange,
}: Omit<TournamentFilterProps, "tournaments" | "onFilteredChange">) => {
  const isActive = (option: SortOption) => sortBy === option;

  return (
    <div className="w-full p-4 bg-gray-50 rounded-lg">
      <div className="flex max-[425px]:flex-col items-center max-[425px]:items-start justify-between gap-4">
        {/* Filtros por Data */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Data:</span>
          <button
            onClick={() => onSortChange("date-asc")}
            className={`p-2 rounded-md transition-all cursor-pointer ${
              isActive("date-asc")
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600 hover:bg-blue-100 transition-colors duration-300"
            }`}
            title="Data mais recente primeiro"
          >
            <ArrowUp size={18} />
          </button>
          <button
            onClick={() => onSortChange("date-desc")}
            className={`p-2 rounded-md transition-all cursor-pointer ${
              isActive("date-desc")
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600 hover:bg-blue-100 transition-colors duration-300"
            }`}
            title="Data mais recente por último"
          >
            <ArrowDown size={18} />
          </button>
        </div>

        {/* Filtros por Nome */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Nome:</span>
          <button
            onClick={() => onSortChange("name-asc")}
            className={`px-3 py-2 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
              isActive("name-asc")
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600 hover:bg-blue-100 transition-colors duration-300"
            }`}
            title="A-Z"
          >
            <ArrowUp size={14} />
            <span className="text-xs font-bold">A-Z</span>
          </button>
          <button
            onClick={() => onSortChange("name-desc")}
            className={`px-3 py-2 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
              isActive("name-desc")
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600 hover:bg-blue-100 transition-colors duration-300"
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
