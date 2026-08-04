import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, FileText, X, ArrowUp, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import useChat from '../hooks/useChat';
import { extractTextFromPdf } from '../utils/pdfExtractor';

const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const InputBar = ({ chatId }) => {
    const { handleAiResponse } = useChat();
    const [input, setInput] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);

    // Auto-resize textarea height
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
        }
    }, [input]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            alert('Please select a valid PDF file.');
            return;
        }

        const fileState = {
            name: file.name,
            size: formatBytes(file.size),
            text: '',
            isExtracting: true,
            error: null
        };

        setPdfFile(fileState);

        try {
            const extractedText = await extractTextFromPdf(file);
            setPdfFile((prev) => ({
                ...prev,
                text: extractedText,
                isExtracting: false
            }));
        } catch (err) {
            setPdfFile((prev) => ({
                ...prev,
                isExtracting: false,
                error: err.message || 'Failed to parse PDF file.'
            }));
        }
    };

    const handleRemoveFile = () => {
        setPdfFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        const trimmedInput = input.trim();
        if (!trimmedInput && (!pdfFile || pdfFile.isExtracting || pdfFile.error)) {
            return;
        }

        let fullPrompt = trimmedInput;

        if (pdfFile && pdfFile.text) {
            fullPrompt = `📄 [Attached PDF: ${pdfFile.name}]\n\n--- Extracted Document Content ---\n${pdfFile.text}\n--- End of Document ---\n\n${trimmedInput || 'Please analyze and summarize the attached PDF document.'}`;
        }

        handleAiResponse(fullPrompt, chatId);

        // Reset state
        setInput('');
        setPdfFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const isSendDisabled =
        (!input.trim() && (!pdfFile || !pdfFile.text)) || (pdfFile && pdfFile.isExtracting);

    return (
        <div className="w-full fixed bottom-4 max-w-4xl mx-auto transition-all duration-300">
            <form
                onSubmit={handleSubmit}
                className="relative flex flex-col w-full bg-zinc-950/80 backdrop-blur-xl border border-zinc-700/60 rounded-3xl p-3 sm:p-4 shadow-2xl focus-within:border-zinc-500/80 focus-within:ring-1 focus-within:ring-zinc-500/30 transition-all duration-200"
            >
                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="application/pdf,.pdf"
                    className="hidden"
                />

                {/* Attached PDF Preview Badge */}
                {pdfFile && (
                    <div className="mb-3 flex items-center justify-between bg-zinc-900/90 border border-zinc-700/70 rounded-2xl px-3.5 py-2.5 max-w-md shadow-inner transition-all duration-200">
                        <div className="flex items-center space-x-3 overflow-hidden">
                            <div className="p-2 bg-red-500/10 text-red-400 rounded-xl flex-shrink-0">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium text-zinc-100 truncate">
                                    {pdfFile.name}
                                </span>
                                <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                                    {pdfFile.size}
                                    <span className="text-zinc-600">•</span>
                                    {pdfFile.isExtracting && (
                                        <span className="text-amber-400 flex items-center gap-1">
                                            <Loader2 className="w-3 h-3 animate-spin" /> Extracting text...
                                        </span>
                                    )}
                                    {pdfFile.error && (
                                        <span className="text-red-400 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> Failed
                                        </span>
                                    )}
                                    {!pdfFile.isExtracting && !pdfFile.error && (
                                        <span className="text-emerald-400 flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> Ready
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl transition-colors ml-2"
                            title="Remove file"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Multiline Text Area */}
                <div className="w-full relative">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        placeholder={pdfFile ? 'Ask anything about this document...' : 'Message AI or attach a PDF...'}
                        className="w-full bg-transparent text-zinc-100 placeholder-zinc-400/80 text-base leading-relaxed outline-none resize-none px-1 py-1 max-h-44 custom-scrollbar"
                        autoComplete="off"
                    />
                </div>

                {/* Actions Bar */}
                <div className="flex items-center justify-between pt-2 mt-1 border-t border-zinc-700/40">
                    <div className="flex items-center space-x-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white bg-rose-500/10 cursor-pointer hover:bg-rose-500/30 rounded-xl transition-all duration-200 group"
                            title="Attach PDF Document"
                        >
                            <Paperclip className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                            <span className="hidden sm:inline">Attach PDF</span>
                        </button>

                        <span className="text-[11px] text-zinc-500 hidden md:inline ml-2">
                            Press <kbd className="px-1 py-0.5 bg-zinc-700/50 rounded text-zinc-300 font-mono text-[10px]">Shift + Enter</kbd> for new line
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={isSendDisabled}
                        className={`p-2.5 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                            isSendDisabled
                                ? 'bg-zinc-700/40 text-zinc-500 cursor-not-allowed'
                                : 'bg-white text-zinc-900 hover:bg-zinc-200 active:scale-95 shadow-md hover:shadow-lg'
                        }`}
                        title="Send message"
                    >
                        <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InputBar;