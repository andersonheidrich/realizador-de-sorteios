import { Route, Routes } from "react-router-dom";
import { Home, Drawing } from "./views";
import { Footer, Header } from "./components";
import { American } from "./views/Drawing/components/Formats";

const AppRoutes = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sorteios" element={<Drawing />} />
        <Route path="/sorteios/americano" element={<American />} />
        {/* <Route path="/torneios" element={} /> */}
      </Routes>
      <Footer />
    </>
  );
};

export default AppRoutes;
