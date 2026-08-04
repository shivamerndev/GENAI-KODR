import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useChat from '../hooks/useChat';
import { useNavigate } from 'react-router-dom';
import { 
    MessageSquare, 
    MoreHorizontal, 
    Pencil, 
    Trash2, 
    Plus, 
    Sparkles, 
    Search, 
    X, 
    Bot, 
    Check 
} from 'lucide-react';

const SideNav = ({ chatId }) => {
    const user = useSelector((state) => state.auth.user);
    const chats = useSelector((state) => state.chat.chats) || [];

    const [activePopUpId, setActivePopUpId] = useState(null);
    const [editingChatId, setEditingChatId] = useState(null);
    const [renameText, setRenameText] = useState("");
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [imgError, setImgError] = useState(false);

    const navigate = useNavigate();
    const { handleGetChats, handleDeleteChat, handleRenameChat } = useChat();

    const handleSaveRename = async (idToRename) => {
        if (renameText.trim() && renameText !== chats.find(c => c._id === idToRename)?.title) {
            await handleRenameChat(idToRename, renameText.trim());
        }
        setEditingChatId(null);
    };

    useEffect(() => {
        handleGetChats();
    }, []);

    useEffect(() => {
        const handleOutsideClick = () => {
            setActivePopUpId(null);
            setConfirmDeleteId(null);
        };
        if (activePopUpId) {
            document.addEventListener('click', handleOutsideClick);
        }
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [activePopUpId]);

    const filteredChats = chats.filter(chat => 
        chat.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <aside className="w-72 shrink-0 bg-zinc-950/95 backdrop-blur-xl px-3.5 py-4 flex flex-col justify-between h-screen relative border-r border-zinc-800/60 shadow-2xl select-none z-20">
            {/* Top Brand Header & Navigation */}
            <div className="flex flex-col flex-1 min-h-0">
                {/* Brand Header */}
                <div className="flex items-center justify-between px-2 pt-1 pb-3">
                    <div 
                        onClick={() => navigate("/")} 
                        className="flex items-center gap-2.5 cursor-pointer group"
                    >
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                            <Bot className="w-5 h-5 text-zinc-950 stroke-[2.5]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                                Kodr AI
                            </span>
                        </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30 shadow-sm">
                        v2.0
                    </span>
                </div>

                {/* New Chat Button */}
                <button
                    onClick={() => navigate("/")}
                    className="w-full group relative flex items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900/90 hover:from-emerald-900/50 hover:via-zinc-800 hover:to-zinc-800 hover:border-emerald-500/60 px-3.5 py-2.5 my-2 cursor-pointer text-sm font-semibold text-zinc-100 hover:text-white transition-all duration-200 active:scale-[0.98] shadow-lg shadow-black/30"
                >
                    <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-all duration-300 group-hover:rotate-90">
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <span>New Chat</span>
                    </div>
                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-800/80 rounded border border-zinc-700/60 shadow-inner">
                        ⌘N
                    </kbd>
                </button>

                {/* Search Input (visible if > 3 chats) */}
                {chats.length > 3 && (
                    <div className="relative my-2 px-0.5">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-lg pl-8 pr-7 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-0.5 rounded cursor-pointer"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                )}

                {/* Section Header */}
                <div className="flex items-center justify-between px-2 mt-3 mb-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-500 flex items-center gap-1.5">
                        Recent Chats
                        <span className="px-1.5 py-0.2 bg-zinc-800/80 text-zinc-400 rounded-full text-[9px] font-mono">
                            {filteredChats.length}
                        </span>
                    </span>
                    <div className="h-[1px] flex-1 ml-3 bg-gradient-to-r from-zinc-800/80 to-transparent" />
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                    {filteredChats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-2">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-medium text-zinc-400">
                                {searchQuery ? "No matching chats" : "No chats yet"}
                            </p>
                            <p className="text-[11px] text-zinc-600 mt-0.5">
                                {searchQuery ? "Try a different search term" : "Click 'New Chat' to start!"}
                            </p>
                        </div>
                    ) : (
                        <ul className="space-y-1">
                            {filteredChats.map((chat) => {
                                const isActive = chatId === chat._id;
                                const isOpen = activePopUpId === chat._id;
                                const isEditing = editingChatId === chat._id;

                                return (
                                    <li key={chat._id || chat.title}>
                                        <div
                                            onClick={() => !isEditing && navigate(`/c/${chat._id}`)}
                                            className={`group w-full relative flex justify-between items-center cursor-pointer rounded-xl px-3 py-2 text-left text-xs transition-all duration-200 ${
                                                isActive
                                                    ? "bg-gradient-to-r from-emerald-950/40 via-zinc-800/90 to-zinc-800/60 text-white font-medium border border-emerald-500/30 shadow-md shadow-black/40"
                                                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100 hover:translate-x-0.5 border border-transparent"
                                            }`}
                                        >
                                            {/* Active Left Glow Bar */}
                                            {isActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-400 rounded-r-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                            )}

                                            <div className="flex items-center gap-2.5 min-w-0 flex-1 pl-0.5">
                                                <MessageSquare
                                                    className={`w-4 h-4 shrink-0 transition-colors ${
                                                        isActive
                                                            ? "text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]"
                                                            : "text-zinc-500 group-hover:text-zinc-300"
                                                    }`}
                                                />
                                                {isEditing ? (
                                                    <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                                                        <input
                                                            type="text"
                                                            value={renameText}
                                                            onChange={(e) => setRenameText(e.target.value)}
                                                            onBlur={() => handleSaveRename(chat._id)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    handleSaveRename(chat._id);
                                                                } else if (e.key === "Escape") {
                                                                    setEditingChatId(null);
                                                                }
                                                            }}
                                                            autoFocus
                                                            className="bg-zinc-950 text-white border border-emerald-500/60 rounded-md px-2 py-0.5 text-xs w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner"
                                                        />
                                                        <button
                                                            onClick={() => handleSaveRename(chat._id)}
                                                            className="p-1 text-emerald-400 hover:bg-emerald-950 rounded cursor-pointer"
                                                        >
                                                            <Check className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="truncate pr-2">{chat.title}</span>
                                                )}
                                            </div>

                                            {!isEditing && (
                                                <div className="relative flex items-center">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActivePopUpId(isOpen ? null : chat._id);
                                                        }}
                                                        className={`p-1.5 rounded-lg hover:bg-zinc-700/60 text-zinc-400 hover:text-zinc-100 transition-all duration-150 cursor-pointer ${
                                                            isOpen
                                                                ? "opacity-100 bg-zinc-700/60 text-white"
                                                                : "opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                        }`}
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                    {isOpen && (
                                                        <div
                                                            className="absolute right-0 top-8 z-50 w-48 rounded-xl border border-zinc-800/90 bg-zinc-900/95 backdrop-blur-xl p-1.5 shadow-2xl shadow-black/80"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {confirmDeleteId === chat._id ? (
                                                                <div className="p-2">
                                                                    <p className="text-[11px] text-zinc-300 mb-2 leading-snug">
                                                                        Delete this chat?<br />
                                                                        <span className="text-zinc-500 text-[10px]">This action cannot be undone.</span>
                                                                    </p>
                                                                    <div className="flex gap-1.5">
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setConfirmDeleteId(null);
                                                                                setActivePopUpId(null);
                                                                            }}
                                                                            className="flex-1 rounded-lg px-2 py-1 text-[11px] font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDeleteChat(chat._id);
                                                                                setConfirmDeleteId(null);
                                                                                setActivePopUpId(null);
                                                                            }}
                                                                            className="flex-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-md shadow-red-950/40 transition-all cursor-pointer"
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setEditingChatId(chat._id);
                                                                            setRenameText(chat.title);
                                                                            setActivePopUpId(null);
                                                                        }}
                                                                        className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
                                                                    >
                                                                        <Pencil className="w-3.5 h-3.5 text-zinc-400" />
                                                                        Rename
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setConfirmDeleteId(chat._id);
                                                                        }}
                                                                        className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-colors cursor-pointer"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                                                        Delete
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>

            {/* Bottom User Profile Section */}
            <div className="border-t border-zinc-800/80 pt-3 mt-2">
                <div className="group relative flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-zinc-900/80 via-zinc-900/50 to-zinc-950 border border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-800/50 transition-all duration-200 shadow-md">
                    <div className="relative shrink-0">
                        {user?.picture && !imgError ? (
                            <img
                                className="w-9 h-9 rounded-full object-cover border border-emerald-500/40 shadow-sm"
                                src={user.picture}
                                onError={() => setImgError(true)}
                                alt={user?.fullname || "User"}
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-bold text-sm flex items-center justify-center border border-emerald-400/40 shadow-sm">
                                {(user?.fullname || user?.name || "User").charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-zinc-950 rounded-full shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-xs text-zinc-100 font-semibold truncate leading-tight group-hover:text-emerald-400 transition-colors">
                            {user?.fullname || user?.name || "Guest User"}
                        </span>
                        <span className="text-[11px] text-zinc-400 truncate leading-none mt-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                            {user?.email || "Pro Plan"}
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default SideNav;

