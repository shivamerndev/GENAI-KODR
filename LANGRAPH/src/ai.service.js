import { ChatMistralAI } from "@langchain/mistralai";
import { get_weather } from "./tools.js"

const model = new ChatMistralAI({
    apiKey: process.env.MISTRALAI_API_KEY,
    model: "mistral-medium-latest"
}).bindTools([get_weather])


export const llmNode = async (state) => {

    const aiResponse = await model.invoke(state.messages)
    return {
        messages: [aiResponse]
    }
}