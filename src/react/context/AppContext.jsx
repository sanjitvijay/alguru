import React, { createContext, useState } from 'react';

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
                    language:"#headlessui-popover-button-\\:r1f\\: > div > button"
                };

                let title = document.querySelector(selectors.title).textContent;
                let description = document.querySelector(selectors.description).textContent;
                let codeHTML = document.querySelector(selectors.code).innerText;
                let language = document.querySelector(selectors.language).innerText;

                let code = "";
                let codeLines = codeHTML.split("<br>");
                codeLines.forEach(line => {
                    let lineText = line.replace(/<[^>]*>?/gm, '');
                    code += lineText + "\n";
                });

                return { title, description, code, language };
            },
        }, (results) => {
            // results[0].result contains the returned object from the injected function
            setTitle(results[0].result.title);
            setDescription(results[0].result.description);
            setCode(results[0].result.code);
            setLanguage(results[0].result.language);
            //setLanguage(results[0].result.language);
            
        });
    }

    // Return the context provider with the state and functions/methods
    return (
        <AppContext.Provider value=
        {{ 
            title, setTitle, 
            description, setDescription, 
            code, setCode, 
            language, setLanguage, 
            getProblemInfo
        }}>
            {children}
        </AppContext.Provider>
    );
};