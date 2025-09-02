import { Route, Routes } from "react-router-dom";
import { Home, Drawing } from "./views";
import { Footer, Header } from "./components";

const AppRoutes = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sorteios" element={<Drawing />} />
        {/* <Route path="/torneios" element={} /> */}
      </Routes>
      <Footer />
    </>
  );
};

export default AppRoutes;
