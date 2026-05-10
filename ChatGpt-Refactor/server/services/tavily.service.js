import { tavily } from "@tavily/core";
import { tool } from "langchain" // tool return string or number only.
import z from "zod"

const client = tavily({ apiKey: "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" });

export const latest_info = tool(async (input) => {

    const response = await client.search(JSON.stringify(input));
    console.log("Tavily Response", response.results);

    let resultString = "";
    if (Array.isArray(response.results)) {

        resultString = response.results.map(r => `Title: ${r.title}\nURL: ${r.url}\nContent: ${r.content || ""}`).join("\n\n");

    } else {
        resultString = typeof response.results === "string" ? response.results : JSON.stringify(response.results);
    }

    return resultString;

}, {
    name: "latest_info",
    description: "get correct information.",
    schema: z.object({
        tavilyResponse: z.string().describe("Give concise and simple answer")
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