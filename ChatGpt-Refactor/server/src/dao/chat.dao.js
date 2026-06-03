import chatModel from "../models/chat.model.js";
import messagesModel from "../models/messages.model.js"


export const createChat = async ({ title, user }) => await chatModel.create({ title, user })

export const getChats = async (userId) => await chatModel.find({ user: userId }).select("title isDeleted").sort({ createdAt: -1 }).lean()

export const deleteChats = async (chatId) => await chatModel.findByIdAndDelete(chatId)

export const saveMessages = async (data) => await messagesModel.create(data)

export const getMessages = async (chatId) => await messagesModel.find({ chatId })

export const deleteMessages = async (chatId) => await messagesModel.deleteMany({ chatId })

export const renameChat = async (chatId, title) => await chatModel.findByIdAndUpdate(chatId, { title }, { new: true })