import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import useChat from '../hooks/useChat.js'
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CheckIcon, MessageCircle, MessageCircleDashed } from 'lucide-react'

const Messages = ({ chatId, temp, setQuery, setTemp }) => {

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
        <>
            {
                messages.length > 0 ? <div className='flex  no-scrollbar flex-col p-4 gap-8 h-full overflow-y-auto'>
                    {messages.map((message, index) => (<p key={index} className={' py-1 px-4 ' + (message.role === "user" ? "ml-auto   rounded-full bg-zinc-800" : "mr-auto ")}> <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown></p>))}
                </div >
                    : <div className='flex flex-col justify-center h-full text-3xl items-center gap-4 mt-20'>
                        <h1>  {temp ? "Temporary Chat" : "Start A New Chat"}</h1>
                        {temp && <p className='text-base'>This chat won’t appear in your chat history, and won’t be used to train our models.</p>}

                        <button onClick={() => {
                            if (temp) {
                                setQuery({})
                            } else {
                                setQuery({ temp: "true" })
                            }
                            setTemp(!temp)
                        }} className="absolute cursor-pointer top-1 right-4 rotate-270 p-2 rounded-full">
                            <MessageCircleDashed />
                            {temp && <CheckIcon className='rotate-90 w-3 absolute top-2 right-3.5' />}
                        </button>
                    </div>
            }
        </>
    )
}

export default Messages