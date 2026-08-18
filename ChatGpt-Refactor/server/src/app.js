import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan"
import path from "path";

const app = express();

app.use(morgan("dev"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get("/api/health", (req, res) => {
  res.send("Server is healthy");
});

app.use("/api/auth", (await import("./routes/auth.route.js")).default);
app.use("/api/chats",(await import("./routes/chat.route.js")).default);


const frontendPath = path.join(path.resolve(), "../client/dist");

app.use(express.static(frontendPath))

console.log(frontendPath)
app.get("*client",(req,res)=>{
  res.sendFile("index.html",{root : frontendPath})
})

export default app;