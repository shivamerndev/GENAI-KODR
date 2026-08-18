/**
 * Dynamically loads PDF.js library from CDN if not already loaded.
 */
const loadPdfJs = () => {
    return new Promise((resolve, reject) => {
        if (window.pdfjsLib) {
            resolve(window.pdfjsLib);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => {
            if (window.pdfjsLib) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                resolve(window.pdfjsLib);
            } else {
                reject(new Error('PDF.js failed to initialize.'));
            }
        };
        script.onerror = () => reject(new Error('Failed to load PDF processing library from CDN.'));
        document.head.appendChild(script);
    });
};

/**
 * Extracts plain text from a PDF File object.
 * @param {File} file - The PDF file object from input element.
 * @returns {Promise<string>} Extracted text string from all pages.
 */
export const extractTextFromPdf = async (file) => {
    try {
        const pdfjs = await loadPdfJs();
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        let textContent = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const tokenizedText = await page.getTextContent();
            const pageText = tokenizedText.items.map((item) => item.str).join(' ');
            textContent += `--- Page ${i} ---\n` + pageText + '\n\n';
        }

        return textContent.trim();
    } catch (error) {
        console.error('Failed to extract text from PDF:', error);
        throw new Error('Could not parse PDF file. Please ensure it is a valid PDF document.');
    }
};
