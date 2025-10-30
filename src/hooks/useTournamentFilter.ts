import type { SortOption } from "@/components/Filter/interfaces";
import type { Tournament } from "@/types/types";
import { useState, useEffect } from "react";

export const useTournamentFilter = (tournaments: Tournament[]) => {
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>(
    []
  );

  useEffect(() => {
    const sorted = [...tournaments].sort((a, b) => {
      switch (sortBy) {
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
    setFilteredTournaments(sorted);
  }, [tournaments, sortBy]);

  return {
    sortBy,
    setSortBy,
    filteredTournaments,
    setFilteredTournaments,
  };
};
