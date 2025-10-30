/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import api from "../services/api";
import type { Pair, Tournament } from "@/types/types";

export function useTournament() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /* -----------------------------
     Funções auxiliares
  ----------------------------- */

  // Converter texto em duplas (para a tela de criação)
  const parsePairsText = (text: string): Pair[] => {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0) // remove linhas vazias
      .map((line) => {
        const players = line
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p.length > 0); // remove nomes vazios
        return { players: players.map((name) => ({ name })) };
      })
      .filter((pair) => pair.players.length > 0); // remove pares sem jogadores
  };

  /* -----------------------------
     Funções CRUD
  ----------------------------- */

  // Listar todos os torneios
  const fetchTournaments = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<Tournament[]>("/tournaments");
      setTournaments(data);
    } catch (err) {
      setError("Erro ao buscar torneios");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Listar todos os torneios do usuário autenticado
  const fetchTournamentsByUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<Tournament[]>(
        "/tournaments/my-tournaments"
      );
      setTournaments(data);
    } catch (err) {
      setError("Erro ao buscar torneios");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Buscar torneio por ID
  const fetchTournamentById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<Tournament>(`/tournaments/${id}`);
      setTournament(data);
    } catch (err) {
      setError("Erro ao buscar torneio");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Criar torneio
  const createTournament = async (payload: Tournament) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post<Tournament>("/tournaments", payload);
      return data;
    } catch (err) {
      setError("Erro ao criar torneio");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar torneio
  const updateTournament = async (id: string, payload: Partial<Tournament>) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put<Tournament>(`/tournaments/${id}`, payload);
      setTournament(data);
      return data;
    } catch (err) {
      setError("Erro ao atualizar torneio");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Deletar torneio
  const deleteTournament = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/tournaments/${id}`);
      setTournaments((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError("Erro ao deletar torneio");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = async (
    tournamentId: string,
    groupIndex: number,
    matchIndex: number,
    { team1Score, team2Score }: { team1Score: number; team2Score: number }
  ) => {
    try {
      // 🔍 Verificação local antes de enviar
      if (!tournamentId || team1Score === undefined || team2Score === undefined)
        return;

      const payload = {
        groupIndex,
        matchIndex,
        team1Score,
        team2Score,
      };

      const { data } = await api.put(
        `/tournaments/${tournamentId}/score`,
        payload
      );

      // 🔥 Atualiza estado local sem precisar refazer fetch
      setTournament((prev) => {
        if (!prev || !prev.groups) return prev;

        const updatedGroups = [...prev.groups];
        const group = updatedGroups[groupIndex];
        if (!group) {
          console.warn("Grupo não encontrado:", groupIndex);
          return prev;
        }

        // Atualiza partidas e standings localmente
        const updatedMatches = group.matches.map((m, i) =>
          i === matchIndex ? { ...m, score: `${team1Score}-${team2Score}` } : m
        );

        updatedGroups[groupIndex] = {
          ...group,
          matches: updatedMatches,
          standings: data.standings || group.standings, // fallback
        };

        return { ...prev, groups: updatedGroups };
      });
    } catch (err: any) {
      console.error("Erro ao atualizar placar:", err.response?.data || err);
      setError("Erro ao atualizar placar");
    }
  };

  return {
    tournaments,
    tournament,
    loading,
    error,
    fetchTournaments,
    fetchTournamentsByUser,
    fetchTournamentById,
    createTournament,
    updateTournament,
    deleteTournament,
    parsePairsText,
    handleScoreChange,
  };
}
