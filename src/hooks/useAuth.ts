import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { AxiosError } from "axios";
import type { AuthResponse, User } from "@/types/types";

export const useAuth = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      setAuthenticated(true);
    }
  }, []);

  const authUser = async (data: AuthResponse): Promise<void> => {
    setAuthenticated(true);
    localStorage.setItem("token", JSON.stringify(data.token));
    navigate("/");
  };

  const userRegister = async (user: User): Promise<void> => {
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
    user: Pick<User, "email" | "password">
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
    localStorage.removeItem("token");
    delete api.defaults.headers.Authorization;

    navigate("/");
  };

  return { authenticated, userRegister, login, logout };
};
