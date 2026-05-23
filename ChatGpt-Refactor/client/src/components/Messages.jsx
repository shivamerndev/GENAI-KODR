import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import useChat from '../hooks/useChat.js'
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot } from 'lucide-react'

const Messages = ({ chatId, temp, setQuery, setTemp }) => {

    const messages = useSelector(state => state.chat.messages)
    const isNewChat = useSelector(state => state.chat.newChat)

    const { handleGetMessages, handleCleanUp } = useChat()
    const bottomRef = useRef(null)

    useEffect(() => {

        if (isNewChat) {
            return;
        }

        if (chatId) {
            handleGetMessages(chatId)
        } else {
            handleCleanUp()
        }
    }, [chatId, isNewChat])


    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])


    return (
        <div className='flex flex-col w-full h-full overflow-y-auto px-4 py-6 gap-6'>
            {messages.map((message, index) =>
                message.role === 'user' ? (
                    <div key={index} className='flex justify-end'>
                        <div className='max-w-[75%] bg-zinc-800 text-zinc-100 rounded-2xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed shadow-sm'>
                            {message.content}
                        </div>
                    </div>
                ) : (
                    <div key={index} className='flex items-start gap-3 max-w-[85%]'>
                        <div className='shrink-0 w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mt-0.5'>
                            <Bot className='w-3.5 h-3.5 text-emerald-400' />
                        </div>
                        <div className='text-sm text-zinc-200 leading-relaxed prose prose-invert prose-sm max-w-none
                            prose-p:my-1 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-lg
                            prose-code:text-emerald-400 prose-code:bg-zinc-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                            prose-headings:text-zinc-100 prose-strong:text-zinc-100 prose-a:text-emerald-400'>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                        </div>
                    </div>
                )
            )}
            <div ref={bottomRef} />
        </div>
    )
}

export default Messages