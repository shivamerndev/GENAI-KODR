import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import useChat from '../hooks/useChat.js'
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";
import { Bot } from 'lucide-react'

const Messages = ({ chatId }) => {

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
        <div className='flex no-scrollbar flex-col w-3/4 h-full overflow-y-auto px-4 py-6 gap-6  '>
            {messages.map((message, index) =>
                message.role === 'user' ? (
                    <div key={index} className='flex justify-end'>
                        <div className='max-w-[75%] bg-zinc-800 text-zinc-100 rounded-2xl rounded-br-sm px-4 py-2.5 text-base leading-relaxed shadow-sm'>
                            {message.content}
                        </div>
                    </div>
                ) : (
                    <div key={index} className='flex items-start gap-3 max-w-[85%]'>
                        <div className='shrink-0 w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mt-0.5'>
                            <Bot className='w-4.5 h-4.5 text-emerald-400' />
                        </div>
                      <div className='w-full text-base leading-relaxed text-zinc-200
                          [&>p]:mb-4 [&>p:last-child]:mb-0
                          [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ul]:space-y-1
                          [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>ol]:space-y-1
                          [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:mt-6 [&>h1]:text-white
                          [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:mt-5 [&>h2]:text-white
                          [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mb-3 [&>h3]:mt-4 [&>h3]:text-white
                          [&>pre]:bg-[#1e1e2e] [&>pre]:p-4 [&>pre]:rounded-xl [&>pre]:overflow-x-auto [&>pre]:mb-4 [&>pre]:border [&>pre]:border-zinc-700/50 [&>pre]:shadow-sm
                          [&_code]:font-mono [&_code]:text-sm 
                          [&:not(pre)>code]:bg-zinc-800/80 [&:not(pre)>code]:px-1.5 [&:not(pre)>code]:py-0.5 [&:not(pre)>code]:rounded-md [&:not(pre)>code]:text-emerald-300 [&:not(pre)>code]:border [&:not(pre)>code]:border-zinc-700/50
                          [&>blockquote]:border-l-4 [&>blockquote]:border-emerald-500/50 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-zinc-400 [&>blockquote]:mb-4 [&>blockquote]:bg-emerald-500/5 [&>blockquote]:py-2 [&>blockquote]:pr-4 [&>blockquote]:rounded-r-lg
                          [&>a]:text-emerald-400 [&>a]:underline [&>a]:underline-offset-4 hover:[&>a]:text-emerald-300 [&>a]:transition-colors
                          [&_table]:w-full [&_table]:mb-4 [&_table]:border-collapse
                          [&_th]:border [&_th]:border-zinc-700 [&_th]:px-4 [&_th]:py-2 [&_th]:bg-zinc-800/50 [&_th]:text-left
                          [&_td]:border [&_td]:border-zinc-700 [&_td]:px-4 [&_td]:py-2
                      '>
                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkEmoji]}>{message.content}</ReactMarkdown>
                        </div>
                    </div>
                )
            )}
            <div ref={bottomRef} />
        </div>
    )
}

export default Messages