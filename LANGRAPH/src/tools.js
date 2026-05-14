import { tool } from "langchain"
import * as z from "zod"


export const get_weather = tool(
    async ({ city }) => {
        return `The weather in ${city} is sunny.`
    },
    {
        name: "get_weather",
        description: "Get the weather for a city",
        schema: z.object({
            city: z.string().describe("The city to get the weather for")
        })
    }
)