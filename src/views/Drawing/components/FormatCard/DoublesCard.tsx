import { useNavigate } from "react-router-dom";

const DoublesCard = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-140 min-h-175 justify-start items-center p-4 border-2 rounded-2xl">
      <div
        className="flex w-30 justify-center items-center border-2 rounded-2xl p-2 mb-5 cursor-pointer"
        onClick={() => navigate("/sorteios/duplas")}
      >
        Duplas
      </div>
      <ul className="list-disc ml-4">
        <li>Pode ser com dupla fixa ou sorteada na hora.</li>
        <li className="mt-2">
          A cada rodada, as duplas se enfrentam até que todas tenham jogado
          contra todas dentro do grupo.
        </li>
        <li className="mt-2">
          Pontuação: As duplas pontuam conforme seus resultados.
        </li>
        <li className="mt-2">
          Ex.: se uma dupla vence por 6 a 4, a dupla vencedora ganha 6 pontos, e
          a perdedora ganha 4.
        </li>
        <li className="mt-2">
          Duração fixa ou por número de rodadas: As partidas podem ter tempo
          cronometrado (ex.: 15 minutos por jogo) ou ser jogadas até determinado
          número de games (ex.: até 6 games).
        </li>
        <li className="mt-2">
          O número de rodadas depende do número de duplas inscritas.
        </li>
        <li className="mt-2">
          Classificação final: Ao fim de todas as rodadas, os pontos de cada
          dupla são somados. As duplas que tiverem o maior número de vitórias e
          games ganhos avançam de fase.
        </li>
        <li className="mt-2">
          Desempate: Se houver empate em pontos, os critérios de desempate podem
          incluir:
          <ol className="list-decimal ml-5">
            <li className="mt-2">Confronto direto (se aplicável)</li>
            <li className="mt-2">
              Diferença de games (games ganhos - games perdidos)
            </li>
            <li className="mt-2">Sorteio (em casos raros)</li>
          </ol>
        </li>
      </ul>
    </div>
  );
};

export default DoublesCard;
