import { useEffect, useState } from "react";
import api from "@/services/api";
import type { Draw } from "@/types/types";
import { Link } from "react-router-dom";

const Tournament = () => {
  const [token] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [userDraws, setUserDraws] = useState<Draw[]>([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userRes = await api.get("/users/checkuser", {
          headers: { Authorization: `Bearer ${token.replace(/"/g, "")}` },
        });
        setUser(userRes.data);

        // Busca sorteios do usuário
        const drawsRes = await api.get("/draws/user", {
          headers: { Authorization: `Bearer ${token.replace(/"/g, "")}` },
        });
        setUserDraws(drawsRes.data);
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      }
    };

    if (token) fetchProfileData();
  }, [token]);

  return (
    <section>
      <div className="flex flex-col min-h-screen items-center pt-[90px] bg-white">
        <div className="my-8 mb-4 text-[32px] font-bold">Torneios</div>
        {user && (
          <p className="text-gray-600 mb-6">
            {user.name} ({user.email})
          </p>
        )}
        <div className="flex flex-col w-160 max-h-164 justify-start items-center p-4 border-2 rounded-2xl">
          <h2 className="text-[20px] font-bold mb-4">Meus Torneios</h2>
          <h2 className="text-[20px] font-bold mb-4">Filtro AQUI</h2>
          {userDraws.length === 0 ? (
            <p className="text-center text-gray-500">
              Nenhum torneio encontrado.
            </p>
          ) : (
            <ul className="w-full justify-start items-center overflow-y-auto overflow-x-hidden">
              {userDraws.map((draw) => (
                <Link
                  className="mb-4 bg-yellow-500 hover:bg-yellow-400"
                  key={draw._id}
                  to={`/tournaments/${draw._id}`}
                >
                  <li className="flex flex-col items-start w-full p-2 gap-1">
                    <h3 className="w-full break-words">{draw.title}</h3>
                    <p>
                      Data: {new Date(draw.date).toLocaleDateString("pt-BR")}
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

export default Tournament;
