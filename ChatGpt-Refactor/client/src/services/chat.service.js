import axiosUtils from "../utils/axios.utils"

export const uploadPdfFile = async (file, chatId) => {
    const formData = new FormData();
    formData.append("file", file);
    if (chatId) {
        formData.append("chatId", chatId);
    }

    const response = await axiosUtils.post("/chats/upload-pdf", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};

export const getAiResponse = async (input, chatId, fileId, fileName, getChunks, getTitleData, onComplete) => {

    const res = await fetch("/api/chats", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ input, chatId, fileId, fileName })
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

    onComplete()
}

export const getTempAiResponse = async (input, temp, fileId, getChunks) => {

    const res = await fetch("/api/chats/temp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ input, temp, fileId })
    })

    const decoder = new TextDecoder()
    let buffer = ""

    for await (const chunk of res.body) {
        buffer += decoder.decode(chunk, { stream: true })
        const lines = buffer.split("\n\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
            if (line.startsWith("chunk:")) {
                try {
                    let data = JSON.parse(line.replace("chunk: ", "")).text
                    getChunks(data)
                } catch (err) {
                    console.error("Error parsing chunk:", err)
                }
            }
        }
    }
}

export const getChats = () => axiosUtils.get("/chats")

export const deleteChats = (chatId) => axiosUtils.delete("/chats/chat", { data: { chatId } })

export const renameChat = (chatId, title) => axiosUtils.patch("/chats/chat", { chatId, title })

export const saveMessages = (data) => axiosUtils.post("/chats/messages", data)

export const getMessages = (chatId) => axiosUtils.get("/chats/chat/" + chatId)