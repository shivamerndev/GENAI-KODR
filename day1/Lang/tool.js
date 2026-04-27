import * as z from "zod"
import { tool } from "langchain" // tool return string or number only.

export const latest_information = tool(({ city }) => {

    console.log("City is : ",city)

    if (city.toLocaleLowerCase() === "delhi") {
        return "Delhi is the capital of India."
    } else {
        return "I don't have information about this city."
    }
},{
    name: "latest_information",
    description: "Get the latest information about a city.",
    schema: z.object({
        city: z.string().describe("The name of the city you want to get information about.")
    })
})