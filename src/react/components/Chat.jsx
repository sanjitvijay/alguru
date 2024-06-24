import React from 'react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import ts from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAIContext } from '../context/AIContext';

SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('c', c);
SyntaxHighlighter.registerLanguage('c++', cpp);
SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('typescript', ts);

function Chat() {
    const { openai } = useAIContext();

    const code =
        `useEffect(() => {
    const fetchUserInfo = async () => {
        setLoading(true);
        //const { data: { user } } = await supabase.auth.getUser();
        if(user){
            const { data, error } = await supabase
            .from('users')
            .select('dailyValues')
            .eq('id', user.id)
            if (error) {
                console.log('Error:', error);
            } else {
                setUserInfo(data[0].dailyValues);
            }
        }
        setLoading(false);
    };


    fetchUserInfo();
}, [supabase, location]);`

    async function askQuestion() {
        const assistant = await openai.beta.assistants.create({
            name: "LeetCode Assistant",
            instructions: "You are a coding tutor who is an expert at leetcode problems and data structures and algorithms. You are helping a student solve a leetcode problem. Do not provide the full solution, but guide the student through the problem unless explicitly asked for the solution.",
            tools: [{ type: "code_interpreter" }],
            model: "gpt-3.5-turbo-0125"
        })

        const thread = await openai.beta.threads.create();
        const message = await openai.beta.threads.messages.create(
            thread.id,
            {
                role: "user",
                content: "Give me a hint for leetcode 826"
            }
        )

        let run = await openai.beta.threads.runs.createAndPoll(
            thread.id,
            {
                assistant_id: assistant.id,
            }
        );

        if (run.status === 'completed') {
            const messages = await openai.beta.threads.messages.list(
                run.thread_id
            );
            for (const message of messages.data.reverse()) {
                console.log(`${message.role} > ${message.content[0].text.value}`);
            }
        } else {
            console.log(run.status);
        }
    }

    return (
        <div>
            <SyntaxHighlighter
                language='javascript'
                style={oneDark}
            >
                {code}
            </SyntaxHighlighter>
            <button onClick={askQuestion}>Ask Question</button>
        </div>
    )
}

export default Chat