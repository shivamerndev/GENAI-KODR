import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { GEMINI_API_KEY } from "../configs/env.js"

const googleModel = new ChatGoogleGenerativeAI({
    model: "gemini-flash-latest",
    apiKey: GEMINI_API_KEY
})

const agent = createAgent({ googleModel, tools: [] })


const getGenAiResponse = async (userInput) => await agent.stream({
    messages: [{
        role: "user",
        content: userInput
    }]
}, {
    streamMode: "messages"
})
