import {useEffect, useState} from 'react';
import Header from './Header';
import Footer from './Footer';
import SystemChat from './SystemChat';
import {useAppContext} from '../context/AppContext';
import UserChat from "./UserChat.jsx";
import Chat from "./Chat.jsx";

const App = () => {
    const {getProblemInfo, hint} = useAppContext();

    useEffect(() => {
        getProblemInfo();
    }, []);

    const prompt = `whats the time complexity of my solution`

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