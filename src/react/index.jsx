import { createRoot } from "react-dom/client";
import App from "./components/App";
import "./styles.css";
import { AppContextProvider } from "./context/AppContext";
import { AIProvider } from "./context/AIContext";
import { VoiceChatProvider } from "./context/VoiceChatContext.jsx";

const root = createRoot(document.getElementById("root"));
root.render(
  <AIProvider>
    <AppContextProvider>
      <VoiceChatProvider>
        <App />
      </VoiceChatProvider>
    </AppContextProvider>
  </AIProvider>,
);
