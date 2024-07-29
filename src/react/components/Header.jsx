import logo from '../assets/logo.png';
import {useAppContext} from "../context/AppContext.jsx";
import { IoTrashOutline } from "react-icons/io5";

function Header() {
    const {resetHistory} = useAppContext();

    return (
    <div className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 pb-[2px] z-10 fixed">
        <div className="flex h-10 w-full items-center justify-between bg-base-100 back py-8 px-3">
            <div className='flex items-center'>
                <img src={logo} alt="logo" className="h-10 w-10 mr-3"/>
                <div className="text-3xl text-white font-bold">Alguru</div>
            </div>
            <div>
                <button
                    className='btn btn-xs btn-error btn-outline no-animation'
                    onClick={resetHistory}
                >
                    <IoTrashOutline size={15}/>
                    Clear Chat
                </button>
            </div>
        </div>
    </div>
    )
}

export default Header;
