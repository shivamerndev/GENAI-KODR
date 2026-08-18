import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { embedDocs, embedQuery } from "./embed.js";
import { v4 as uuidv4 } from 'uuid';
import { PINECONE_API_KEY, PINECONE_INDEX } from "../configs/env.js";

const pinecone = new PineconeClient({
    apiKey: PINECONE_API_KEY,
});

const indexName = PINECONE_INDEX;
const index = pinecone.Index(indexName);

export const upsertFile = async (docs, fileId = '', chatId = '') => {
    if (!docs || docs.length === 0) {
        throw new Error("Must pass in at least 1 record to upsert.");
    }

    let vectors = await embedDocs(docs);

    const records = vectors.map((vector, idx) => ({
        id: uuidv4(),
        values: vector,
        metadata: {
            text: docs[idx].pageContent,
            page: docs[idx].metadata?.loc?.pageNumber || idx + 1,
            fileId: fileId || '',
            chatId: chatId || ''
        },
    }));

    if (!records || records.length === 0) {
        throw new Error("Must pass in at least 1 record to upsert.");
    }

    const upsertResult = await index.upsert({ records });
    console.log("Upserted Successfully into Pinecone.");
    return upsertResult;
};

export const getQueryResults = async (query, fileId = '', chatId = '', topK = 4) => {
    let vector = await embedQuery(query);

    let filter = undefined;
    if (fileId) {
        filter = { fileId: { $eq: fileId } };
    } else if (chatId) {
        filter = { chatId: { $eq: chatId } };
    }

    const queryResult = await index.query({
        vector,
        topK,
        includeMetadata: true,
        ...(filter ? { filter } : {})
    });

    if (!queryResult.matches || queryResult.matches.length === 0) {
        return "";
    }

    const contextText = queryResult.matches
        .map((match, idx) => `[Document Excerpt ${idx + 1}]:\n${match.metadata.text}`)
        .join("\n\n");

    return contextText;
};