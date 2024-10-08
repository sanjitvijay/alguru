import { useEffect, useState } from "react";
import { BsArrowUpCircleFill } from "react-icons/bs";
import { useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { format } from "date-fns";

function Footer() {
  const textareaRef = useRef();
  const {
    question,
    setQuestion,
    askQuestion,
    isChat,
    isChatAvailable,
    isVoiceAvailable,
    chatUnlockTime,
    voiceUnlockTime,
    isValidPage,
  } = useAppContext();
  const [loading, setLoading] = useState(false);

  const placeholders = [
    "Give me a hint",
    "Determine the time complexity of my solution",
    "What topics does this problem cover",
    "Show me the solution",
  ];

  const [placeholder, setPlaceholder] = useState(placeholders[0]);
  let placeholderCounter = 1;

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder(placeholders[placeholderCounter]);
      placeholderCounter = (placeholderCounter + 1) % placeholders.length;
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const onChange = (e) => {
    setQuestion(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    textareaRef.current.value = "";
    setQuestion("");
    setLoading(true);
    await askQuestion();
    setLoading(false);
  };

  return (
    <div className="btm-nav px-5 pb-2">
      {isValidPage() &&
        (isChat ? (
          isChatAvailable ? (
            <form>
              <div className="w-full rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px]">
                <div className="flex h-10 w-full items-center justify-center bg-base-100 back rounded-[5px]">
                  <input
                    ref={textareaRef}
                    placeholder={placeholder}
                    className="w-full bg-transparent text-black dark:text-white text-lg px-3 focus:outline-none focus:ring-0 focus:border-gray-800 border-none h"
                    onChange={onChange}
                  />
                  <button
                    type="submit"
                    className="py-5 mr-3"
                    onClick={onSubmit}
                    disabled={question.length === 0 || loading}
                  >
                    <BsArrowUpCircleFill
                      size={30}
                      color={question.length === 0 ? "grey" : "#EC4899"}
                    />
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="prose text-md">
              Continue using chat from{" "}
              {format(new Date(chatUnlockTime), "EEEE, h:mma")}
            </div>
          )
        ) : (
          !isVoiceAvailable && (
            <div className="prose text-md">
              Continue using voice assistant from{" "}
              {format(new Date(voiceUnlockTime), "EEEE, h:mma")}
            </div>
          )
        ))}
    </div>
  );
}

export default Footer;
