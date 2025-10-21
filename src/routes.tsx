import { Route, Routes } from "react-router-dom";
import { Home, Draws, Tournament } from "./views";
import { Footer, Header } from "./components";
import { American, Doubles, Single } from "./views/Draws/components/Formats";
import { AmericanGroups } from "./views/Draws/components/Formats/American";
import { DoublesGroups } from "./views/Draws/components/Formats/Doubles";
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
        {/* <Route path="/profile/mydraws" element={<MyDraws />} /> */}
        {/* <Route path="/profile/mytournaments" element={<MyTournaments />} /> */}
        {/* Sorteios */}
        <Route path="/draws" element={<Draws />} />
        <Route path="/draws/american" element={<American />} />
        <Route path="/draws/american/groups" element={<AmericanGroups />} />
        <Route path="/draws/doubles" element={<Doubles />} />
        <Route path="/draws/doubles/groups" element={<DoublesGroups />} />
        <Route path="/draws/single" element={<Single />} />
        {/* <Route path="/draws/single/groups" element={<SingleGroups />} /> */}
        {/* Torneios */}
        <Route path="/tournaments" element={<Tournament />} />
        {/* <Route path="/tournaments" element={<TournamentDetails />} /> */}
      </Routes>
      <Footer />
    </>
  );
};

export default AppRoutes;
