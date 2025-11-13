/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTournament } from "@/hooks/useTournament";
import { useFlash } from "@/hooks/useFlash";
import { Input } from "@/components";

const CreateTournament = () => {
  const navigate = useNavigate();
  const { createTournament, error } = useTournament();
  const { showFlash } = useFlash();

  const [name, setName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Função para converter data local para ISO sem perder o dia
  const dateToISO = (dateString: string): string => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      12,
      0,
      0
    ).toISOString();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verifica se o usuário está logado antes de enviar
    const token = localStorage.getItem("token");
    if (!token) {
      showFlash("Você precisa estar logado para criar um torneio!", "error");
      return;
    }

    // Validação dos campos
    if (!name.trim()) {
      showFlash("O nome do torneio é obrigatório!", "warning");
      return;
    }

    if (!startDate) {
      showFlash("A data de início é obrigatória!", "warning");
      return;
    }

    if (!endDate) {
      showFlash("A data de encerramento é obrigatória!", "warning");
      return;
    }

    // Valida se a data de encerramento é maior ou igual à data de início
    if (endDate && new Date(endDate) < new Date(startDate)) {
      showFlash(
        "A data de encerramento não pode ser anterior à data de início!",
        "warning"
      );
      return;
    }

    try {
      const newTournament = await createTournament({
        name: name.trim(),
        startDate: dateToISO(startDate),
        endDate: dateToISO(endDate),
      });
      showFlash("Torneio criado com sucesso!", "success");
      navigate(`/tournaments/${newTournament._id}`);
    } catch (err: any) {
      showFlash(
        err.response?.data?.message || "Erro ao criar torneio",
        "error"
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center pt-22 px-5 bg-white">
      <div className="mt-8 mb-4 text-3xl font-bold">Novo Torneio</div>
      <div className="flex flex-col w-full sm:w-150 p-4 rounded-2xl shadow shadow-gray-400">
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
            text="Data de Início"
            type="date"
            name="startDate"
            placeholder="Digite a data de início do torneio"
            value={startDate}
            handleOnChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            text="Data de Encerramento"
            type="date"
            name="endDate"
            placeholder="Digite a data de encerramento do torneio"
            value={endDate}
            handleOnChange={(e) => setEndDate(e.target.value)}
          />
          <button
            type="submit"
            className="bg-violet-600 text-white p-2 mt-4 rounded-lg hover:bg-violet-500 font-bold cursor-pointer"
          >
            Criar Torneio
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Dica:</strong> Após criar o torneio, você poderá
            adicionar categorias e duplas na tela de gerenciamento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateTournament;
