import GroupStandings from "./GroupStandings";
import GroupMatches from "./GroupMatches";
import type { Group } from "@/types/types";

interface Props {
  group: Group;
  catIndex: number;
  groupIndex: number;
  canEdit: boolean;
  scores: Record<string, { team1: string; team2: string }>;
  onInputChange: React.Dispatch<
    React.SetStateAction<Record<string, { team1: string; team2: string }>>
  >;
}

const GroupCard = ({
  group,
  catIndex,
  groupIndex,
  canEdit,
  scores,
  onInputChange,
}: Props) => {
  return (
    <div className="flex flex-col border-2 border-gray-300 p-3 rounded-lg bg-white">
      <div className="p-2 bg-yellow-500 rounded mb-3">
        <h3 className="font-bold text-center">{group.name}</h3>
      </div>

      <GroupStandings standings={group.standings ?? []} />
      <GroupMatches
        matches={group.matches}
        catIndex={catIndex}
        groupIndex={groupIndex}
        canEdit={canEdit}
        scores={scores}
        onInputChange={onInputChange}
      />
    </div>
  );
};

export default GroupCard;
