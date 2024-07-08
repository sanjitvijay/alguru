import {useEffect} from 'react';
import Header from './Header';
import Footer from './Footer';
import {useAppContext} from '../context/AppContext';
import Chat from "./Chat.jsx";

const App = () => {
    const {getProblemInfo, setChatHistory, setMessageHistory} = useAppContext();

    useEffect(() => {
        const fetchChatHistory = async () => {
            await getProblemInfo();
            const savedMessages = await chrome.storage.session.get(['chatHistory', 'messageHistory']);

            savedMessages.chatHistory ? setChatHistory(savedMessages.chatHistory) : setChatHistory([]);
            savedMessages.messageHistory ? setMessageHistory(savedMessages.messageHistory) : setMessageHistory([]);
        }

         fetchChatHistory();
    }, []);

    return (
        <div className='w-[500px] h-[600px] bg-base-100'>
            <Header/>
            <div className='pt-20 px-5 pb-16'>
                <Chat/>
            </div>
            <Footer/>
        </div>
    );
};
export default App;