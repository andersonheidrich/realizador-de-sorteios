/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTournament } from "@/hooks/useTournament";
import { useTournamentFilter } from "@/hooks/useTournamentFilter";
import { useFlash } from "@/hooks/useFlash";
import { Filter } from "@/components";
import { Trash2 } from "lucide-react";

const TournamentList = () => {
  const { tournaments, fetchTournaments, deleteTournament, loading } =
    useTournament();
  const { showFlash } = useFlash();
  const { sortBy, setSortBy, filteredTournaments } =
    useTournamentFilter(tournaments);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      showFlash("Você precisa estar logado para ver seus torneios!", "warning");
      return;
    }

    fetchTournaments();
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
      await fetchTournaments(); // Recarrega a lista
    } catch (error: any) {
      showFlash(
        error.response?.data?.message || "Erro ao excluir torneio!",
        "error"
      );
    }
  };

  return (
    <section>
      <div className="flex flex-col w-full min-h-screen items-center pt-22 px-5 bg-white">
        <h1 className="mt-8 mb-4 text-3xl max-[425px]:text-[22px] font-bold">
          Meus Torneios
        </h1>
        <div className="flex flex-col w-full sm:w-150 max-h-164 justify-start items-center p-4 shadow shadow-gray-400 rounded-2xl text-sm sm:text-base">
          <Filter sortBy={sortBy} onSortChange={setSortBy} />
          {loading ? (
            <p className="py-4">Carregando...</p>
          ) : filteredTournaments.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              Nenhum torneio encontrado.
            </p>
          ) : (
            <ul className="w-full justify-center items-center overflow-y-auto overflow-x-hidden py-4">
              {filteredTournaments.map((tournament) => (
                <div
                  key={tournament._id}
                  className="flex w-full items-center gap-2"
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
                    className="flex items-center justify-center w-10 h-10 p-2 cursor-pointer rounded-full hover:bg-red-100 transition-colors duration-300"
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
