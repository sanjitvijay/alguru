import React, { createContext, useEffect, useState } from 'react';
import OpenAI from 'openai';

// Create a new context
const AIContext = createContext();
export const useAIContext = () => React.useContext(AIContext);

export const AIProvider = ({ children }) => {
    const API_KEY = process.env.REACT_APP_OPENAI_API_KEY; 
    const openai = new OpenAI({
        apiKey: API_KEY,
        dangerouslyAllowBrowser: true
    })

    const fetchStreamedResponse = async (messageHistory) => {
        console.log(messageHistory)
        const stream = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: messageHistory,
            stream: true
        });

        return stream;
    }

    const generateCompletion = async (messageHistory) => {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: messageHistory
        });

        return completion.choices[0].message.content;
    }

    const generateAudioBuffer = async (text) => {
        try {
            const response = await openai.audio.speech.create({
                model: "tts-1",
                voice: "echo",
                input: text,
                response_format: "wav"
            })

            const arrayBuffer = await response.arrayBuffer();
            return arrayBuffer;
        }
        catch (error){
            console.error('Error fetching text-to-speech data:', error);
            throw error;
        }
    }

    return (
        <AIContext.Provider value={{
            openai,
            fetchStreamedResponse,
            generateCompletion,
            generateAudioBuffer
        }}>
            {children}
        </AIContext.Provider>
    );
};