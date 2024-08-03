import {useAppContext} from "../context/AppContext.jsx";
import UserChat from "./UserChat.jsx";
import SystemChat from "./SystemChat.jsx";
import {useEffect, useRef} from "react";
import {IoTrashOutline} from "react-icons/io5";


function Chat() {
    const {chatHistory, resetHistory} = useAppContext();
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);
    return (
        <div>
            {chatHistory.map((chat, index) => (
                chat.role === 'user' ?
                    (<UserChat question={chat.content} key={index}/>) :
                    (<SystemChat response={chat.content} key={index}/>)
            ))}
            <div ref={chatEndRef}/>
        </div>
    );
}

export default Chat;