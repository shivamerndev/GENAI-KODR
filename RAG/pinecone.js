import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { embedDocs, embedQuery } from "./embed.js"
import { v4 as uuidv4 } from 'uuid';
// import { PineconeStore } from "@langchain/pinecone";

const pinecone = new PineconeClient({
    apiKey: process.env.PINECONE_API_KEY,
});



export const upsertFile = async (docs) => {

    let vectors = await embedDocs(docs)

    const records = vectors.map((vector, index) => ({
        id: uuidv4(),
        values: vector,
        metadata: {
            text: docs[index].pageContent,
            page: index + 1,
        },
    }));

    const index = await pinecone.Index("rag-kodr");

    const upsertResult = await index.upsert({ records })

    console.log("Upserted Successfully.")
}


export const getQueryResults = async (query) => {

    let vector = await embedQuery(query)

    const index = await pinecone.Index("rag-kodr");

    const queryResult = await index.query({ vector, topK: 2, includeMetadata: true })

    console.log(JSON.stringify(queryResult))
}