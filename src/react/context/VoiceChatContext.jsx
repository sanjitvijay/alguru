import React, { createContext, useEffect, useState } from 'react';
import { useAIContext } from './AIContext';
import speech, {useSpeechRecognition} from "react-speech-recognition";
import {useAppContext} from "./AppContext.jsx";

const VoiceChatContext = createContext();
export const useVoiceChatContext = () => React.useContext(VoiceChatContext);

export const VoiceChatProvider = ({ children }) => {
    const {
        listening,
        transcript,
    } = useSpeechRecognition();

    const {generateCompletion, generateAudioBuffer} = useAIContext();
    const {title, code, language, audio, setAudio} = useAppContext();

    const [thinking, setThinking] = useState(false);
    const [responseText, setResponseText] = useState('');

    const instructions =
        `You are a voice chatbot helping a student solve a leetcode problem to prepare for a coding interview.
            Act like a coding interviewer who is interviewing a student, only provide hints if necessary.
            The student will be talking with you, so respond like you are talking with the student and do not use special characters.
            Respond in 200 characters or less. 
            Only answer the latest question asked by the student, the other questions are
            previously asked questions provided for context. 
            `

    const initialMessageHistory = [
        {role: "system", content: instructions},
        {role: "user",
        content: `
            I am solving Leetcode ${title}
            `
        }
    ];
    const [messageHistory, setMessageHistory] = useState(initialMessageHistory);

    useEffect(() => {
        playGeneratedResponse();
    }, [transcript, listening]);

    const generateAudio = async (text) => {
        try {
            const audioData = await generateAudioBuffer(text);
            const audioBlob = new Blob([audioData], { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            console.log(audioUrl)
            setAudio(audioUrl);
        } catch (error) {
            console.error('Error generating speech:', error);
        }
    }

    const onStartListening = async () => {
        await speech.startListening();
    }

    const onStopListening = async () => {
        await speech.stopListening();
    }

    const createMessages = () => {
        if(messageHistory.length > 6){
            const relevantMessages = messageHistory.slice(-6);
            return [...initialMessageHistory, ...relevantMessages];
        }
        else return messageHistory;
    }

    const getAudioResponse =  async (question) => {
        messageHistory.push(
            {
                role: 'user',
                content: `
                This is my code so far using ${language}: ${code} (note: it may be incomplete)
                
                Please answer this question: ${question}
                `
            }
        );

        const relevantMessages = createMessages();
        const completion = await generateCompletion(relevantMessages);
        messageHistory.push({role: 'system', content: completion})
        return completion
    }

    const playGeneratedResponse = async () => {
        if(!listening && transcript){
            setThinking(true)
            const response = await getAudioResponse(transcript);
            setResponseText(response);
            await generateAudio(response);
            setThinking(false)
        }
    }

    return (
        <VoiceChatContext.Provider value={{
            audio, setAudio,
            thinking,
            responseText, setResponseText,
            generateAudio,
            onStartListening, onStopListening
        }}>
            {children}
        </VoiceChatContext.Provider>
    );
};