import { FlashProvider } from "./contexts/FlashProvider";
import { UserProvider } from "./contexts/UserContext";
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
