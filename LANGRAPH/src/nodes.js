import { get_weather } from "./tools.js"


const tools = {
    get_weather
}


 export const toolNode = async (state) => {
    const lastMessage = state.messages[state.messages.length - 1]

    const toolCall = lastMessage.tool_calls[0]

    const toolResponse = await tools[toolCall.name].invoke(toolCall)

    return {
        messages: [
            toolResponse
        ]
    }
}