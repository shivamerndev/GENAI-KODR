import { ChatMistralAI } from "@langchain/mistralai"
import { createAgent } from "langchain"
import { latest_information } from "./tool.js"
import "dotenv/config"

const apiKey = process.env.MISTRAL_API_KEY

const model = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: apiKey
})

const agent = createAgent({
    model: model,
    tools: [latest_information]
})


export const invokeAIByLang = async (messages) => {

    // const chatResponse = await model.invoke(messages)
    const chatResponse = await agent.invoke({ messages })
   console.log(JSON.stringify(chatResponse))
    return chatResponse
}