import 'dotenv/config';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { getQueryResults, upsertFile } from './pinecone.js';

const pdfPath = "./story.pdf"

const pdfLoader = new PDFLoader(pdfPath, {
    splitPages: true,
});

const docs = await pdfLoader.load();

// upsertFile(docs)

getQueryResults("Tell me about the Internship ?")