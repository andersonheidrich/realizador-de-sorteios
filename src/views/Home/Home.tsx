/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTournament } from "@/hooks/useTournament";
import { useTournamentFilter } from "@/hooks/useTournamentFilter";
import { getUserName } from "@/utils/getUserName";
import { Filter } from "@/components";

const Home = () => {
  const { tournaments, fetchTournaments, loading } = useTournament();
  const { sortBy, setSortBy, filteredTournaments } =
    useTournamentFilter(tournaments);

  useEffect(() => {
    fetchTournaments();
  }, []);

  return (
    <section>
      <div className="flex flex-col w-full min-h-screen items-center pt-22 px-5 bg-white">
        <h1 className="mt-8 mb-4 text-3xl font-bold">Sorteador On-line</h1>
        <div className="flex flex-col w-full sm:w-150 max-h-164 justify-start items-center p-4 shadow shadow-gray-400 rounded-2xl text-sm sm:text-base">
          {/* <Filter sortBy={sortBy} onSortChange={setSortBy} /> */}
          {loading ? (
            <p>Carregando...</p>
          ) : filteredTournaments.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              Nenhum torneio encontrado.
            </p>
          ) : (
            <ul className="w-full justify-start items-center overflow-y-auto overflow-x-hidden py-4">
              {filteredTournaments.map((tournament) => (
                <Link
                  className="my-2 bg-gray-500 hover:bg-gray-600 rounded-2xl"
                  key={tournament._id}
                  to={`/tournaments/${tournament._id}`}
                >
                  <li className="flex flex-col items-start w-full px-4 py-2 gap-1 text-white font-bold">
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
                        Término:{" "}
                        {new Date(tournament.endDate).toLocaleDateString(
                          "pt-BR"
                        )}
                      </span>
                    </p>
                    <div className="flex gap-2 text-xs sm:text-sm mt-1 items-center  capitalize">
                      Criado por:
                      <span className="bg-white/30 px-2 py-1 rounded">
                        {getUserName(tournament.user)}
                      </span>
                    </div>
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

export default Home;
