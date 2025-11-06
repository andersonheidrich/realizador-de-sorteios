export type SortOption = "date-asc" | "date-desc" | "name-asc" | "name-desc";

export interface TournamentFilterProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
}
