import { Router } from "express";
import userAuth from "../middlewares/auth.middleware.js";
import { eventSource, getChatMessages, getChatTitles, handleMessage } from "../controllers/chat.controller.js";

const chatRouter = Router();

/**
 * @routes POST /api/chats
 * @argument req.body = {content:string,chatId:string?}
 */
chatRouter.post("/", userAuth, handleMessage);
chatRouter.get("/", userAuth, getChatTitles)

chatRouter.get("/chat/:chatId",userAuth,getChatMessages)

chatRouter.get("/events", eventSource)


export default chatRouter;