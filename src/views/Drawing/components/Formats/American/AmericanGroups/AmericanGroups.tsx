import { useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";
import type { NavigationState, Player, Round } from "@/types/types";

// import { generatePDF, generateXLSX } from "../../utils";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";

const AmericanGroups = () => {
  const location = useLocation() as Location & {
    state: NavigationState<Player>;
  };
  const { rounds } = location.state;

  return (
    <div className="flex flex-col min-h-screen items-center pt-[90px]">
      <div className="mt-8 text-[32px] font-bold">Americano</div>
      <div className="text-[24px] font-bold">Rodadas e Confrontos</div>
      <div className="grid grid-cols-2 w-full p-8 gap-8 capitalize">
        {rounds.map((groupRounds: Round<Player>[], groupIdx: number) => (
          <div
            key={groupIdx}
            className="flex flex-col w-full border border-gray-300 rounded-xl p-4 shadow"
          >
            <div className="font-bold text-lg mb-3 border-b-2">
              Grupo {groupIdx + 1}
            </div>
            <div className="flex w-full gap-8">
              <div className="flex flex-col w-full">
                {groupRounds.map((round, idx) => (
                  <div className="mb-4" key={idx}>
                    <div className="font-semibold mb-1">Rodada {idx + 1}:</div>
                    <div className="flex flex-col">
                      {round.map((match, qIdx) => (
                        <div className="flex flex-col" key={qIdx}>
                          <p className="">
                            {match.double1.join(" / ")} vs{" "}
                            {match.double2.join(" / ")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    // {/* {rounds.length > 0 && (
    //   <div>
    //     <div className="file">
    //       <span>Baixar PDF</span>
    //       <FileDownloadIcon
    //         style={{ cursor: "pointer" }}
    //         onClick={() => generatePDF(rounds)}
    //       />
    //     </div>
    //     <div className="file">
    //       <span>Baixar XLSX</span>
    //       <FileDownloadIcon
    //         style={{ cursor: "pointer" }}
    //         onClick={() => generateXLSX(rounds)}
    //       />
    //     </div>
    //   </div>
    // )} */}
  );
};

export default AmericanGroups;
