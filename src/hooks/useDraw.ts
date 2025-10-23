/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import api from "@/services/api";

export function useDraw() {
  const [draws, setDraws] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Buscar todos os sorteios do usuário logado
  async function fetchDraws() {
    setLoading(true);
    try {
      const { data } = await api.get("/draws");
      setDraws(data);
    } catch (err) {
      console.error("Erro ao buscar sorteios:", err);
    } finally {
      setLoading(false);
    }
  }

  // Criar novo sorteio
  async function createDraw(drawData: any) {
    try {
      const { data } = await api.post("/draws", drawData);
      setDraws((prev) => [data.draw, ...prev]);
      return data.draw;
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao criar sorteio");
    }
  }

  // Buscar um sorteio específico
  async function getDrawById(id: string) {
    try {
      const { data } = await api.get(`/draws/${id}`);
      return data;
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao carregar sorteio");
    }
  }

  // Excluir sorteio
  async function deleteDraw(id: string) {
    try {
      await api.delete(`/draws/${id}`);
      setDraws((prev) => prev.filter((d) => d._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao excluir sorteio");
    }
  }

  useEffect(() => {
    fetchDraws();
  }, []);

  return { draws, loading, createDraw, getDrawById, deleteDraw, fetchDraws };
}
