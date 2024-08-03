import "regenerator-runtime"
import {useEffect} from 'react';
import Header from './Header';
import Footer from './Footer';
import {useAppContext} from '../context/AppContext';
import Chat from "./Chat.jsx";
import speech, {useSpeechRecognition} from "react-speech-recognition";
import Voice from "./Voice.jsx";

const App = () => {
    const {getProblemInfo, isChat} = useAppContext();


    const {listening, transcript} = useSpeechRecognition()

    useEffect(() => {
        const getInfoWrapper = async () => {
            await getProblemInfo();
        }

         getInfoWrapper();
    }, []);


    return (
        <div className='w-[500px] h-[600px] bg-base-100'>
            <Header/>
            <div className='pt-20 px-5 pb-16'>
                {isChat ? <Chat/> : <Voice/>}
            </div>
            <Footer/>
        </div>
    );
};
export default App;