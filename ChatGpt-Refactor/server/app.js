import cookieParser from "cookie-parser";
import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get("/api/health", (req, res) => {
  res.send("Server is healthy");
});

app.use("/api/auth", (await import("./routes/auth.route.js")).default);
app.use("/api/chats",(await import("./routes/chat.route.js")).default)

export default app;