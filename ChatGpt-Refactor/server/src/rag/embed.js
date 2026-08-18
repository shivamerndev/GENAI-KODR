import { MistralAIEmbeddings } from "@langchain/mistralai"
import { MISTRAL_API_KEY } from "../configs/env.js";


const embeddings = new MistralAIEmbeddings({
    apiKey: MISTRAL_API_KEY,
    model: "mistral-embed"
})

export const embedDocs = docs => embeddings.embedDocuments(docs.map((doc) => doc.pageContent));

export const embedQuery = query => embeddings.embedQuery(query)