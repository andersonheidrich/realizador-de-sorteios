import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { AxiosError } from "axios";
import type { AuthResponse, UserRegister } from "@/types/types";

export const useAuth = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setAuthenticated(true);

      if (storedUserId) {
        setIsLoggedIn(true);
        setUserId(storedUserId);
      }
    } else {
      setAuthenticated(false);
      setIsLoggedIn(false);
    }
  }, []);

  const authUser = async (data: AuthResponse): Promise<void> => {
    try {
      if (!data.token) {
        throw new Error("Token inválido ou ausente");
      }

      // salva o token puro (sem aspas extras)
      localStorage.setItem("token", data.token);

      if (data.user && (data.user._id || data.user.id)) {
        const userId = data.user._id || data.user.id;
        localStorage.setItem("userId", userId);
        setUserId(userId);
        setIsLoggedIn(true);
      } else {
        console.error("Usuário não possui ID na resposta:", data.message);
      }

      // define o usuário como autenticado
      setAuthenticated(true);

      // redireciona para a home
      navigate("/");
    } catch (error) {
      console.error("Erro ao autenticar usuário:", error);
    }
  };

  const userRegister = async (user: UserRegister): Promise<void> => {
    try {
      const { data } = await api.post<AuthResponse>("/users/register", user);
      await authUser(data);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.log(
        error.response?.data?.message ?? "Erro ao registrar usuário."
      );
    }
  };

  const login = async (
    user: Pick<UserRegister, "email" | "password">
  ): Promise<void> => {
    try {
      const { data } = await api.post<AuthResponse>("/users/login", user);
      await authUser(data);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.log(error.response?.data?.message ?? "Erro ao realizar login.");
    }
  };

  const logout = (): void => {
    setAuthenticated(false);
    setIsLoggedIn(false);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    delete api.defaults.headers.Authorization;

    navigate("/");
  };

  return { authenticated, isLoggedIn, userId, userRegister, login, logout };
};
