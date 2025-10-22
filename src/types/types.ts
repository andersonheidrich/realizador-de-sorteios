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

export interface UserRegister {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserEdit {
  _id?: string;
  name: string;
  email: string;
  image: string | File;
  password?: string;
  confirm_password?: string;
}

export interface AuthResponse {
  token: string;
  message?: string;
}

export interface UserContextType {
  authenticated: boolean;
  userRegister: (user: UserRegister) => Promise<void>;
  login: (user: UserLogin) => Promise<void>;
  logout: () => void;
}

export interface Draw {
  _id?: string;
  title: string;
  date: string;
  type: "american" | "doubles" | "singles";
  players: string[];
  teams: Pair[];
  groups: string[][];
  rounds: Round<Pair>[];
  userId?: string; // vinculado ao usuário autenticado
}

export interface DrawCreate {
  title: string;
  date: string;
}
