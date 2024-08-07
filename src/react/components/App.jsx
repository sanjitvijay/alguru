import "regenerator-runtime";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useAppContext } from "../context/AppContext";
import Chat from "./Chat.jsx";
import Voice from "./Voice.jsx";
import UsageLimitPopup from "./UsageLimitPopup.jsx";
import ErrorPage from "./ErrorPage.jsx";

const App = () => {
  const { getProblemInfo, isChat, setUsageCounts, isValidPage } =
    useAppContext();

  useEffect(() => {
    const setup = async () => {
      await getProblemInfo();
      await setUsageCounts();
      await chrome.storage.sync.set({ chatUsage: 0, voiceUsage: 0 });
    };
    setup();
  }, []);

  return (
    <div className="w-[500px] h-[600px] bg-base-100">
      <Header />
      <div className="pt-20 px-5 pb-16">
        {isValidPage() ? isChat ? <Chat /> : <Voice /> : <ErrorPage />}
      </div>
      <Footer />

      <dialog id="chat_usage_limit_modal" className="modal">
        <div className="modal-box w-80">
          <UsageLimitPopup />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <dialog id="voice_usage_limit_modal" className="modal">
        <div className="modal-box w-80">
          <UsageLimitPopup />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};
export default App;
