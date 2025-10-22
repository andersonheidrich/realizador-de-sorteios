import { useAmericanDraw } from "@/hooks/useAmericanDraw";
import { Button, Input } from "@/components";
import { RemoveCircle } from "@mui/icons-material";

const AmericanDraw = () => {
  const {
    drawName,
    setDrawName,
    playerListText,
    setPlayerListText,
    players,
    groups,
    setGroups,
    addPlayerList,
    removePlayer,
    handleDraw,
  } = useAmericanDraw();

  return (
    <div className="flex flex-col min-h-screen items-center pt-[90px] bg-white">
      <div className="my-8 text-[32px] font-bold">Americano</div>
      <Input
        text="Nome do Torneio"
        type="text"
        name="title"
        placeholder="Digite o nome do torneio"
        value={drawName}
        handleOnChange={(e) => setDrawName(e.target.value)}
      />
      <div className="flex w-full justify-center items-center gap-8 px-4">
        <div className="flex flex-col w-140 h-140 items-start">
          <div className="text-2xl font-bold mb-2">Adicionar Jogadores</div>
          <textarea
            className="flex w-full border-2 rounded-[4px] p-2 resize-none"
            rows={24}
            placeholder="Um nome por linha ou separados por vírgula"
            value={playerListText}
            onChange={(e) => setPlayerListText(e.target.value)}
          />
          <div className="flex w-full justify-center items-center p-4">
            <Button
              className="flex w-32 shadow text-white bg-green-700"
              onClick={addPlayerList}
            >
              Adicionar
            </Button>
          </div>
        </div>
        <div className="flex flex-col w-140 h-140 items-start">
          <div className="flex text-2xl font-bold mb-2">
            Jogadores ({players.length})
          </div>
          <ul className="flex flex-col w-full min-h-110 border-2 rounded-[4px] p-2 overflow-y-auto">
            {players.map((name, index) => (
              <li
                className="flex justify-between p-1 mb-1 bg-green-300 rounded-[4px]"
                key={index}
              >
                <div className="">{name}</div>
                <RemoveCircle
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() => removePlayer(name)}
                />
              </li>
            ))}
          </ul>
          <div className="flex w-full justify-between items-center gap-8 p-4">
            <div className="flex flex-col w-32">
              <div className="flex w-full">Grupos:</div>
              <input
                className="flex w-full justify-center items-center border-2 rounded-sm pl-1"
                type="number"
                value={groups}
                onChange={(e) => setGroups(Number(e.target.value))}
                min={1}
                max={Math.floor(players.length / 4)}
              />
            </div>
            <Button
              className="flex w-32 shadow text-white bg-purple-500"
              onClick={handleDraw}
            >
              Sortear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmericanDraw;
