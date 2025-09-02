import { BrowserRouter } from "react-router-dom";
import { Header } from "./components";
import Home from "./views/Home";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Home />
    </BrowserRouter>
  );
}

export default App;
