import React, { useState } from 'react';
import { MessageCircle, Mic } from 'lucide-react';
import {useAppContext} from "../context/AppContext.jsx";

const SlidingToggle = () => {
    const {isChat, toggleMode} = useAppContext()

    return (
        <div
            className="relative w-24 h-12 bg-transparent border-gray-500 border-2 rounded-full p-0.5 cursor-pointer"
            onClick={toggleMode}
        >
            <div
                className={`absolute top-1 bottom-1 w-10 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center ${
                    isChat ? 'left-1' : 'right-1'
                }`}
                style={{
                    background: 'linear-gradient(45deg, #ff0000, #ff69b4, #eab308)',
                    border: '2px solid transparent',
                    backgroundClip: 'padding-box',
                }}
            >
                {isChat ? (
                    <MessageCircle className="w-5 h-5 text-white" />
                ) : (
                    <Mic className="w-5 h-5 text-white" />
                )}
            </div>
            <div className="relative flex justify-between items-center h-full px-3">
                <MessageCircle className={`w-5 h-5 ${isChat ? 'opacity-0' : 'text-gray-500'}`} />
                <Mic className={`w-5 h-5 ${!isChat ? 'opacity-0' : 'text-gray-500'}`} />
            </div>
        </div>
    );
};

export default SlidingToggle;