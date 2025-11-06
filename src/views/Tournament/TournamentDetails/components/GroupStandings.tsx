/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Standing } from "@/types/types";

interface Props {
  standings: Standing[];
}

const GroupStandings = ({ standings }: Props) => {
  return (
    <div className="mb-3 p-3 bg-yellow-100 rounded">
      <h4 className="font-bold mb-2 border-b border-yellow-300 pb-1">
        Classificação
      </h4>
      <div className="flex justify-between font-bold text-sm mb-1">
        <span>Dupla</span>
        <div className="flex gap-4">
          <span>Vitórias</span>
          <span>Saldo</span>
        </div>
      </div>
      <ul className="space-y-1">
        {standings?.map((s: any, i: number) => (
          <li key={i} className="flex justify-between text-sm">
            <span>{s.pair}</span>
            <div className="flex gap-4">
              <span>{s.wins}</span>
              <span>({s.gamesWon - s.gamesLost})</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupStandings;
