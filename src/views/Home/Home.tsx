import { useTournament } from "@/hooks/useTournament";
import { getUserName } from "@/utils/getUserName";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const { tournaments, fetchTournaments, loading } = useTournament();

  useEffect(() => {
    fetchTournaments();
  }, []);

  return (
    <section>
      <div className="flex flex-col min-h-screen items-center pt-[90px] bg-white">
        <h1 className="mt-8 mb-4 text-3xl font-bold">Sorteador On-line</h1>
        <ul className="mt-3">
          <li>Realize sorteios.</li>
          <li>Crie e gerencie torneios de forma rápida e fácil.</li>
          <li>
            Faça download dos grupos e tabelas de jogos em arquivos nos formatos
            PDF e XLSX.
          </li>
        </ul>
        <div className="flex flex-col w-160 max-h-164 justify-start items-center p-4 mt-3 shadow shadow-gray-400 rounded-2xl">
          <h2 className="text-[20px] font-bold">Filtro AQUI</h2>
          {loading ? (
            <p>Carregando...</p>
          ) : tournaments.length === 0 ? (
            <p className="text-center text-gray-500">
              Nenhum torneio encontrado.
            </p>
          ) : (
            <ul className="w-full justify-start items-center overflow-y-auto overflow-x-hidden py-4">
              {tournaments.map((tournament) => (
                <Link
                  className="my-2 bg-gray-400 hover:bg-gray-500 rounded-2xl"
                  key={tournament._id}
                  to={`/tournaments/${tournament._id}`}
                >
                  <li className="flex flex-col items-start w-full px-4 py-2 gap-1">
                    <h3 className="w-full break-words">{tournament.name}</h3>
                    <p>
                      Data:{" "}
                      {new Date(tournament.date).toLocaleDateString("pt-BR")}
                    </p>
                    <div className="flex gap-2 text-sm mt-1 items-center  capitalize">
                      Categoria:
                      <span className="bg-white/30 px-2 py-1 rounded">
                        {tournament.modality}
                      </span>
                      <span className="bg-white/30 px-2 py-1 rounded">
                        {tournament.category}
                      </span>
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
