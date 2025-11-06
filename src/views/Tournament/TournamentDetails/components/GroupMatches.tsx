/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Match } from "@/types/types";

interface Props {
  matches: Match[];
  catIndex: number;
  groupIndex: number;
  canEdit: boolean;
  scores: Record<string, { team1: string; team2: string }>;
  onInputChange: React.Dispatch<
    React.SetStateAction<Record<string, { team1: string; team2: string }>>
  >;
}

const GroupMatches = ({
  matches,
  catIndex,
  groupIndex,
  canEdit,
  scores,
  onInputChange,
}: Props) => {
  return (
    <div className="p-3 bg-yellow-100 rounded">
      <h4 className="font-bold mb-2 border-b border-yellow-300 pb-1">
        Partidas
      </h4>
      <ul className="space-y-2">
        {matches.map((m: any, matchIndex: number) => {
          const key = `${catIndex}-${groupIndex}-${matchIndex}`;
          const team1Score = Number(scores[key]?.team1);
          const team2Score = Number(scores[key]?.team2);

          // Determina o vencedor (se houver placar válido)
          const winner =
            !isNaN(team1Score) && !isNaN(team2Score)
              ? team1Score > team2Score
                ? "team1"
                : team2Score > team1Score
                ? "team2"
                : "draw"
              : null;

          return (
            <li key={matchIndex} className="text-sm">
              <div className="flex items-center justify-between gap-2 py-1">
                <div className="flex-1 min-w-0">
                  <span
                    className={
                      winner === "team1"
                        ? "font-bold"
                        : winner === "team2"
                        ? "text-gray-700"
                        : ""
                    }
                  >
                    {m.team1.join(" / ")}
                  </span>
                  <span className="font-bold"> x </span>
                  <span
                    className={
                      winner === "team2"
                        ? "font-bold"
                        : winner === "team1"
                        ? "text-gray-700"
                        : ""
                    }
                  >
                    {m.team2.join(" / ")}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <input
                    type="text"
                    value={scores[key]?.team1 || ""}
                    onChange={(e) =>
                      onInputChange((prev) => ({
                        ...prev,
                        [key]: { ...prev[key], team1: e.target.value },
                      }))
                    }
                    disabled={!canEdit}
                    className={`w-12 text-center border rounded ${
                      !canEdit ? "bg-gray-100" : ""
                    }`}
                  />
                  <span className="font-bold">x</span>
                  <input
                    type="text"
                    value={scores[key]?.team2 || ""}
                    onChange={(e) =>
                      onInputChange((prev) => ({
                        ...prev,
                        [key]: { ...prev[key], team2: e.target.value },
                      }))
                    }
                    disabled={!canEdit}
                    className={`w-12 text-center border rounded ${
                      !canEdit ? "bg-gray-100" : ""
                    }`}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default GroupMatches;
