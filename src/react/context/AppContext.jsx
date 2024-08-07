import React, {createContext, useEffect, useRef, useState} from 'react';
import { useAIContext } from './AIContext';

const AppContext = createContext();
export const useAppContext = () => React.useContext(AppContext);


export const AppContextProvider = ({ children }) => {
    const { fetchStreamedResponse } = useAIContext();
    const [audio, setAudio] = useState(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("");
    const [question, setQuestion] = useState("");

    const [isChat, setIsChat] = useState(true);

    const [chatUsage, setChatUsage] = useState(0);
    const [voiceUsage, setVoiceUsage] = useState(0);

    const [isChatAvailable, setIsChatAvailable] = useState(true);
    const [isVoiceAvailable, setIsVoiceAvailable] = useState(true);

    const cooldownHours = 12;
    const maxChatUsage = 15;
    const maxVoiceUsage = 8;
    
    const [chatUnlockTime, setChatUnlockTime] = useState(null);
    const [voiceUnlockTime, setVoiceUnlockTime] = useState(null);

    const instructions =
        `You are a coding tutor who is an expert at leetcode 
    problems and data structures and algorithms. You are helping a student solve a leetcode problem to prepare
    for a coding interview. Guide the student through the problem and only provide code if necessary. 
    Format the response in github flavored markdown and use
    elements like lists, headers, and tables to make it look like a chat.
    
    Use latex for all math expressions and big-O notation, surround all latex expressions with $ delimiters.
    
    Only answer the latest question asked by the student, the other questions are
    previously asked questions provided for context. 
    `

    const initialMessageHistory = [
        {
            role: 'system',
            content: instructions
        },
        {
            role: 'user',
            content: `
                I am solving Leetcode ${title}
            `
        }
    ]

    const [messageHistory, setMessageHistory] = useState(initialMessageHistory);

    const [chatHistory, setChatHistory] = useState([]);
    const [response, setResponse] = useState('');
    const responseRef = useRef("");

    const resetHistory = () => {
        setMessageHistory(initialMessageHistory);
        setChatHistory([]);
        chrome.storage.session.set({messageHistory: initialMessageHistory});
        chrome.storage.session.set({chatHistory: []});
    }

    const getProblemInfo = async () => {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: function () {
                let selectors = {
                    title: "div > div.flex.w-full.flex-1.flex-col.gap-4.overflow-y-auto.px-4.py-5 > div.flex.items-start.justify-between.gap-4 > div.flex.items-start.gap-2 > div > a",
                    description: "div > div.flex.w-full.flex-1.flex-col.gap-4.overflow-y-auto.px-4.py-5 > div.elfjS",
                    code: "div.flex.flex-1.flex-col.overflow-hidden.pb-2 > div.flex-1.overflow-hidden > div > div > div.overflow-guard > div.monaco-scrollable-element.editor-scrollable > div.lines-content.monaco-editor-background > div.view-lines.monaco-mouse-cursor-text",
                    language:"div.flex.h-8.items-center.justify-between.border-b.p-1.border-border-quaternary.dark\\:border-border-quaternary > div.flex.flex-nowrap.items-center > div:nth-child(1)"
                };

                let title = document.querySelector(selectors.title).textContent;
                let description = document.querySelector(selectors.description).textContent;
                let code = document.querySelector(selectors.code).innerText;
                let language = document.querySelector(selectors.language).innerText;

                return { title, description, code, language };
            },
        }, async (results) => {
            // results[0].result contains the returned object from the injected function
            console.log(results);
            setTitle(results[0].result.title);
            setDescription(results[0].result.description);
            setCode(results[0].result.code);

            if(results[0].result.language.toLowerCase() === 'c++'){
                setLanguage('cpp');
            }
            else{
                setLanguage(results[0].result.language.toLowerCase());
            }

            const storedProblem = await chrome.storage.session.get('problem');
            if(storedProblem.problem !== results[0].result.title){
                await chrome.storage.session.clear();
                chrome.storage.session.set({messageHistory: initialMessageHistory});
                chrome.storage.session.set({chatHistory: []});
                setMessageHistory(initialMessageHistory);
                setChatHistory([]);
                chrome.storage.session.set({problem: results[0].result.title});
            }
            else{
                const savedMessages = await chrome.storage.session.get(['chatHistory', 'messageHistory']);
                savedMessages.chatHistory ? setChatHistory(savedMessages.chatHistory) : setChatHistory([]);
                savedMessages.messageHistory ? setMessageHistory(savedMessages.messageHistory) : setMessageHistory(initialMessageHistory);
            }
        });
    }

    const createMessages = () => {
        if(messageHistory.length > 6){
            const relevantMessages = messageHistory.slice(-6);
            return [...initialMessageHistory, ...relevantMessages];
        }
        else return messageHistory;
    }

    const askQuestion = async () => {
        messageHistory.push(
            {
                role: 'user',
                content: `
                This is my code so far using ${language}: ${code} (note: it may be incomplete)
                
                Please answer this question: ${question}
                `
            }
        );

        chatHistory.push(
            {
                role: 'user',
                content: question
            }
        );

        const relevantMessages = createMessages();

        const stream = await fetchStreamedResponse(relevantMessages);

        chatHistory.push(
            {
                role: 'system',
                content: response
            }
        );

        for await (const chunk of stream){
            responseRef.current = responseRef.current + (chunk.choices[0]?.delta?.content || "");
            chatHistory[chatHistory.length - 1].content = responseRef.current;
            setChatHistory([...chatHistory])
            setResponse(responseRef.current);
        }

        messageHistory.push(
            {
                role: 'system',
                content: response
            }
        );

        chrome.storage.session.set({messageHistory});
        chrome.storage.session.set({chatHistory});

        setMessageHistory([...messageHistory])
        setChatHistory([...chatHistory]);

        responseRef.current = "";
        setResponse("");

        incrementChatUsage();
    }

    const toggleMode = () => {
        setIsChat(!isChat);
        setAudio(null);
    }

    const setUsageCounts = async () => {
        const result = await chrome.storage.sync.get(['chatUsage', 'voiceUsage', 'chatExpired', 'voiceExpired']);

        result.chatExpired && setChatUnlockTime(result.chatExpired + (cooldownHours * 60 * 60 * 1000));
        result.voiceExpired && setVoiceUnlockTime(result.voiceExpired + (cooldownHours * 60 * 60 * 1000));
        
        const chatElapsedTime = (new Date().getTime() - result.chatExpired) / (1000 * 60 * 60);
        const voiceElapsedTime = (new Date().getTime() - result.voiceExpired) / (1000 * 60 * 60);

        if(!result.chatUsage || chatElapsedTime >= cooldownHours) {
            await chrome.storage.sync.set({chatUsage: 0});
            setChatUsage(0);
        }
        else{
            setChatUsage(result.chatUsage);
        }

        if(!result.voiceUsage || voiceElapsedTime >= cooldownHours) {
            await chrome.storage.sync.set({voiceUsage: 0});
            setVoiceUsage(0);
        }
        else {
            setVoiceUsage(result.voiceUsage);
        }

        await checkUsage(chatUsage, voiceUsage);
    }

    const incrementChatUsage = async () => {
        setChatUsage(chatUsage + 1);
        await chrome.storage.sync.set({chatUsage: chatUsage + 1});

        if(chatUsage + 1 >= maxChatUsage) {
            const currentTime = new Date().getTime()
            setChatUnlockTime(currentTime + (cooldownHours * 60 * 60 * 1000));
            await chrome.storage.sync.set({chatExpired: currentTime})
        }
    }

    const incrementVoiceUsage = async () => {
        setVoiceUsage(voiceUsage + 1);
        await chrome.storage.sync.set({voiceUsage: voiceUsage + 1});

        if(voiceUsage + 1 >= maxVoiceUsage){
            const currentTime = new Date().getTime()
            setVoiceUnlockTime(currentTime + (cooldownHours * 60 * 60 * 1000));
            await chrome.storage.sync.set({voiceExpired: currentTime})
        }
    }

    const checkUsage = async (currentChatUsage, currentVoiceUsage) => {
        if(isChat){
            if(currentChatUsage >= maxChatUsage){
                const modal = document.getElementById('chat_usage_limit_modal');
                modal.showModal();
                setIsChatAvailable(false);
            }
        }
        else{
            if(currentVoiceUsage >= maxVoiceUsage){
                const modal = document.getElementById('voice_usage_limit_modal');
                modal.showModal();
                setIsVoiceAvailable(false);
            }
        }
    }

    const isValidPage = () => {
        return !!(title && code);
    }

    useEffect(() => {
        checkUsage(chatUsage, voiceUsage);
    }, [chatUsage, voiceUsage, isChat]);



    return (
        <AppContext.Provider value=
        {{ 
            title, setTitle, 
            description, setDescription, 
            code, setCode, 
            language, setLanguage, 
            question, setQuestion,
            messageHistory, setMessageHistory,
            chatHistory, setChatHistory,
            audio, setAudio,
            isChat, toggleMode,
            askQuestion,
            getProblemInfo,
            resetHistory,
            setUsageCounts, incrementChatUsage, incrementVoiceUsage, checkUsage,
            isChatAvailable, isVoiceAvailable,
            chatUnlockTime, voiceUnlockTime,
            isValidPage
        }}>
            {children}
        </AppContext.Provider>
    );
};