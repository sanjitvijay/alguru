import React, { createContext, useEffect, useState } from 'react';
import OpenAI from 'openai';

// Create a new context
const AIContext = createContext();
export const useAIContext = () => React.useContext(AIContext);
// Create a provider component
export const AIProvider = ({ children }) => {
    // Define your state variables here
    const API_KEY = process.env.REACT_APP_OPENAI_API_KEY; 
    const openai = new OpenAI({
        apiKey: API_KEY,
        dangerouslyAllowBrowser: true
    })

    // Return the context provider with the state and functions
    return (
        <AIContext.Provider value={{ openai }}>
            {children}
        </AIContext.Provider>
    );
};