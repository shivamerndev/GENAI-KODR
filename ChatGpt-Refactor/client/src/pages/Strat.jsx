import React from 'react';
import { useSelector } from 'react-redux';
import { 
    Sparkles, 
    MessageSquareDashed, 
    MessageSquareCheck, 
    Lightbulb, 
    Code2, 
    PenTool, 
    Compass, 
    ShieldAlert,
    ArrowUpRight
} from 'lucide-react';
import InputBar from '../components/InputBar';
import useChat from '../hooks/useChat';

const Strat = ({ temp, setQuery }) => {
    const user = useSelector((state) => state.auth?.user);
    const { handleAiResponse } = useChat();

    const firstName = user?.fullname ? user.fullname.split(' ')[0] : null;

    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const suggestions = [
        {
            icon: Lightbulb,
            title: "Brainstorm Ideas",
            subtitle: "Innovative features for my project",
            prompt: "Help me brainstorm 5 unique and modern features for an AI web application."
        },
        {
            icon: Code2,
            title: "Code Assistant",
            subtitle: "Refactor async/await or review code",
            prompt: "How can I refactor async/await error handling cleanly in Node.js & React?"
        },
        {
            icon: PenTool,
            title: "Help Me Write",
            subtitle: "Draft emails, articles, or documentation",
            prompt: "Draft a concise and engaging announcement email for a new product launch."
        },
        {
            icon: Compass,
            title: "Explain Concept",
            subtitle: "Break down complex topics simply",
            prompt: "Explain how large language models and prompt engineering work in simple terms."
        }
    ];

    const toggleTempMode = () => {
        if (temp) {
            setQuery({});
        } else {
            setQuery({ temp: "true" });
        }
    };

    const handleSuggestionClick = (prompt) => {
        handleAiResponse(prompt, null);
    };

    return (
        <div className="w-full h-full flex flex-col justify-between items-center relative px-4 py-4 max-w-5xl mx-auto overflow-y-auto">
            {/* Top Bar with Temporary Chat Toggle */}
            <div className="w-full flex justify-between items-center py-2 px-1">
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                    {temp && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium backdrop-blur-sm animate-fade-in">
                            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                            <span>Temporary Chat Active — History off</span>
                        </div>
                    )}
                </div>

                {/* Temp Chat Toggle Button */}
                <button
                    onClick={toggleTempMode}
                    title={temp ? "Switch to Normal Chat (saves history)" : "Switch to Temporary Chat (doesn't save history)"}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer shadow-sm ${
                        temp 
                            ? "bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30" 
                            : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 hover:border-zinc-700"
                    }`}
                >
                    {temp ? (
                        <>
                            <MessageSquareCheck className="w-4 h-4 text-amber-400" />
                            <span>Temporary Chat</span>
                        </>
                    ) : (
                        <>
                            <MessageSquareDashed className="w-4 h-4 text-zinc-400" />
                            <span>Enable Temporary Chat</span>
                        </>
                    )}
                </button>
            </div>

            {/* Middle Center Content: Brand Icon, Greeting, Suggestions */}
            <div className="w-full flex-1 flex flex-col items-center justify-center my-auto py-8 gap-8">
                {/* Glow Icon Header */}
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30 blur-xl opacity-70 animate-pulse"></div>
                        <div className="relative w-16 h-16 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 flex items-center justify-center shadow-xl backdrop-blur-md">
                            <Sparkles className="w-8 h-8 text-emerald-400" />
                        </div>
                    </div>

                    {/* Headline */}
                    <div className="space-y-1.5">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400">
                            {temp 
                                ? "Temporary Chat Session" 
                                : firstName 
                                    ? `${getTimeGreeting()}, ${firstName}` 
                                    : "What can I help with today?"
                            }
                        </h1>
                        <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                            {temp 
                                ? "Chats in this mode won't be saved to your sidebar or history." 
                                : "Ask anything, brainstorm ideas, or process complex information seamlessly."
                            }
                        </p>
                    </div>
                </div>

                {/* Starter Suggestions Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-2xl mt-2">
                    {suggestions.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={index}
                                onClick={() => handleSuggestionClick(item.prompt)}
                                className="group relative flex items-start justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/60 hover:bg-zinc-800/60 hover:border-zinc-700/80 transition-all duration-200 text-left shadow-sm hover:shadow-md cursor-pointer"
                            >
                                <div className="flex items-start gap-3 min-w-0 pr-2">
                                    <div className="p-2 rounded-lg bg-zinc-800/70 text-zinc-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors shrink-0 mt-0.5">
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors truncate">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors truncate mt-0.5">
                                            {item.subtitle}
                                        </p>
                                    </div>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-0.5" />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Section: Input Bar & Disclaimer */}
            <div className="w-full max-w-3xl flex flex-col items-center gap-2 shrink-0 mb-2">
                <InputBar />
                <p className="text-[11px] text-zinc-500 text-center tracking-wide">
                    ChatGPT can make mistakes. Verify important information.
                </p>
            </div>
        </div>
    );
};

export default Strat;