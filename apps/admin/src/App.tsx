import "./index.css";
import { ModalProvider } from "./context/ModalContext";
import { AppRoutes } from "./routes/AppRoutes";

export function App() {
  return (
    <ModalProvider>
      <AppRoutes />
    </ModalProvider>
  );
}

export default App;
