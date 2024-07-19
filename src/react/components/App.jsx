import {useEffect} from 'react';
import Header from './Header';
import Footer from './Footer';
import {useAppContext} from '../context/AppContext';
import Chat from "./Chat.jsx";
import RenderHtml from "./RenderHtml.jsx";

const App = () => {
    const {getProblemInfo} = useAppContext();

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
                <Chat/>
                <RenderHtml/>
            </div>
            <Footer/>
        </div>
    );
};
export default App;