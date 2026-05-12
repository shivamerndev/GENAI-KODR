import { MistralAIEmbeddings } from "@langchain/mistralai"


const embeddings = new MistralAIEmbeddings({
    apiKey: process.env.MISTRALAI_API_KEY,
    model: "mistral-embed"
})

export const embedDocs = docs => embeddings.embedDocuments(docs.map((doc) => doc.pageContent));

export const embedQuery = query => embeddings.embedQuery(query)