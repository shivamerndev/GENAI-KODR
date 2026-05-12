import { tavily } from "@tavily/core";
import { tool } from "langchain" // tool return string or number only.
import z from "zod"

const client = tavily({ apiKey: "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" });

export const latest_info = tool(async ({ input }) => {

    const response = await client.search(input, {
        searchDepth: "advanced",
        maxResults: 5,
    })

    const results = response.results.map(r => r.content)

    return results.join("\n\n --- \n\n")

}, {
    name: "latest_info",
    description: "get correct information.",
    schema: z.object({
        input: z.string().describe("Give concise and simple answer")
    })
});



// You can also easily extract content from URLs:

// const { tavily } = require("@tavily/core");

// const tvly = tavily({ apiKey: "tvly-YOUR_API_KEY" });
// const response = await tvly.extract(
//   "https://en.wikipedia.org/wiki/Lionel_Messi"
// );

// console.log(response);

// Tavily also allows you to perform a smart crawl starting at a given URL.

// const { tavily } = require("@tavily/core")

// const tvly = tavily({ apiKey: "tvly-YOUR_API_KEY" });
// const response = await client.crawl("https://docs.tavily.com", { instructions: "Find all pages on the Python SDK" });

// console.log(response);