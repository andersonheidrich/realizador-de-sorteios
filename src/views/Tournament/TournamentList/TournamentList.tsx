/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTournament } from "@/hooks/useTournament";
import { useFlash } from "@/context/FlashContext";

const TournamentList = () => {
  const { tournaments, fetchTournamentsByUser, loading } = useTournament();
  const { showFlash } = useFlash();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      showFlash("Você precisa estar logado para ver seus torneios!", "warning");
      return;
    }

    fetchTournamentsByUser();
  }, []);

  const handleCreateClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      showFlash("Você precisa estar logado para criar um torneio!", "warning");
    }
  };

  return (
    <section>
      <div className="flex flex-col min-h-screen items-center pt-[90px] bg-white">
        <div className="mt-8 mb-4 text-3xl font-bold">Meus Torneios</div>
        <Link
          to="/draws"
          onClick={handleCreateClick}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Criar Torneio
        </Link>
        <div className="flex flex-col w-160 max-h-164 justify-start items-center p-4 shadow shadow-gray-400 rounded-2xl">
          <h2 className="text-[20px] font-bold">Filtro AQUI</h2>
          {loading ? (
            <p>Carregando...</p>
          ) : tournaments.length === 0 ? (
            <p className="text-center text-gray-500">
              Nenhum torneio encontrado.
            </p>
          ) : (
            <ul className="w-full justify-center items-center overflow-y-auto overflow-x-hidden py-4">
              {tournaments.map((tournament) => (
                <Link
                  className="my-2 bg-yellow-500 hover:bg-yellow-400 rounded-2xl"
                  key={tournament._id}
                  to={`/tournaments/${tournament._id}`}
                >
                  <li className="flex flex-col items-start w-full px-4 py-2 gap-1">
                    <h3 className="w-full break-words">{tournament.name}</h3>
                    <p>
                      Data:{" "}
                      {new Date(tournament.date).toLocaleDateString("pt-BR")}
                    </p>
                    <div className="flex gap-2 text-sm mt-1 items-center">
                      Categoria:
                      <span className="bg-white/30 px-2 py-1 rounded capitalize">
                        {tournament.modality}
                      </span>
                      <span className="bg-white/30 px-2 py-1 rounded">
                        {tournament.category}
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

export default TournamentList;
