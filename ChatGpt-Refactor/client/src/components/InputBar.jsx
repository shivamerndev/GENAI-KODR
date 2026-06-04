import React from 'react'
import useChat from '../hooks/useChat'

const InputBar = ({ chatId }) => {

    const { handleAiResponse } = useChat()


    const handleSubmit = (e) => {
        e.preventDefault()
        let form = new FormData(e.target)
        let { input } = Object.fromEntries(form)
        if (!input.trim()) {
            return
        }
        handleAiResponse(input, chatId)
        e.target.reset()
    }

    return (
        <div className='w-full max-w-4xl mx-auto p-4 md:p-6'>
            <form onSubmit={handleSubmit} className='relative flex items-center w-full'>
                <input 
                    name='input' 
                    className='w-full bg-zinc-800/50 border border-zinc-700/50 focus:border-zinc-500 focus:bg-zinc-800 text-white placeholder-zinc-400 px-6 py-4 rounded-2xl outline-none shadow-sm transition-all duration-200 ease-in-out text-base' 
                    type="text" 
                    placeholder='Message AI...' 
                    autoComplete="off"
                />
                <button 
                    type="submit" 
                    className='absolute right-3 p-2 rounded-xl bg-white text-black hover:bg-zinc-200 transition-colors'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z" clipRule="evenodd" />
                    </svg>
                </button>
            </form>
        </div>
    )
}

export default InputBar