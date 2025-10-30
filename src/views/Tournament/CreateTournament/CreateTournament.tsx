/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTournament } from "@/hooks/useTournament";
import { useFlash } from "@/context/FlashContext";
import { Input, Select } from "@/components";

const CreateTournament = () => {
  const navigate = useNavigate();
  const { createTournament, parsePairsText, error } = useTournament();
  const { showFlash } = useFlash();

  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [category, setCategory] = useState<"Pro" | "A" | "B" | "C" | "D" | "E">(
    "Pro"
  );
  const [modality, setModality] = useState<"livre" | "feminina" | "mista">(
    "livre"
  );
  const [pairsText, setPairsText] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica se o usuário está logado antes de enviar
    const token = localStorage.getItem("token");
    if (!token) {
      showFlash("Você precisa estar logado para criar um torneio!", "error");
      return;
    }

    try {
      const pairs = parsePairsText(pairsText);

      // validação: todas as duplas devem ter dois jogadores
      const isValidPairs = pairs.every(
        (p) => p.players.length === 2 && p.players.every((pl) => pl.name)
      );
      if (!isValidPairs) {
        alert("Todas as duplas devem ter dois nomes válidos");
        return;
      }

      const newTournament = await createTournament({
        name,
        date,
        category,
        modality,
        doubles: true,
        pairs,
      });
      navigate(`/tournaments/${newTournament._id}`);
    } catch (err: any) {
      showFlash(
        err.response?.data?.message || "Erro ao criar torneio",
        "error"
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center pt-[90px] bg-white">
      <div className="mt-8 mb-4 text-3xl font-bold">Sorteios</div>
      <div className="flex flex-col w-160 p-4 rounded-2xl shadow shadow-gray-400">
        <form onSubmit={handleSubmit} className="flex w-full flex-col">
          <Input
            text="Nome do Torneio"
            type="text"
            name="name"
            placeholder="Digite o nome do torneio"
            value={name}
            handleOnChange={(e) => setName(e.target.value)}
          />
          <Input
            text="Data do Torneio"
            type="date"
            name="date"
            placeholder="Digite a data do torneio"
            value={date}
            handleOnChange={(e) => setDate(e.target.value)}
          />
          <Select
            text="Modalidade"
            name="modality"
            options={["livre", "feminina", "mista"]}
            handleOnChange={(e) => setModality(e.target.value as any)}
            value={modality}
          />
          <Select
            text="Categoria"
            name="category"
            options={["Pro", "A", "B", "C", "D", "E"]}
            handleOnChange={(e) => setCategory(e.target.value as any)}
            value={category}
          />
          <textarea
            placeholder={`- Cada linha representa uma dupla.\n- Não deixe linhas vazias.\n- Cada dupla deve ter exatamente dois jogadores.\n- Separe os nomes com vírgula.\nEx.:\nAna,Carlos\nBia,João\nClara,Pedro`}
            value={pairsText}
            onChange={(e) => setPairsText(e.target.value)}
            className="p-2 border border-[#777] rounded-sm placeholder-[#7b7b7b] text-md resize-none"
            rows={12}
          />
          <button
            type="submit"
            className="bg-green-600 text-white p-2 mt-4 rounded-lg hover:bg-green-700 cursor-pointer"
          >
            Criar Torneio
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateTournament;
