import { useSelector } from 'react-redux';
import { Sparkles, MessageSquareDashed, MessageSquareCheck } from 'lucide-react';


const Strat = ({ temp, setQuery }) => {
    const user = useSelector((state) => state.auth?.user);

    const firstName = user?.fullname ? user.fullname.split(' ')[0] : null;

    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const toggleTempMode = () => {
        if (temp) {
            setQuery({});
        } else {
            setQuery({ temp: "true" });
        }
    };

    return (
        <div className="w-full flex  flex-col justify-between items-center h-full relative px-4 py-4 max-w-5xl mx-auto ">


            <button
                onClick={toggleTempMode}
                title={temp ? "Switch to Normal Chat (saves history)" : "Switch to Temporary Chat (doesn't save history)"}
                className={`flex absolute right-0 top-0 items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer shadow-sm ${temp
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
                        <span>Temporary Chat</span>
                    </>
                )}
            </button>


            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <div className="relative flex items-center justify-center">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30 blur-xl opacity-70 animate-pulse"></div>
                    <div className="relative w-12 h-12 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 flex items-center justify-center shadow-xl backdrop-blur-md">
                        <Sparkles className="w-5 h-5 text-emerald-400" />
                    </div>
                </div>

                {/* Headline */}
                <div className="space-y-1.5">
                    <h1 className="text-xl sm:text-3xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400">
                        {temp ? "Temporary Chat Session" : firstName ? `${getTimeGreeting()}, ${firstName}` : "What can I help with today?"}
                    </h1>
                    <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                        {temp
                            ? "Chats in this mode won't be saved to your sidebar or history."
                            : "Ask anything, brainstorm ideas, or process complex information seamlessly."
                        }
                    </p>
                </div>
            </div>

        </div>
    );
};

export default Strat;
