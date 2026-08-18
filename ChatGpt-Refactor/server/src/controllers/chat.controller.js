import * as chatDao from "../dao/chat.dao.js";
import { getAIResponse, getTitle } from "../services/ai.service.js";
import { processAndIndexPdf, retrieveContext } from "../services/rag.service.js";


const generateTitle = async (userInput, userId, res) => {

    const { chatTitle } = await (await getTitle(userInput)).structuredResponse

    const chat = await chatDao.createChat({ title: chatTitle, user: userId })

    res.write(`title: ${JSON.stringify({ title: chatTitle, chatId: chat._id })}\n\n`)

    return chat
}

export const uploadPdfController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No PDF file provided" });
        }

        const { chatId } = req.body;
        const fileId = `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        const result = await processAndIndexPdf({
            fileBuffer: req.file.buffer,
            fileName: req.file.originalname,
            chatId: chatId || '',
            fileId,
            userId: req.userId || ''
        });

        res.status(200).json({
            message: "PDF indexed successfully",
            fileId: result.fileId,
            fileName: result.fileName,
            numChunks: result.numChunks,
            numPages: result.numPages
        });
    } catch (err) {
        console.error("PDF upload error:", err.message);
        res.status(500).json({ message: err.message || "Failed to process PDF on server." });
    }
};

export const handleMessage = async (req, res) => {

    const { input: userInput, chatId, fileId, fileName } = req.body;

    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")

    try {

        let title = ""
        if (!chatId) {
            title = await generateTitle(userInput, req.userId, res)
        }
        const activeChatId = chatId || title._id;

        await chatDao.saveMessages({
            chatId: activeChatId,
            content: userInput,
            role: "user",
            fileId: fileId || undefined,
            fileName: fileName || undefined
        })

        // Retrieve RAG context from Pinecone DB using Mistral Embeddings
        const context = await retrieveContext({
            query: userInput,
            chatId: activeChatId,
            fileId: fileId
        });

        const stream = await getAIResponse(userInput, context)

        let AIMessage = ""

        for await (const chunk of stream) {

            AIMessage += chunk[0].contentBlocks[0].text;

            res.write(`chunk: ${JSON.stringify({ text: AIMessage })}\n\n`);
        }

        await chatDao.saveMessages({
            chatId: activeChatId,
            content: AIMessage,
            role: "ai"
        })

        res.end()
    } catch (err) {
        console.log(err.message)
    }
}

export const handleTempMessage = async (req, res) => {

    const { input: userInput, fileId } = req.body;

    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")

    try {
        const context = await retrieveContext({
            query: userInput,
            fileId: fileId
        });

        const stream = await getAIResponse(userInput, context)

        let AIMessage = ""
        for await (const chunk of stream) {
            AIMessage += chunk[0].contentBlocks[0].text;
            res.write(`chunk: ${JSON.stringify({ text: AIMessage })}\n\n`);
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

export const deleteChats = async (req, res) => {

    const {chatId} = req.body;

    try {

        await Promise.all([
            chatDao.deleteChats(chatId),
            chatDao.deleteMessages(chatId)
        ])

        res.status(200).json({ message: "Chat deleted successfully" })

    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}

export const renameChat = async (req, res) => {
    const { chatId, title } = req.body;
    try {
        const updatedChat = await chatDao.renameChat(chatId, title);
        res.status(200).json({ message: "Chat renamed successfully", chat: updatedChat });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
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