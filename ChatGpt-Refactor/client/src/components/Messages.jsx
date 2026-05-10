import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import useChat from '../hooks/useChat.js'
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Messages = ({ chatId }) => {

    const messages = useSelector(state => state.chat.messages)
    const { handleGetMessages, handleCleanUp } = useChat()


    useEffect(() => {

        if (chatId) {
            handleGetMessages(chatId)
        } else {
            handleCleanUp()
        }

        // return () => {
        //     handleCleanUp()
        // }

    }, [chatId])

    return (
        <div className='flex  no-scrollbar flex-col p-4 gap-8 h-full overflow-y-auto'>
            {messages.map((message, index) => (
                <p key={index} className={' py-1 px-4 ' + (message.role === "user" ? "ml-auto   rounded-full bg-zinc-800" : "mr-auto ")}> <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown></p>
            ))}
        </div>
    )
}

export default Messages