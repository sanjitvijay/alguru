import React, { createContext, useEffect, useState } from 'react';
import OpenAI from 'openai';
import Anthropic from "@anthropic-ai/sdk";

// Create a new context
const AIContext = createContext();
export const useAIContext = () => React.useContext(AIContext);
// Create a provider component
export const AIProvider = ({ children }) => {
    // Define your state variables here
    const API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;
    const anthropic = new Anthropic({
        apiKey: API_KEY,
        dangerouslyAllowBrowser: true
    })

    // Return the context provider with the state and functions
    return (
        <AIContext.Provider value={{ anthropic }}>
            {children}
        </AIContext.Provider>
    );
};