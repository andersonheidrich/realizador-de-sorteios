import { Route, Routes } from "react-router-dom";
import {
  Home,
  CreateTournament,
  TournamentDetails,
  TournamentList,
} from "./views";
import { Footer, Header } from "./components";
import { Login, Profile, Register } from "./views/Auth";

const AppRoutes = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />

        {/* Sorteios */}
        <Route path="/draws" element={<CreateTournament />} />

        {/* Torneios */}
        <Route
          path="/tournaments/my-tournaments"
          element={<TournamentList />}
        />
        <Route path="/tournaments/:id" element={<TournamentDetails />} />
      </Routes>
      <Footer />
    </>
  );
};

export default AppRoutes;
