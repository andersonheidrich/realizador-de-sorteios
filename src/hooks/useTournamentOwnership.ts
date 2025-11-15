import type { Tournament } from "@/types/types";
import { useState, useEffect } from "react";

export const useTournamentOwnership = (
  tournament: Tournament | null,
  userId: string | null,
  isLoggedIn: boolean
) => {
  const [isOwner, setIsOwner] = useState<boolean>(false);

  /* Verifica se o usuário é o dono do torneio */
  useEffect(() => {
    if (tournament && userId) {
      const tournamentUserId =
        typeof tournament.user === "string"
          ? tournament.user
          : tournament.user?._id || tournament.user?.id;

      const owner = tournamentUserId === userId;
      setIsOwner(owner);
    } else {
      setIsOwner(false);
    }
  }, [tournament, userId]);

  const canEdit = isLoggedIn && isOwner;

  return { isOwner, canEdit };
};
