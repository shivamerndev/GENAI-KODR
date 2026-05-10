import { ChatMistralAI } from "@langchain/mistralai";
import { createAgent, toolStrategy } from "langchain"
import z from "zod";
import { latest_info } from "./tavily.service.js";

const model = new ChatMistralAI({ model: "mistral-medium-latest" });

const agent = createAgent({
    model: model,
    tools: [latest_info],
    // responseFormat: toolStrategy(z.object({
    //     tavilyRes: z.string().describe("A concise answer for the given input")
    // }))
})

const titleAgent = createAgent({
    model: model,
    tools: [],
    responseFormat: toolStrategy(z.object({
        chatTitle: z.string().describe("A concise title for the given message")
    }))
})

const getAIResponse = async (userInput) => await agent.stream({
    messages: [{
        role: "user",
        content: userInput
    }]
}, { streamMode: "messages" })

const getTitle = async (userInput) => await titleAgent.invoke({
    messages: [{
        role: "user",
        content: `Generate a concise title for the following message: ${userInput}`
    }]
})

export { getAIResponse, getTitle }