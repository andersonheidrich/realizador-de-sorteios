import { useState } from "react";
import { Input } from "@/components";
import { useFlash } from "@/hooks/useFlash";

interface TournamentInfoEditorProps {
  initialName: string;
  initialStartDate: string;
  initialEndDate?: string;
  onSave: (name: string, startDate: string, endDate?: string) => void;
  onCancel: () => void;
}

const TournamentInfoEditor = ({
  initialName,
  initialStartDate,
  initialEndDate,
  onSave,
  onCancel,
}: TournamentInfoEditorProps) => {
  const { showFlash } = useFlash();
  const [name, setName] = useState(initialName);
  const [startDate, setStartDate] = useState(
    initialStartDate
      ? new Date(initialStartDate).toISOString().split("T")[0]
      : ""
  );
  const [endDate, setEndDate] = useState(
    initialEndDate ? new Date(initialEndDate).toISOString().split("T")[0] : ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    // Valida se a data de término é maior ou igual à data de início
    if (endDate && new Date(endDate) < new Date(startDate)) {
      showFlash(
        "A data de encerramento não pode ser anterior à data de início!",
        "warning"
      );
      return;
    }

    onSave(name.trim(), startDate, endDate || undefined);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 p-6 bg-blue-50 border-2 border-blue-300 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Editar Informações do Torneio</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          placeholder=""
          value={startDate}
          handleOnChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          text="Data de Término"
          type="date"
          name="endDate"
          placeholder=""
          value={endDate}
          handleOnChange={(e) => setEndDate(e.target.value)}
        />
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 cursor-pointer transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors font-medium"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
};

export default TournamentInfoEditor;
