import { useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import ts from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAIContext } from '../context/AIContext';
import { useAppContext } from '../context/AppContext';

SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('c', c);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('typescript', ts);

function Chat() {
    const {title, description, code, language, setCode} = useAppContext(); 
    const { openai } = useAIContext();
    
    const instructions =
    `You are a coding tutor who is an expert at leetcode 
    problems and data structures and algorithms. 
    Act as a computer software: give me only the requested output, no conversation
    You are helping a student solve a leetcode problem. 
    Do not provide any code, but guide the student through the 
    problem unless explicitly asked for the code.
    If asked for the code, provide the code in C++.
    Respond in JSON format with one column named "hint" that contains the response, 
    and one column named "code" if the user asks for the code.
    `

    async function askQuestion() {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-0125',
            response_format: {"type": "json_object"},
            messages: [
                {
                    role: 'system',
                    content: instructions
                },
                {
                    role: 'user',
                    content: 'How do I solve the two sum leetcode problem, show me the code'
                }
            ]
        })

        const JSONResponse = JSON.parse(response.choices[0].message.content)
        console.log(JSONResponse)
        setCode(JSONResponse.code)
    }

    return (
        <div>
            <SyntaxHighlighter
                language='cpp'
                style={oneDark}
            >
                {code}
            </SyntaxHighlighter>
            <button onClick={askQuestion}>Ask Question</button>
        </div>
    )
}

export default Chat