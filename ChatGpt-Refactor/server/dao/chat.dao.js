import chatModel from "../models/chat.model.js";
import messagesModel from "../models/messages.model.js"


export async function createChat({ title, user }) {
    const chat = await chatModel.create({ title, user })
    return chat;
}

export async function getChats(userId) {

    const chats = await chatModel.find({ user: userId }).select("title isDeleted").sort({ createdAt: -1 }).lean()
    return chats;
}

export const saveMessages = async (data) => await messagesModel.create(data)

export const getMessages = async (chatId) => await messagesModel.find({ chatId })