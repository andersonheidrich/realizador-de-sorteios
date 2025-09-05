import { Route, Routes } from "react-router-dom";
import { Home, Drawing, Tournament } from "./views";
import { Footer, Header } from "./components";
import { American, Doubles } from "./views/Drawing/components/Formats";
import { AmericanGroups } from "./views/Drawing/components/Formats/American";

const AppRoutes = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Sorteios */}
        <Route path="/sorteios" element={<Drawing />} />
        <Route path="/sorteios/americano" element={<American />} />
        <Route path="/sorteios/americano/grupos" element={<AmericanGroups />} />
        <Route path="/sorteios/duplas" element={<Doubles />} />
        {/* <Route path="/sorteios/duplas/grupos" element={<DoublesGroups />} /> */}

        {/* Torneios */}
        <Route path="/torneios" element={<Tournament />} />
      </Routes>
      <Footer />
    </>
  );
};

export default AppRoutes;
