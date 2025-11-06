// User

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
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
  user: {
    id: string;
    _id: string;
    name: string;
    email: string;
  };
}

export interface UserContextType {
  authenticated: boolean;
  userRegister: (user: UserRegister) => Promise<void>;
  login: (user: UserLogin) => Promise<void>;
  logout: () => void;
}

// Tournament

export interface Player {
  name: string;
}

export interface Pair {
  players: Player[];
}

export interface Match {
  team1: string[]; // nomes dos jogadores
  team2: string[];
  score?: string | null;
  winner?: string[] | null;
}

export interface Standing {
  pair: string;
  wins: number;
  gamesWon: number;
  gamesLost: number;
  gameDiff?: number;
}

export interface Group {
  name: string;
  pairs: Pair[];
  matches: Match[];
  standings?: Standing[];
}

export interface Category {
  id: string;
  name: string;
  pairs: Pair[];
  groups?: Group[];
  isDrawn: boolean;
}

export interface Round {
  name: string;
  matches: Match[];
}

export interface Tournament {
  _id?: string;
  name: string;
  startDate: string;
  endDate: string;
  categories?: Category[];
  doubles?: boolean;
  pairs?: Pair[];
  groups?: Group[];
  rounds?: Round[];
  user?: string | User;
  createdAt?: string;
  updatedAt?: string;
}
