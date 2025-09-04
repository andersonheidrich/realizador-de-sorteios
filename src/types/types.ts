export type Player = string;
export type Group = Player[];
export type RoundsResult = string[][];
export type Pair = [Player, Player];
export type Match = {
  double1: Pair;
  double2: Pair;
};
export type Round = Match[];

export interface NavigationState {
  rounds: RoundsResult[];
  players: Group[];
}
