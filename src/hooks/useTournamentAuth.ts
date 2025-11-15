import { useState, useEffect } from "react";

export const useTournamentAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  /* Verifica autenticação ao montar */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (token && storedUserId) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return { isLoggedIn, userId };
};
