import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDraw } from "@/hooks/useDraw";
import { Input, Select } from "@/components";
import { type DrawType, type DrawPayload } from "@/types/types";

export default function CreateDraw() {
  const { createDraw } = useDraw();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<DrawType | "">("");
  const [playersText, setPlayersText] = useState("");
  const [teamsText, setTeamsText] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validação básica
    if (!title.trim()) {
      setError("O nome do sorteio é obrigatório.");
      return;
    }

    if (type === "") {
      setError("Selecione o tipo do torneio.");
      return;
    }

    const payload: DrawPayload = { title, type };

    if (type === "doubles") {
      const teams = teamsText
        .split("\n")
        .map((line) =>
          line
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean)
        )
        .filter((t) => t.length === 2);

      if (teams.length === 0) {
        setError("É necessário informar pelo menos uma dupla válida.");
        return;
      }

      payload.teams = teams;
    } else {
      const players = playersText
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean);

      if (players.length === 0) {
        setError("É necessário informar pelo menos um jogador.");
        return;
      }

      payload.players = players;
    }

    const draw = await createDraw(payload);
    if (draw?._id) navigate(`/draws/${draw._id}`);
  }

  return (
    <div className="flex flex-col min-h-screen items-center pt-[90px] bg-white">
      <div className="my-8 mb-4 text-[32px] font-bold">Sorteios</div>
      <div className="flex flex-col w-160 p-4 rounded-2xl shadow shadow-gray-400">
        <h2 className="text-xl font-bold mb-4">Criar novo sorteio</h2>

        {error && <p className="text-red-600 mb-2 font-semibold">{error}</p>}

        <form onSubmit={handleSubmit} className="flex w-full flex-col">
          <Input
            text="Nome do Torneio"
            type="text"
            name="title"
            placeholder="Digite o nome do torneio"
            value={title}
            handleOnChange={(e) => setTitle(e.target.value)}
          />
          <Select
            text="Tipo do Torneio"
            name="type"
            options={["american", "doubles", "single"]}
            handleOnChange={(e) =>
              setType(e.target.value as "american" | "single" | "doubles")
            }
            value={type}
          />
          {type !== "doubles" && (
            <textarea
              placeholder="Jogadores (um por linha)"
              value={playersText}
              onChange={(e) => setPlayersText(e.target.value)}
              className="p-2 border border-[#777] rounded-sm placeholder-[#7b7b7b] text-md resize-none"
              rows={16}
            />
          )}
          {type === "doubles" && (
            <textarea
              placeholder="Duplas (ex: Ana, Carlos)"
              value={teamsText}
              onChange={(e) => setTeamsText(e.target.value)}
              className="p-2 border border-[#777] rounded-sm placeholder-[#7b7b7b] text-md resize-none"
              rows={16}
            />
          )}
          <button
            type="submit"
            className="bg-green-600 text-white p-2 mt-4 rounded-lg hover:bg-green-700 cursor-pointer"
          >
            Criar Sorteio
          </button>
        </form>
      </div>
    </div>
  );
}
