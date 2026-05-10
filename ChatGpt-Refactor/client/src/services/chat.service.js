import axiosUtils from "../utils/axios.utils"

export const getAiResponse = async (input, chatId, temp, getChunks, getTitleData) => {

    const res = await fetch("/api/chats", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ input, chatId, temp })
    })


    const decoder = new TextDecoder()

    for await (const chunk of res.body) {

        const text = decoder.decode(chunk)

        const lines = text.split("\n\n").forEach(e => {

            if (e.startsWith("chunk:")) {
                let data = JSON.parse(e.replace("chunk: ", "")).text
                getChunks(data)
            }

            if (e.startsWith("title:")) {
                let data = JSON.parse(e.replace("title: ", ""))
                getTitleData(data)
            }
        })
    }
}

export const getChats = () => axiosUtils.get("/chats")

export const saveMessages = (data) => axiosUtils.post("/chats/messages", data)

export const getMessages = (chatId) => axiosUtils.get("/chats/chat/" + chatId)