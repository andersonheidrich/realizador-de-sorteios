/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTournament } from "@/hooks/useTournament";
import { useTournamentFilter } from "@/hooks/useTournamentFilter";
import { useFlash } from "@/context/FlashContext";
import { Filter } from "@/components";

const TournamentList = () => {
  const { tournaments, fetchTournaments, loading } = useTournament();
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

  return (
    <section>
      <div className="flex flex-col w-full min-h-screen items-center pt-22 px-5 bg-white">
        <div className="mt-8 mb-4 text-3xl font-bold">Meus Torneios</div>
        <div className="flex flex-col w-full sm:w-150 max-h-164 justify-start items-center p-4 shadow shadow-gray-400 rounded-2xl text-sm sm:text-base">
          <Filter sortBy={sortBy} onSortChange={setSortBy} />
          {loading ? (
            <p>Carregando...</p>
          ) : filteredTournaments.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              Nenhum torneio encontrado.
            </p>
          ) : (
            <ul className="w-full justify-center items-center overflow-y-auto overflow-x-hidden py-4">
              {filteredTournaments.map((tournament) => (
                <Link
                  className="my-2 bg-yellow-500 hover:bg-yellow-400 rounded-2xl"
                  key={tournament._id}
                  to={`/tournaments/${tournament._id}`}
                >
                  <li className="flex flex-col items-start w-full px-4 py-2 gap-1 font-bold">
                    <h3 className="w-full break-words">{tournament.name}</h3>
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
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default TournamentList;
