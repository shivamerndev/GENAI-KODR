import { useDispatch, useSelector } from "react-redux";
import { getAiResponse, getChats, getMessages, saveMessages } from "../services/chat.service";
import { appendAiChunks, appendMessages, appendNewChats, setChats, setMessages } from "../store/features/chat.slice";
import { useNavigate } from "react-router-dom"

const useChat = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const messages = useSelector(state => state.chat.messages)

    const handleCleanUp = () => {
        dispatch(setMessages([]))
    }

    const handleAiResponse = (input, chatId , temp) => {

        if (!chatId) {
            dispatch(appendMessages([{
                role: "user",
                content: input,
                chatId,
            }, {
                role: "AI",
                content: "",
                chatId,
            }]))
        }

        getAiResponse(input, chatId,temp, (chunk) => {
            dispatch(appendAiChunks(chunk))
        }, (title) => {
            navigate("/c/" + title.chatId)
            dispatch(appendNewChats(title))
        })
    }

    const handleGetChats = async () => {
        let { data } = await getChats()
        dispatch(setChats(data.chats))
    }

    const handleGetMessages = async (chatId) => {

        let { data } = await getMessages(chatId)

        dispatch(setMessages(data.messages))
        console.log(data.messages, messages)
    }

    return { handleAiResponse, handleGetChats, handleGetMessages, handleCleanUp }
}

export default useChat;