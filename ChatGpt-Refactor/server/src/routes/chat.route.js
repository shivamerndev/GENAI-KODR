import { Router } from "express";
import multer from "multer";
import userAuth from "../middlewares/auth.middleware.js";
import { deleteChats, eventSource, getChatMessages, getChatTitles, handleMessage, handleTempMessage, renameChat, uploadPdfController } from "../controllers/chat.controller.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});

const chatRouter = Router();

/**
 * @routes POST /api/chats/upload-pdf
 * Handles PDF file upload, server-side extraction, text chunking, Mistral embeddings, and Pinecone DB storage.
 */
chatRouter.post("/upload-pdf", userAuth, upload.single("file"), uploadPdfController);

/**
 * @routes POST /api/chats
 * @argument req.body = {input:string, chatId:string?, fileId:string?}
 */
chatRouter.post("/", userAuth, handleMessage);
chatRouter.post("/temp", handleTempMessage);
chatRouter.get("/", userAuth, getChatTitles);

chatRouter.get("/chat/:chatId", userAuth, getChatMessages);
chatRouter.delete("/chat", userAuth, deleteChats);
chatRouter.patch("/chat", userAuth, renameChat);

export default chatRouter;