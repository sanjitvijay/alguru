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
    const availableLanguages = ['java', 'python', 'c', 'cpp', 'javascript', 'typescript'];
    const { 
        language, 
        hint,
        responseCode,
    } = useAppContext();
    
    return (
        <div className='z-0'>
            {hint && 
                <div className='card w-full bg-slate-700 p-3'>
                    {hint}
                </div>
            }

            {responseCode && 
                <SyntaxHighlighter
                    language={availableLanguages.includes(language) ? language : 'cpp'}
                    style={oneDark}
                >
                    {responseCode}
                </SyntaxHighlighter>
            }
        </div>
    )
}

export default Chat