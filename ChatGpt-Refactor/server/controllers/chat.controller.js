import * as chatDao from "../dao/chat.dao.js";
import { getAIResponse, getTitle } from "../services/ai.service.js";


const generateTitle = async (userInput, userId, res) => {

    const { chatTitle } = await (await getTitle(userInput)).structuredResponse

    const chat = await chatDao.createChat({ title: chatTitle, user: userId })

    res.write(`title: ${JSON.stringify({ title: chatTitle, chatId: chat._id })}\n\n`)

    return chat
}

export const handleMessage = async (req, res) => {

    const { input: userInput, chatId } = req.body;

    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")

    try {

        let title = ""
        if (!chatId) {
            title = await generateTitle(userInput, req.userId, res)
        }
        await chatDao.saveMessages({
            chatId: title._id || chatId,
            content: userInput,
            role: "user"
        })

        const stream = await getAIResponse(userInput)

        let AIMessage = ""

        for await (const chunk of stream) {

            AIMessage += chunk[0].contentBlocks[0].text;

            res.write(`chunk: ${JSON.stringify({ text: AIMessage })}\n\n`);
        }

        await chatDao.saveMessages({
            chatId: chatId || title._id,
            content: AIMessage,
            role: "ai"
        })

        res.end()
    } catch (err) {
        console.log(err.message)
    }
}

export const handleTempMessage = async (req, res) => {

    const { input: userInput } = req.body;

    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")

    try {

        const stream = await getAIResponse(userInput)

        for await (const chunk of stream) {
            res.write(`chunk: ${JSON.stringify({ text: chunk[0].contentBlocks[0].text })}\n\n`);
        }
        res.end()

    } catch (err) {
        console.log(err.message)
    }
}

export const getChatTitles = async (req, res) => {

    const data = await chatDao.getChats(req.userId)

    res.status(200).json({ message: "Chats Fetched Successfully.", chats: data })
}

export const getChatMessages = async (req, res) => {

    const { chatId } = req.params;

    let messages = await chatDao.getMessages(chatId)

    res.status(200).json({ message: "messages fetched successfully", messages })
}



export const eventSource = (req, res) => {

    // EventSource only supports GET requests.
    // You cannot send: body: JSON.stringify({ input })

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let count = 0;

    const interval = setInterval(() => {

        count++;

        res.write(`data: Message ${count}\n\n`);

        if (count === 5) {
            clearInterval(interval);
            res.end();
        }
    }, 500);

    req.on("close", () => {
        clearInterval(interval);
        console.log("Client disconnected");
    });
}