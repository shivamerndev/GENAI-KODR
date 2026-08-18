import { useDispatch } from "react-redux";
import { deleteChats, getAiResponse, getChats, getMessages, renameChat } from "../services/chat.service";
import { appendAiChunks, appendMessages, appendNewChats, setChats, setMessages, setNewChat, setTempChat } from "../store/features/chat.slice";
import { useNavigate } from "react-router-dom"

const useChat = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleCleanUp = () => {
        dispatch(setNewChat(false))
        dispatch(setMessages([]))
    }

    const handleAiResponse = (input, chatId, fileId, fileName) => {

        if (!chatId) {
            dispatch(setNewChat(true))
        }

        dispatch(appendMessages([{
            role: "user",
            content: input,
            chatId,
            fileId,
            fileName,
        }, {
            role: "AI",
            content: "",
            chatId,
        }]))


        getAiResponse(input, chatId, fileId, fileName,
            (chunk) => {
                dispatch(appendAiChunks(chunk))
            },
            (title) => {
                dispatch(appendNewChats(title))
                navigate("/c/" + title.chatId, { replace: true })
            },
            () => {
                dispatch(setNewChat(false))
            }
        )

    }

    const handleSetTempChat = () => {
        dispatch(setTempChat())
    }

    const handleTempAiResponse = (input, temp) => {

        dispatch(appendMessages([{
            role: "user",
            content: input,
        }, {
            role: "AI",
            content: "",
        }]))

        getTempAiResponse(input, temp, (chunk) => {
            dispatch(appendAiChunks(chunk))
        })
    }

    const handleGetChats = async () => {
        let { data } = await getChats()
        dispatch(setChats(data.chats))
    }

    const handleDeleteChat = async (chatId) => {

        await deleteChats(chatId)
        handleGetChats()
        navigate("/")
    }

    const handleGetMessages = async (chatId) => {
        let { data } = await getMessages(chatId)
        dispatch(setMessages(data.messages))
    }


    const handleRenameChat = async (chatId, title) => {
        await renameChat(chatId, title)
        await handleGetChats()
    }

    return { handleAiResponse, handleTempAiResponse, handleGetChats, handleGetMessages, handleCleanUp, handleDeleteChat, handleRenameChat }
}

export default useChat;