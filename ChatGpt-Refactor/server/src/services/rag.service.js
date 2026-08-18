import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getQueryResults, upsertFile } from '../rag/pinecone.js';

/**
 * Parses user-uploaded PDF file buffer, embeds with Mistral, and indexes vectors into Pinecone DB.
 */
export const processAndIndexPdf = async ({ fileBuffer, fileName, chatId, fileId, userId }) => {
    if (!fileBuffer) {
        throw new Error("No PDF buffer provided.");
    }

    const blob = new Blob([fileBuffer], { type: 'application/pdf' });
    const pdfLoader = new PDFLoader(blob, {
        splitPages: true,
    });

    const rawDocs = await pdfLoader.load();

    if (!rawDocs || rawDocs.length === 0) {
        throw new Error("Extracted PDF document is empty or unreadable.");
    }

    // Split document into chunks for vector embeddings
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const splitDocs = await textSplitter.splitDocuments(rawDocs);

    // Filter out chunks with empty or whitespace-only content
    const docs = splitDocs.filter(
        (doc) => doc.pageContent && doc.pageContent.trim().length > 0
    );

    if (!docs || docs.length === 0) {
        throw new Error("No readable text found in PDF document (it may be empty or contain only images).");
    }

    await upsertFile(docs, fileId, chatId);

    return {
        fileId,
        fileName,
        numChunks: docs.length,
        numPages: rawDocs.length
    };
};

/**
 * Queries Pinecone vector database using query embedding from Mistral
 * and returns relevant document chunks formatted as prompt context.
 */
export const retrieveContext = async ({ query, chatId, fileId, topK = 4 }) => {
    try {
        if (!query) return "";
        const contextText = await getQueryResults(query, fileId, chatId, topK);
        return contextText || "";
    } catch (err) {
        console.error("Error retrieving context from Pinecone:", err.message);
        return "";
    }
};