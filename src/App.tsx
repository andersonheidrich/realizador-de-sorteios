import { BrowserRouter } from "react-router-dom";
import { Footer, Header } from "./components";
import Home from "./views/Home";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Home />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
