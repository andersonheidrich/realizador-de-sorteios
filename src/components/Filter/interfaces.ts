import type { Tournament } from "@/types/types";

export type SortOption = "date-asc" | "date-desc" | "name-asc" | "name-desc";

export interface TournamentFilterProps {
  tournaments: Tournament[];
  onFilteredChange: (filtered: Tournament[]) => void;
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
}
