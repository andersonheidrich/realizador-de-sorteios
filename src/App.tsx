import { FlashProvider } from "./context/FlashContext";
import { UserProvider } from "./context/UserContext";
import AppRoutes from "./routes";

const App = () => {
  return (
    <UserProvider>
      <FlashProvider>
        <AppRoutes />
      </FlashProvider>
    </UserProvider>
  );
};

export default App;
