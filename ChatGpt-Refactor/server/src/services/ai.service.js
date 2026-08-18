import { ChatMistralAI } from "@langchain/mistralai";
import { createAgent, toolStrategy } from "langchain"
import z from "zod";
import { latest_info } from "./tavily.service.js";
import { MISTRAL_API_KEY } from "../configs/env.js";

const model = new ChatMistralAI({
    apiKey: MISTRAL_API_KEY,
    model: "mistral-medium-latest"
});

const agent = createAgent({
    model: model,
    tools: [latest_info]
})

const titleAgent = createAgent({
    model: model,
    tools: [],
    responseFormat: toolStrategy(z.object({
        chatTitle: z.string().describe("A concise title for the given message")
    }))
})

const getAIResponse = async (userInput, context = "") => {
    let content = userInput;
    if (context && context.trim()) {
        content = `--- Relevant Document Context (RAG) ---\n${context}\n--- End of Context ---\n\nUser Question: ${userInput}`;
    }

    return await agent.stream({
        messages: [{
            role: "user",
            content
        }]
    }, { streamMode: "messages" });
};

const getTitle = async (userInput) => await titleAgent.invoke({
    messages: [{
        role: "user",
        content: `Generate a concise title for the following message: ${userInput}`
    }]
})

export { getAIResponse, getTitle }