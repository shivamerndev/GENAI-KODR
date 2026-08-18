import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, FileText, X, ArrowUp, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import useChat from '../hooks/useChat';
import { uploadPdfFile } from '../services/chat.service';

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
            fileId: null,
            isUploading: true,
            error: null
        };

        setPdfFile(fileState);

        try {
            const data = await uploadPdfFile(file, chatId);
            setPdfFile((prev) => ({
                ...prev,
                fileId: data.fileId,
                numChunks: data.numChunks,
                isUploading: false
            }));
        } catch (err) {
            setPdfFile((prev) => ({
                ...prev,
                isUploading: false,
                error: err.response?.data?.message || err.message || 'Failed to process PDF on server.'
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
        if (!trimmedInput && (!pdfFile || pdfFile.isUploading || pdfFile.error || !pdfFile.fileId)) {
            return;
        }

        const promptText = trimmedInput || `Please analyze and summarize the attached PDF document (${pdfFile.name}).`;
        const fileId = pdfFile?.fileId || null;
        const fileName = pdfFile?.name || null;

        handleAiResponse(promptText, chatId, fileId, fileName);

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
        (!input.trim() && (!pdfFile || !pdfFile.fileId)) || (pdfFile && pdfFile.isUploading);

    return (
        <div className="w-full fixed bottom-4 max-w-4xl mx-auto transition-all duration-300">
            <form
                onSubmit={handleSubmit}
                className="relative flex flex-col w-full bg-[var(--bg-input)] backdrop-blur-xl border border-[var(--border-medium)] rounded-3xl p-3 sm:p-4 shadow-2xl focus-within:border-[var(--border-focus)] focus-within:ring-1 focus-within:ring-[var(--accent-glow)] transition-all duration-200"
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
                    <div className="mb-3 flex items-center justify-between bg-[var(--bg-surface)] border border-[var(--border-medium)] rounded-2xl px-3.5 py-2.5 max-w-md shadow-inner transition-all duration-200">
                        <div className="flex items-center space-x-3 overflow-hidden">
                            <div className="p-2 bg-red-500/10 text-red-400 rounded-xl flex-shrink-0">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                                    {pdfFile.name}
                                </span>
                                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                                    {pdfFile.size}
                                    <span className="text-[var(--border-medium)]">•</span>
                                    {pdfFile.isUploading && (
                                        <span className="text-amber-400 flex items-center gap-1">
                                            <Loader2 className="w-3 h-3 animate-spin" /> Processing & Indexing PDF...
                                        </span>
                                    )}
                                    {pdfFile.error && (
                                        <span className="text-red-400 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> {pdfFile.error}
                                        </span>
                                    )}
                                    {!pdfFile.isUploading && !pdfFile.error && (
                                        <span className="text-[var(--accent-primary)] flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> Indexed in Pinecone
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] rounded-xl transition-colors ml-2 cursor-pointer"
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
                        className="w-full bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] text-base leading-relaxed outline-none resize-none px-1 py-1 max-h-44 custom-scrollbar"
                        autoComplete="off"
                    />
                </div>

                {/* Actions Bar */}
                <div className="flex items-center justify-between pt-2 mt-1 border-t border-[var(--border-subtle)]">
                    <div className="flex items-center space-x-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--accent-subtle)] cursor-pointer hover:bg-[var(--accent-border)] rounded-xl transition-all duration-200 group border border-[var(--accent-border)]"
                            title="Attach PDF Document"
                        >
                            <Paperclip className="w-4 h-4 text-[var(--accent-primary)] group-hover:scale-110 transition-transform" />
                            <span className="hidden sm:inline">Attach PDF</span>
                        </button>

                        <span className="text-[11px] text-[var(--text-muted)] hidden md:inline ml-2">
                            Press <kbd className="px-1.5 py-0.5 bg-[var(--bg-surface)] text-[var(--text-secondary)] font-mono text-[10px] rounded border border-[var(--border-medium)]">Shift + Enter</kbd> for new line
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={isSendDisabled}
                        className={`p-2.5 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            isSendDisabled
                                ? 'bg-[var(--bg-surface)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-subtle)]'
                                : 'bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)] active:scale-95 shadow-md hover:shadow-lg'
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