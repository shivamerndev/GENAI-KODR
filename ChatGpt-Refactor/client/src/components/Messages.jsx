import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import useChat from '../hooks/useChat.js'
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";
import { Bot, Copy, Check, Terminal } from 'lucide-react'

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
            <code className="bg-zinc-800/80 text-emerald-300 font-mono text-[13px] px-1.5 py-0.5 rounded-md border border-zinc-700/50 shadow-2xs" {...props}>
                {children}
            </code>
        );
    }

    return (
        <div className="my-4 rounded-xl border border-zinc-800 bg-[#0d0e15] overflow-hidden shadow-md group/code">
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/90 border-b border-zinc-800/80 text-xs text-zinc-400 font-mono">
                <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    {language || 'code'}
                </span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800/60 hover:bg-zinc-700/80 text-zinc-300 transition-all cursor-pointer hover:text-white"
                    title="Copy code"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-medium">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <div className="p-4 overflow-x-auto text-[13.5px] font-mono text-zinc-200 leading-relaxed no-scrollbar">
                <code {...props}>
                    {children}
                </code>
            </div>
        </div>
    );
};

const Messages = ({ chatId }) => {
    const messages = useSelector(state => state.chat.messages)
    const isNewChat = useSelector(state => state.chat.newChat)

    const { handleGetMessages, handleCleanUp } = useChat()
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
        } else {
            handleCleanUp()
        }
    }, [chatId, isNewChat])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <div className='flex-1 w-full max-w-4xl mx-auto overflow-y-auto no-scrollbar px-3 sm:px-6 py-6 pb-32 space-y-6'>
            {messages.map((message, index) =>
                message.role === 'user' ? (
                    <div key={index} className='flex justify-end group/msg'>
                        <div className='relative max-w-[85%] sm:max-w-[75%] bg-gradient-to-r from-zinc-800 to-zinc-800/90 text-zinc-100 rounded-2xl rounded-tr-xs px-4 sm:px-5 py-3 text-sm font-semibold leading-relaxed shadow-sm border border-zinc-700/40'>
                            {message.content}
                            <button 
                                onClick={() => handleCopyMessage(message.content, index)}
                                className='absolute -left-8 top-3 opacity-0 group-hover/msg:opacity-100 transition-opacity p-1 text-zinc-400 hover:text-zinc-200 cursor-pointer'
                                title='Copy message'
                            >
                                {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div key={index} className='flex items-start gap-3.5 max-w-full group/msg'>
                        <div className='shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center shadow-inner mt-0.5 text-emerald-400'>
                            <Bot className='w-4.5 h-4.5' />
                        </div>
                        <div className='flex-1 min-w-0 space-y-2'>
                            <div className='w-full text-[15px] leading-relaxed text-zinc-200
                                [&>p]:mb-4 [&>p:last-child]:mb-0
                                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ul]:space-y-1.5 [&>ul]:marker:text-emerald-400/70
                                [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>ol]:space-y-1.5 [&>ol]:marker:text-emerald-400/70
                                [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:mt-6 [&>h1]:text-white [&>h1]:tracking-tight
                                [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:mt-5 [&>h2]:text-white [&>h2]:tracking-tight
                                [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mb-2.5 [&>h3]:mt-4 [&>h3]:text-white
                                [&>blockquote]:border-l-2 [&>blockquote]:border-emerald-500/60 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-zinc-400 [&>blockquote]:mb-4 [&>blockquote]:bg-emerald-500/5 [&>blockquote]:py-2 [&>blockquote]:pr-4 [&>blockquote]:rounded-r-lg
                                [&>a]:text-emerald-400 [&>a]:underline [&>a]:underline-offset-4 hover:[&>a]:text-emerald-300 [&>a]:transition-colors
                                [&_table]:w-full [&_table]:mb-4 [&_table]:border-collapse [&_table]:rounded-lg [&_table]:overflow-hidden [&_table]:border [&_table]:border-zinc-800
                                [&_th]:border-b [&_th]:border-zinc-800 [&_th]:px-4 [&_th]:py-2.5 [&_th]:bg-zinc-900/90 [&_th]:text-left [&_th]:text-zinc-200 [&_th]:font-semibold [&_th]:text-sm
                                [&_td]:border-b [&_td]:border-zinc-800/60 [&_td]:px-4 [&_td]:py-2 [&_td]:text-sm [&_td]:text-zinc-300
                                [&_tr:last-child_td]:border-b-0 [&_tr:hover_td]:bg-zinc-900/40
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
                                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors px-2 py-1 rounded-md hover:bg-zinc-800/50 cursor-pointer"
                                    title="Copy response"
                                >
                                    {copiedIndex === index ? (
                                        <>
                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="text-emerald-400">Copied</span>
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