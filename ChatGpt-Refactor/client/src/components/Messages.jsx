import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import useChat from '../hooks/useChat.js'
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";
import { Bot, Copy, Check, Terminal, FileText, MessageSquareCheck } from 'lucide-react'

const CodeBlock = ({ inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const textToCopy = String(children).replace(/\n$/, '');
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (inline || (!language && !String(children).includes('\n'))) {
        return (
            <code className="bg-[var(--bg-surface)] text-[var(--accent-primary)] font-mono text-[13px] px-1.5 py-0.5 rounded-md border border-[var(--border-medium)] shadow-2xs" {...props}>
                {children}
            </code>
        );
    }

    return (
        <div className="my-4 font-mono rounded-xl border border-[var(--border-medium)] bg-[var(--bg-code)] overflow-hidden shadow-md group/code">
            <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-code-header)] border-b border-[var(--border-subtle)] text-xs text-[var(--text-muted)] font-mono">
                <span className="flex items-center gap-1.5 font-medium text-[var(--text-secondary)]">
                    <Terminal className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                    {language || 'code'}
                </span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] transition-all cursor-pointer hover:text-[var(--text-primary)]"
                    title="Copy code"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                            <span className="text-[var(--accent-primary)] font-medium">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <div className="p-4 overflow-x-auto text-[13.5px] font-mono text-[var(--text-primary)] leading-relaxed no-scrollbar">
                <code {...props}>
                    {children}
                </code>
            </div>
        </div>
    );
};

const Messages = ({ chatId, temp }) => {
    const messages = useSelector(state => state.chat.messages)
    const isNewChat = useSelector(state => state.chat.newChat)

    const { handleGetMessages } = useChat()
    const bottomRef = useRef(null)
    const [copiedIndex, setCopiedIndex] = useState(null)

    const handleCopyMessage = (content, index) => {
        navigator.clipboard.writeText(content);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    }

    useEffect(() => {
        if (isNewChat) {
            return;
        }

        if (chatId) {
            handleGetMessages(chatId)
        }
    }, [chatId, isNewChat])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <div className='flex-1 w-full max-w-4xl mx-auto overflow-y-auto no-scrollbar px-3 sm:px-6 py-6 pb-32 space-y-6'>
            {!chatId && temp && (
                <div className="flex items-center justify-center gap-2 py-1.5 px-3.5 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent-border)] text-xs text-[var(--accent-primary)] font-medium max-w-fit mx-auto mb-4 shadow-sm animate-fadeIn">
                    <MessageSquareCheck className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>Temporary Chat — Messages are not saved to history</span>
                </div>
            )}
            {messages.map((message, index) =>
                message.role === 'user' ? (
                    <div key={index} className='flex justify-end group/msg'>
                        <div className='relative max-w-[85%] sm:max-w-[75%] bg-[var(--bg-user-msg)] text-[var(--text-primary)] rounded-2xl rounded-tr-xs px-4 sm:px-5 py-3 text-sm font-medium leading-relaxed shadow-sm border border-[var(--border-medium)]'>
                            {(message.fileName || message.fileId) && (
                                <div className='mb-2.5 flex items-center gap-2.5 bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-medium text-[var(--text-secondary)] shadow-inner'>
                                    <div className="p-1.5 bg-rose-500/15 text-rose-400 rounded-lg shrink-0">
                                        <FileText className='w-4 h-4' />
                                    </div>
                                    <span className='truncate max-w-full text-[var(--text-secondary)]'>
                                        {message.fileName || 'Attached PDF Document'}
                                    </span>
                                </div>
                            )}
                            <div className="whitespace-pre-wrap">{message.content}</div>
                            <button 
                                onClick={() => handleCopyMessage(message.content, index)}
                                className='absolute -left-8 top-3 opacity-0 group-hover/msg:opacity-100 transition-opacity p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer'
                                title='Copy message'
                            >
                                {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-[var(--accent-primary)]" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div key={index} className='flex items-start gap-3.5 max-w-full group/msg'>
                        <div className='shrink-0 w-8 h-8 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent-border)] flex items-center justify-center shadow-inner mt-0.5 text-[var(--accent-primary)]'>
                            <Bot className='w-4.5 h-4.5' />
                        </div>
                        <div className='flex-1 min-w-0 space-y-2'>
                            <div id='aicontent' className='w-full text-[15px] leading-relaxed text-[var(--text-primary)]
                                [&>p]:mb-4 [&>p:last-child]:mb-0
                                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ul]:space-y-1.5 [&>ul]:marker:text-[var(--accent-primary)]
                                [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>ol]:space-y-1.5 [&>ol]:marker:text-[var(--accent-primary)]
                                [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:mt-6 [&>h1]:text-[var(--text-primary)] [&>h1]:tracking-tight
                                [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:mt-5 [&>h2]:text-[var(--text-primary)] [&>h2]:tracking-tight
                                [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mb-2.5 [&>h3]:mt-4 [&>h3]:text-[var(--text-primary)]
                                [&>blockquote]:border-l-2 [&>blockquote]:border-[var(--accent-primary)] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-[var(--text-secondary)] [&>blockquote]:mb-4 [&>blockquote]:bg-[var(--accent-subtle)] [&>blockquote]:py-2 [&>blockquote]:pr-4 [&>blockquote]:rounded-r-lg
                                [&>a]:text-[var(--accent-primary)] [&>a]:underline [&>a]:underline-offset-4 hover:[&>a]:text-[var(--accent-hover)] [&>a]:transition-colors
                                [&_table]:w-full [&_table]:mb-4 [&_table]:border-collapse [&_table]:rounded-lg [&_table]:overflow-hidden [&_table]:border [&_table]:border-[var(--border-medium)]
                                [&_th]:border-b [&_th]:border-[var(--border-medium)] [&_th]:px-4 [&_th]:py-2.5 [&_th]:bg-[var(--bg-surface)] [&_th]:text-left [&_th]:text-[var(--text-primary)] [&_th]:font-semibold [&_th]:text-sm
                                [&_td]:border-b [&_td]:border-[var(--border-subtle)] [&_td]:px-4 [&_td]:py-2 [&_td]:text-sm [&_td]:text-[var(--text-secondary)]
                                [&_tr:last-child_td]:border-b-0 [&_tr:hover_td]:bg-[var(--bg-surface-hover)]
                            '>
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkEmoji]}
                                    components={{
                                        code: CodeBlock
                                    }}
                                >
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover/msg:opacity-100 transition-opacity pt-1">
                                <button 
                                    onClick={() => handleCopyMessage(message.content, index)}
                                    className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-2 py-1 rounded-md hover:bg-[var(--bg-surface-hover)] cursor-pointer"
                                    title="Copy response"
                                >
                                    {copiedIndex === index ? (
                                        <>
                                            <Check className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                                            <span className="text-[var(--accent-primary)]">Copied</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>Copy</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            )}
            <div ref={bottomRef} />
        </div>
    )
}

export default Messages