import { createContext } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { UserContextType } from "@/types/types";

// Tipos para o Provider
interface UserProviderProps {
  children: ReactNode;
}

// Cria o contexto tipado
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider do contexto
const UserProvider = ({ children }: UserProviderProps) => {
  const { userRegister, authenticated, login, logout } = useAuth();

  return (
    <UserContext.Provider
      value={{ userRegister, authenticated, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
