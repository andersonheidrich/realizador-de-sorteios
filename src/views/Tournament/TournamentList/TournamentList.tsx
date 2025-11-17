/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import type { AxiosError } from "axios";
import { useTournament } from "@/hooks/useTournament";
import { useTournamentFilter } from "@/hooks/useTournamentFilter";
import { useFlash } from "@/hooks/useFlash";
import { Filter } from "@/components";
import { Trash2 } from "lucide-react";

const TournamentList = () => {
  const { tournaments, fetchTournamentsByUser, deleteTournament, loading } =
    useTournament();
  const { showFlash } = useFlash();
  const { sortBy, setSortBy, filteredTournaments } =
    useTournamentFilter(tournaments);

  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return; // impede a segunda execução do StrictMode
    effectRan.current = true;

    const token = localStorage.getItem("token");

    if (!token) {
      showFlash("Você precisa estar logado para ver seus torneios!", "warning");
      return;
    }

    fetchTournamentsByUser();
  }, []);

  const handleDelete = async (
    e: React.MouseEvent,
    tournamentId: string,
    tournamentName: string
  ) => {
    e.preventDefault(); // Impede a navegação do Link
    e.stopPropagation(); // Impede a propagação do evento

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o torneio "${tournamentName}"?\n\nEsta ação não poderá ser desfeita!`
    );

    if (!confirmed) return;

    try {
      await deleteTournament(tournamentId);
      showFlash("Torneio excluído com sucesso!", "success");
      await fetchTournamentsByUser(); // Recarrega a lista
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;

      showFlash(
        err.response?.data?.message || "Erro ao excluir torneio!",
        "error"
      );
    }
  };

  return (
    <section>
      <div className="flex flex-col w-full min-h-screen items-center pt-22 px-5 bg-white">
        <h1 className="mt-8 mb-4 text-3xl max-[425px]:text-[22px] font-bold select-none">
          Meus Torneios
        </h1>
        <div className="flex flex-col w-full sm:w-150 max-h-164 justify-start items-center p-4 shadow shadow-gray-400 rounded-2xl text-sm sm:text-base">
          <Filter sortBy={sortBy} onSortChange={setSortBy} />
          {loading ? (
            <p className="py-4">Carregando...</p>
          ) : filteredTournaments.length === 0 ? (
            <div className="text-center text-white">
              <p className="text-gray-500 py-4">
                Você ainda não criou um torneio.
              </p>
              <Link
                to="/new-tournament"
                className="p-2 justify-center bg-blue-600 hover:bg-blue-700 font-bold rounded-lg cursor-pointer transition-colors duration-300"
              >
                Criar Torneio
              </Link>
            </div>
          ) : (
            <ul className="w-full justify-center items-center overflow-y-auto overflow-x-hidden py-4 select-none">
              {filteredTournaments.map((tournament) => (
                <div
                  key={tournament._id}
                  className="flex w-full items-center gap-1 sm:gap-2"
                >
                  <Link
                    className="w-full my-2 bg-yellow-500 hover:bg-yellow-400 rounded-2xl transition-colors duration-300"
                    to={`/tournaments/${tournament._id}`}
                  >
                    <li className="flex flex-col w-full items-start px-4 py-2 gap-1 font-bold">
                      <h3 className="w-full wrap-break-word">
                        {tournament.name}
                      </h3>
                      <p>
                        <span>
                          Início:{" "}
                          {new Date(tournament.startDate).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                        <span> — </span>
                        <span>
                          Encerramento:{" "}
                          {new Date(tournament.endDate).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      </p>
                    </li>
                  </Link>
                  <button
                    onClick={(e) =>
                      handleDelete(e, tournament._id!, tournament.name)
                    }
                    className="flex items-center justify-center w-9 h-9 p-2 sm:w-10 sm:h-10 sm:p-1 cursor-pointer rounded-full hover:bg-red-100 transition-colors duration-300"
                    title="Excluir torneio"
                  >
                    <Trash2 />
                  </button>
                </div>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default TournamentList;
