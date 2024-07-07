import {useAppContext} from "../context/AppContext.jsx";
import UserChat from "./UserChat.jsx";
import SystemChat from "./SystemChat.jsx";


function Chat() {
    const {chatHistory} = useAppContext();

    return (
        <div>
            {chatHistory.map((chat, index) => (
                chat.role === 'user' ?
                    (<UserChat question={chat.content} key={index}/>) :
                    (<SystemChat response={chat.content} key={index}/>)
            ))}
        </div>
    );
}

export default Chat;