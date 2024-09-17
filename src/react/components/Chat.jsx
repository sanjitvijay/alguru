import { useAppContext } from "../context/AppContext.jsx";
import UserChat from "./UserChat.jsx";
import SystemChat from "./SystemChat.jsx";
import { useEffect, useRef } from "react";
import { IoTrashOutline } from "react-icons/io5";
import Info from "./info.md";
import QrCode from "../assets/qr-code.png";

function Chat() {
  const { chatHistory } = useAppContext();
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);
  return (
    <div>
      {chatHistory.map((chat, index) =>
        chat.role === "user" ? (
          <UserChat question={chat.content} key={index} />
        ) : (
          <SystemChat response={chat.content} key={index} />
        ),
      )}
      <UserChat question={"Help me with Leetcode!"} />
      <SystemChat response={Info} />
      <div className="flex justify-center">
        <div className="rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px]">
          <img src={QrCode} alt="QR Code" className="w-32 h-32 rounded-md" />
        </div>
      </div>

      <div ref={chatEndRef} />
    </div>
  );
}

export default Chat;
