import { useLocation } from "react-router-dom";
import type { Round, Pair } from "@/types/types";

type NavigationState = {
  rounds: Round<Pair>[];
  players: string[][];
};

const DoublesGroups = () => {
  const location = useLocation();
  const { rounds } = location.state as NavigationState;

  return (
    <div className="flex flex-col min-h-screen items-center pt-[90px]">
      <div className="mt-8 text-[32px] font-bold">Duplas</div>
      <div className="text-[24px] font-bold">Rodadas e Confrontos</div>
      <div className="grid grid-cols-2 w-full p-8 gap-8 capitalize">
        {rounds.map((matches, roundIndex) => (
          <div
            key={roundIndex}
            className="flex flex-col w-full border border-gray-300 rounded-xl p-4 shadow"
          >
            <div className="font-bold text-lg mb-3 border-b-2">
              Grupo {roundIndex + 1}
            </div>
            <div className="flex w-full gap-8">
              <div className="flex flex-col w-full">
                {matches.map((match, matchIndex) => (
                  <div className="mb-4" key={matchIndex}>
                    <div className="font-semibold mb-1">
                      Rodada {matchIndex + 1}:
                    </div>
                    <div className="flex flex-col">
                      <p className="">
                        {match.double1.join(" / ")} vs{" "}
                        {match.double2.join(" / ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoublesGroups;
