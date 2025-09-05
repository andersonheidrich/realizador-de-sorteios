// Jogador é apenas uma string (nome)
export type Player = string;

// Par = dupla de jogadores
export type Pair = [Player, Player];

// Grupo = lista de jogadores
export type Group<T> = T[];

// Um jogo (match) é formado por duas duplas
export type Match<T> = {
  double1: T[];
  double2: T[];
};

// Uma rodada contém vários jogos (matches)
export type Round<T> = Match<T>[];

// Resultado completo = várias rodadas por grupo
export type RoundsResult<T> = Round<T>[][];

// Estado passado pelo navigate
export interface NavigationState<T> {
  rounds: RoundsResult<T>;
  players: Group<T>[];
}
