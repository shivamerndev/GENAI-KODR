import { Router } from "express";
import userAuth from "../middlewares/auth.middleware.js";
import { deleteChats, eventSource, getChatMessages, getChatTitles, handleMessage, handleTempMessage, renameChat } from "../controllers/chat.controller.js";

const chatRouter = Router();

/**
 * @routes POST /api/chats
 * @argument req.body = {content:string,chatId:string?}
 */
chatRouter.post("/", userAuth, handleMessage);
chatRouter.post("/temp",handleTempMessage)
chatRouter.get("/", userAuth, getChatTitles)

chatRouter.get("/chat/:chatId",userAuth,getChatMessages)
chatRouter.delete("/chat",userAuth,deleteChats)
chatRouter.patch("/chat",userAuth,renameChat)

chatRouter.get("/events", eventSource)


export default chatRouter;