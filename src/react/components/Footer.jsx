import { useEffect, useState } from "react"
import { BsArrowUpCircleFill } from "react-icons/bs";
import { useRef } from "react";

function Footer() {
    const textareaRef = useRef();
    const [prompt, setPrompt] = useState('')
    const placeholders = 
        ['Give me a hint', 
        'Determine the time complexity of my solution',
        'What topics does this problem cover',
        'Show me the solution'];
    
    const [placeholder, setPlaceholder] = useState(placeholders[0]);
    let placeholderCounter = 1;

    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholder(placeholders[placeholderCounter]);
            placeholderCounter = (placeholderCounter + 1) % placeholders.length;
        }, 5000);
        return () => clearInterval(interval);
    }, [])
    
    const onChange = (e) => {
        setPrompt(e.target.value);
    }

    const onSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div className="btm-nav px-5 mb-2">
            <form>
            <div class="w-full rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px]">
                <div class="flex h-10 w-full items-center justify-center bg-base-100 back rounded-[5px]">
                <input
                        ref={textareaRef}
                        placeholder={placeholder}
                        className='w-full bg-transparent text-white text-lg px-3 focus:outline-none focus:ring-0 focus:border-gray-800 border-none h'
                        onChange={onChange}
                    />
                    <button
                        type="submit"
                        className='py-5 mr-3'
                        onClick={onSubmit}
                    >
                        <BsArrowUpCircleFill
                            size={30}
                            color={prompt.length === 0 ? 'grey' : '#EC4899'}
                        />
                    </button>
                </div>
            </div>
                    
                
            </form>
        </div>
    )
}

export default Footer