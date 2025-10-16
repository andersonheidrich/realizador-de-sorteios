import { useContext } from "react";
import { UserContext } from "./UserContext";
import type { UserContextType } from "@/types/types";

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
};
