// Jogador é apenas uma string (nome)
export type Player = string;

// Grupo = lista de jogadores
export type Group = Player[];

// Par = dupla de jogadores
export type Pair = [Player, Player];

// Um jogo (match) é formado por duas duplas
export type Match = {
  double1: Pair;
  double2: Pair;
};

// Uma rodada contém vários jogos (matches)
export type Round = Match[];

// Resultado completo = várias rodadas por grupo
export type RoundsResult = Round[][];

// Estado passado pelo navigate
export interface NavigationState {
  rounds: RoundsResult;
  players: Group[];
}
