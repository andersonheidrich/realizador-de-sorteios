/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTournament } from "@/hooks/useTournament";
import { useFlash } from "@/context/FlashContext";
import api from "@/services/api";

const TournamentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { tournament, fetchTournamentById, loading } = useTournament();
  const { showFlash } = useFlash();

  const [scores, setScores] = useState<
    Record<string, { team1: string; team2: string }>
  >({});
  const [originalScores, setOriginalScores] = useState<
    Record<string, { team1: string; team2: string }>
  >({});
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Permissão para editar (precisa estar logado E ser o dono)
  const canEdit = isLoggedIn && isOwner;

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

  /* Buscar torneio ao montar */
  useEffect(() => {
    if (!id) return;
    fetchTournamentById(id);
  }, [id]);

  /* Verifica se o usuário é o dono do torneio */
  useEffect(() => {
    if (tournament && userId) {
      const owner = tournament.user === userId;
      setIsOwner(owner);
    } else {
      setIsOwner(false);
    }
  }, [tournament, userId]);

  // Inicializa os placares (estado atual e original)
  useEffect(() => {
    if (tournament) {
      const init: Record<string, { team1: string; team2: string }> = {};
      tournament?.groups?.forEach((group, gi) => {
        group.matches.forEach((match, mi) => {
          if (match.score) {
            const [a, b] = match.score.split("-").map((v: string) => v.trim());
            init[`${gi}-${mi}`] = { team1: a || "", team2: b || "" };
          } else {
            init[`${gi}-${mi}`] = { team1: "", team2: "" };
          }
        });
      });
      setScores(init);
      setOriginalScores(init);
    }
  }, [tournament]);

  // Atualiza inputs (só se puder editar)
  const handleInputChange = (
    groupIndex: number,
    matchIndex: number,
    field: "team1" | "team2",
    value: string
  ) => {
    if (!canEdit) {
      if (!isLoggedIn) {
        showFlash("Você precisa estar logado para editar", "warning");
      } else {
        showFlash(
          "Apenas o criador do torneio pode editar os placares",
          "warning"
        );
      }
      return;
    }

    const key = `${groupIndex}-${matchIndex}`;
    setScores((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  // Atualiza placares modificados manualmente ao clicar no botão
  const handleScoreUpdate = async () => {
    if (!tournament?._id) return;

    // Verifica autenticação
    if (!isLoggedIn) {
      showFlash(
        "Você precisa estar logado para atualizar os placares",
        "warning"
      );
      return;
    }

    // Verifica propriedade
    if (!isOwner) {
      showFlash(
        "Apenas o criador do torneio pode atualizar os placares",
        "error"
      );
      return;
    }

    const updates = [];

    for (const [key, value] of Object.entries(scores)) {
      const original = originalScores[key];
      const [gi, mi] = key.split("-").map(Number);

      if (original?.team1 !== value.team1 || original?.team2 !== value.team2) {
        const { team1, team2 } = value;
        if (team1 !== "" && team2 !== "") {
          updates.push({
            groupIndex: gi,
            matchIndex: mi,
            team1Score: Number(team1),
            team2Score: Number(team2),
          });
        }
      }
    }

    if (updates.length === 0) {
      showFlash("Nenhuma alteração encontrada!", "info");
      return;
    }

    try {
      await api.put(`/tournaments/${tournament._id}/scores`, { updates });
      await fetchTournamentById(tournament._id!);
      showFlash("Placares atualizados com sucesso!", "success");

      // Atualiza o snapshot original
      setOriginalScores(scores);
    } catch (err: any) {
      console.error("Erro ao atualizar placares:", err);
      showFlash(
        err.response?.data?.message || "Erro ao atualizar placares",
        "error"
      );
    }
  };

  if (loading) return <p className="p-6">Carregando...</p>;
  if (!tournament) return <p className="p-6">Torneio não encontrado</p>;

  return (
    <section>
      <div className="flex flex-col min-h-screen items-center pt-[90px] bg-white">
        {/* Cabeçalho */}
        <h1 className="mt-8 mb-4 text-3xl font-bold">{tournament.name}</h1>
        <p className="mb-4 text-2xl">
          Data:{" "}
          <span className="font-medium">
            {new Date(tournament.date).toLocaleDateString("pt-BR")}
          </span>
        </p>

        <h2 className="text-xl font-semibold mb-2">Grupos</h2>
        <div className="grid grid-cols-2 gap-4 justify-center items-start">
          {tournament.groups?.map((group, gi) => (
            <div
              key={group.name}
              className="flex flex-col justify-between w-140 h-116 border p-2 rounded"
            >
              {/* Cabeçalho do grupo */}
              <div className="p-2 bg-yellow-500 rounded">
                <h3 className="font-bold">{group.name}</h3>
              </div>

              {/* Classificação */}
              <div className="h-38 p-2 bg-yellow-500 rounded">
                <h3 className="font-bold border-b-1">Classificação</h3>
                <div className="flex w-full justify-between font-bold text-sm">
                  <div className="w-100">
                    <span>Dupla</span>
                  </div>
                  <div className="flex w-30 justify-between">
                    <span>Vitórias</span>
                    <span>Saldo</span>
                  </div>
                </div>
                <ul>
                  {group.standings?.map((s, i) => (
                    <li key={i} className="flex justify-between">
                      <div className="w-100">
                        <span>{s.pair}</span>
                      </div>
                      <div className="flex w-19 justify-between">
                        <span>{s.wins}</span>
                        <span>({s.gamesWon - s.gamesLost})</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Partidas */}
              <div className="h-60 p-2 bg-yellow-500 rounded">
                <h3 className="font-bold border-b-1">Partidas</h3>
                <ul>
                  {group.matches.map((m, mi) => {
                    const key = `${gi}-${mi}`;
                    return (
                      <li key={mi}>
                        <div className="flex items-center justify-between py-1">
                          <div className="flex w-full gap-2">
                            <span>{m.team1.join(" / ")}</span>
                            <span className="font-bold">Vs.</span>
                            <span>{m.team2.join(" / ")}</span>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              min="0"
                              value={scores[key]?.team1 || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  gi,
                                  mi,
                                  "team1",
                                  e.target.value
                                )
                              }
                              disabled={!canEdit}
                              className={`w-12 text-center border rounded ${
                                !canEdit ? "bg-gray-100" : ""
                              }`}
                              title={
                                !isLoggedIn
                                  ? "Faça login para editar"
                                  : !isOwner
                                  ? "Apenas o criador pode editar"
                                  : ""
                              }
                            />
                            <span className="font-bold">x</span>
                            <input
                              type="text"
                              min="0"
                              value={scores[key]?.team2 || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  gi,
                                  mi,
                                  "team2",
                                  e.target.value
                                )
                              }
                              disabled={!canEdit}
                              className={`w-12 text-center border rounded ${
                                !canEdit ? "bg-gray-100" : ""
                              }`}
                              title={
                                !isLoggedIn
                                  ? "Faça login para editar"
                                  : !isOwner
                                  ? "Apenas o criador pode editar"
                                  : ""
                              }
                            />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
        {canEdit ? (
          <button
            onClick={handleScoreUpdate}
            className={
              "mt-8 px-4 py-2 rounded transition-colors                 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            }
          >
            Atualizar Classificação
          </button>
        ) : (
          ""
        )}

        {/* Navegação */}
        <div className="mt-8 flex justify-between">
          <Link
            to="/tournaments"
            className="text-blue-600 hover:underline font-medium"
          >
            ← Voltar
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TournamentDetails;
