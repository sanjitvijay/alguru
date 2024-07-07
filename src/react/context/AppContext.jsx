import React, { createContext, useState } from 'react';
import { useAIContext } from './AIContext';
// Create a new context
const AppContext = createContext();
export const useAppContext = () => React.useContext(AppContext);

// Create a context provider component
export const AppContextProvider = ({ children }) => {
    // Define your state variables here
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("");
    const [question, setQuestion] = useState("");

    const { openai } = useAIContext();
    const [hint, setHint] = useState(); 
    const [responseCode, setResponseCode] = useState(null);
    // Define any functions or methods you need
    const getProblemInfo = async () => {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: function () {
                let selectors = {
                    title: "div > div.flex.w-full.flex-1.flex-col.gap-4.overflow-y-auto.px-4.py-5 > div.flex.items-start.justify-between.gap-4 > div",
                    description: "div > div.flex.w-full.flex-1.flex-col.gap-4.overflow-y-auto.px-4.py-5 > div.elfjS",
                    code: "div.flex.flex-1.flex-col.overflow-hidden.pb-2 > div.flex-1.overflow-hidden > div > div > div.overflow-guard > div.monaco-scrollable-element.editor-scrollable.vs-dark.mac > div.lines-content.monaco-editor-background > div.view-lines.monaco-mouse-cursor-text",
                    language:"div.flex.h-8.items-center.justify-between.border-b.p-1.border-border-quaternary.dark\\:border-border-quaternary > div.flex.flex-nowrap.items-center > div:nth-child(1)"
                };

                let title = document.querySelector(selectors.title).textContent;
                let description = document.querySelector(selectors.description).textContent;
                let code = document.querySelector(selectors.code).innerText;
                let language = document.querySelector(selectors.language).innerText;

                return { title, description, code, language };
            },
        }, (results) => {
            // results[0].result contains the returned object from the injected function
            setTitle(results[0].result.title);
            setDescription(results[0].result.description);
            setCode(results[0].result.code);

            if(results[0].result.language.toLowerCase() === 'c++'){
                setLanguage('cpp');
            }
            else{
                setLanguage(results[0].result.language.toLowerCase());
            }

            console.log(results[0].result.code);
        });
    }

    const instructions =
    `You are a coding tutor who is an expert at leetcode 
    problems and data structures and algorithms. 
    Act as a computer software: give me only the requested output, no conversation
    You are helping a student solve a leetcode problem. 
    Guide the student through the problem and only provide code if necessary. 
    Format the response in markdown and use
    elements like lists, headers, and tables to make it look like a chat.
    Use $ and $$ delimiters for math equations. 
    `
    const [chatHistory, setChatHistory] = useState([
        {
            role: 'system',
            content: instructions
        }
    ])


    async function askQuestion() {
        chatHistory.push({
            role: 'user',
            content: `
            I am solving ${title}, here is the description: ${description}. 
            
            This is my code so far using ${language}: ${code} (note: it may be incomplete)

            Please answer this question: ${question}
            `
        });

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-0125',
            response_format: { "type": "text" },
            messages: chatHistory
        })

        chatHistory.push({role: 'system', content: response.choices[0].message.content})
        console.log(response.choices[0].message.content)
        setHint(response.choices[0].message.content)
    }


    // Return the context provider with the state and functions/methods
    return (
        <AppContext.Provider value=
        {{ 
            title, setTitle, 
            description, setDescription, 
            code, setCode, 
            language, setLanguage, 
            question, setQuestion,
            hint, setHint,
            responseCode, setResponseCode,
            askQuestion,
            getProblemInfo
        }}>
            {children}
        </AppContext.Provider>
    );
};