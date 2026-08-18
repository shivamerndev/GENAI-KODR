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
    Check,
    Sun,
    Moon,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react';

const SideNav = ({ chatId }) => {
    const user = useSelector((state) => state.auth.user);
    const chats = useSelector((state) => state.chat.chats) || [];

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'dark';
    });

    const [isCollapsed, setIsCollapsed] = useState(() => {
        return localStorage.getItem('sidebar_collapsed') === 'true';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('sidebar_collapsed', isCollapsed);
    }, [isCollapsed]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
                e.preventDefault();
                setIsCollapsed(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    const toggleCollapse = () => {
        setIsCollapsed(prev => !prev);
    };

    const [activePopUpId, setActivePopUpId] = useState(null);
    const [editingChatId, setEditingChatId] = useState(null);
    const [renameText, setRenameText] = useState("");
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [imgError, setImgError] = useState(false);

    const navigate = useNavigate();
    const { handleGetChats, handleDeleteChat, handleRenameChat, handleCleanUp } = useChat();

    const handleNewChat = () => {
        handleCleanUp();
        navigate("/");
    };

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
        <aside 
            className={`${
                isCollapsed ? "w-16 px-2 py-4" : "w-72 px-3.5 py-4"
            } shrink-0 bg-[var(--bg-sidebar)] backdrop-blur-xl flex flex-col justify-between h-screen relative border-r border-[var(--border-subtle)] shadow-2xl select-none z-20 transition-all duration-300 ease-in-out`}
        >
            {/* Top Brand Header & Navigation */}
            <div className="flex flex-col flex-1 min-h-0">
                {/* Brand Header */}
                {!isCollapsed ? (
                    <div className="flex items-center justify-between px-2 pt-1 pb-3">
                        <div 
                            onClick={handleNewChat} 
                            className="flex items-center gap-2.5 cursor-pointer group min-w-0"
                        >
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-hover)] p-0.5 shadow-lg shadow-[var(--accent-glow)] flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shrink-0">
                                <Bot className="w-5 h-5 text-[var(--text-inverse)] stroke-[2.5]" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-base font-bold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors truncate">
                                    INTELLICHAT
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={toggleTheme}
                                className="p-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-all cursor-pointer shadow-sm active:scale-95"
                                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? (
                                    <Sun className="w-3.5 h-3.5 transition-transform duration-300 hover:rotate-45" />
                                ) : (
                                    <Moon className="w-3.5 h-3.5 transition-transform duration-300 hover:-rotate-12" />
                                )}
                            </button>
                            <button
                                onClick={toggleCollapse}
                                className="p-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-all cursor-pointer shadow-sm active:scale-95"
                                title="Collapse sidebar (⌘B)"
                                aria-label="Collapse sidebar"
                            >
                                <PanelLeftClose className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3 pt-1 pb-3 border-b border-[var(--border-subtle)]">
                        <button
                            onClick={toggleCollapse}
                            className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-all cursor-pointer shadow-sm active:scale-95 group"
                            title="Expand sidebar (⌘B)"
                            aria-label="Expand sidebar"
                        >
                            <PanelLeftOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                        
                        <div 
                            onClick={handleNewChat} 
                            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-hover)] p-0.5 shadow-lg shadow-[var(--accent-glow)] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200"
                            title="INTELLICHAT - Start New Chat"
                        >
                            <Bot className="w-5 h-5 text-[var(--text-inverse)] stroke-[2.5]" />
                        </div>
                    </div>
                )}

                {/* New Chat Button */}
                {!isCollapsed ? (
                    <button
                        onClick={handleNewChat}
                        className="w-full group relative flex items-center justify-between gap-3 rounded-xl border border-[var(--accent-border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] px-3.5 py-2.5 my-2 cursor-pointer text-sm font-semibold text-[var(--text-primary)] transition-all duration-200 active:scale-[0.98] shadow-lg shadow-black/20"
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent-primary)] flex items-center justify-center group-hover:bg-[var(--accent-primary)] group-hover:text-[var(--text-inverse)] transition-all duration-300 group-hover:rotate-90">
                                <Plus className="w-4 h-4 stroke-[2.5]" />
                            </div>
                            <span>New Chat</span>
                        </div>
                        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-main)] rounded border border-[var(--border-medium)] shadow-inner">
                            ⌘N
                        </kbd>
                    </button>
                ) : (
                    <div className="my-2 flex justify-center">
                        <button
                            onClick={handleNewChat}
                            className="w-10 h-10 rounded-xl border border-[var(--accent-border)] bg-[var(--bg-surface)] hover:bg-[var(--accent-primary)] text-[var(--accent-primary)] hover:text-[var(--text-inverse)] flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-95 shadow-md group relative"
                            title="New Chat (⌘N)"
                            aria-label="New Chat"
                        >
                            <Plus className="w-5 h-5 stroke-[2.5] group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>
                )}

                {/* Search Input */}
                {!isCollapsed ? (
                    chats.length > 3 && (
                        <div className="relative my-2 px-0.5">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search chats..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[var(--bg-main)] border border-[var(--border-medium)] rounded-lg pl-8 pr-7 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-focus)] focus:ring-1 focus:ring-[var(--accent-glow)] transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-0.5 rounded cursor-pointer"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    )
                ) : (
                    chats.length > 3 && (
                        <div className="my-1 flex justify-center">
                            <button
                                onClick={() => setIsCollapsed(false)}
                                className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
                                title="Search chats"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                        </div>
                    )
                )}

                {/* Section Header */}
                {!isCollapsed ? (
                    <div className="flex items-center justify-between px-2 mt-3 mb-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--text-muted)] flex items-center gap-1.5">
                            Recent Chats
                            <span className="px-1.5 py-0.2 bg-[var(--bg-surface)] text-[var(--text-secondary)] rounded-full text-[9px] font-mono">
                                {filteredChats.length}
                            </span>
                        </span>
                        <div className="h-[1px] flex-1 ml-3 bg-gradient-to-r from-[var(--border-medium)] to-transparent" />
                    </div>
                ) : (
                    <div className="h-[1px] w-full my-2 bg-gradient-to-r from-transparent via-[var(--border-medium)] to-transparent" />
                )}

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                    {filteredChats.length === 0 ? (
                        !isCollapsed ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                                <div className="w-10 h-10 rounded-full bg-[var(--bg-surface)] border border-[var(--border-medium)] flex items-center justify-center text-[var(--text-muted)] mb-2">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <p className="text-xs font-medium text-[var(--text-secondary)]">
                                    {searchQuery ? "No matching chats" : "No chats yet"}
                                </p>
                                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                                    {searchQuery ? "Try a different search term" : "Click 'New Chat' to start!"}
                                </p>
                            </div>
                        ) : null
                    ) : (
                        <ul className="space-y-1">
                            {filteredChats.map((chat) => {
                                const isActive = chatId === chat._id;
                                const isOpen = activePopUpId === chat._id;
                                const isEditing = editingChatId === chat._id;

                                if (isCollapsed) {
                                    return (
                                        <li key={chat._id || chat.title} className="relative group/item flex justify-center">
                                            <button
                                                onClick={() => navigate(`/c/${chat._id}`)}
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 relative cursor-pointer ${
                                                    isActive
                                                        ? "bg-[var(--bg-surface)] text-[var(--accent-primary)] border border-[var(--accent-border)] shadow-md"
                                                        : "text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
                                                }`}
                                                title={chat.title}
                                            >
                                                {isActive && (
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[var(--accent-primary)] rounded-r-full shadow-[0_0_8px_var(--accent-glow)]" />
                                                )}
                                                <MessageSquare className="w-4 h-4 shrink-0" />
                                            </button>
                                            
                                            {/* Tooltip for collapsed item */}
                                            <div className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[var(--bg-popup)] text-[var(--text-primary)] text-xs rounded-lg border border-[var(--border-medium)] shadow-xl whitespace-nowrap opacity-0 group-hover/item:opacity-100 pointer-events-none transition-opacity duration-150 z-50">
                                                {chat.title}
                                            </div>
                                        </li>
                                    );
                                }

                                return (
                                    <li key={chat._id || chat.title} className={`relative ${isOpen ? "z-30" : "z-0"}`}>
                                        <div
                                            onClick={() => !isEditing && navigate(`/c/${chat._id}`)}
                                            className={`group w-full relative flex justify-between items-center cursor-pointer rounded-xl px-3 py-2 text-left text-xs transition-all duration-200 ${
                                                isActive || isOpen
                                                    ? "bg-[var(--bg-surface)] text-[var(--text-primary)] font-medium border border-[var(--accent-border)] shadow-md shadow-black/20"
                                                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] hover:translate-x-0.5 border border-transparent"
                                            }`}
                                        >
                                            {/* Active Left Glow Bar */}
                                            {isActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[var(--accent-primary)] rounded-r-full shadow-[0_0_8px_var(--accent-glow)]" />
                                            )}

                                            <div className="flex items-center gap-2.5 min-w-0 flex-1 pl-0.5">
                                                <MessageSquare
                                                    className={`w-4 h-4 shrink-0 transition-colors ${
                                                        isActive
                                                            ? "text-[var(--accent-primary)] drop-shadow-[0_0_6px_var(--accent-glow)]"
                                                            : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
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
                                                            className="bg-[var(--bg-main)] text-[var(--text-primary)] border border-[var(--accent-primary)] rounded-md px-2 py-0.5 text-xs w-full focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] shadow-inner"
                                                        />
                                                        <button
                                                            onClick={() => handleSaveRename(chat._id)}
                                                            className="p-1 text-[var(--accent-primary)] hover:bg-[var(--accent-subtle)] rounded cursor-pointer"
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
                                                        className={`p-1.5 rounded-lg hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all duration-150 cursor-pointer ${
                                                            isOpen
                                                                ? "opacity-100 bg-[var(--bg-surface-hover)] text-[var(--text-primary)]"
                                                                : "opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                        }`}
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                    {isOpen && (
                                                        <div
                                                            className="absolute right-0 top-8 z-50 w-48 rounded-xl border border-[var(--border-medium)] bg-[var(--bg-popup)] backdrop-blur-xl p-1.5 shadow-2xl shadow-black/80"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {confirmDeleteId === chat._id ? (
                                                                <div className="p-2">
                                                                    <p className="text-[11px] text-[var(--text-primary)] mb-2 leading-snug">
                                                                        Delete this chat?<br />
                                                                        <span className="text-[var(--text-muted)] text-[10px]">This action cannot be undone.</span>
                                                                    </p>
                                                                    <div className="flex gap-1.5">
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setConfirmDeleteId(null);
                                                                                setActivePopUpId(null);
                                                                            }}
                                                                            className="flex-1 rounded-lg px-2 py-1 text-[11px] font-medium text-[var(--text-secondary)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
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
                                                                        className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                                                                    >
                                                                        <Pencil className="w-3.5 h-3.5 text-[var(--text-muted)]" />
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

            {/* Bottom Section: Theme Toggle & User Profile */}
            {!isCollapsed ? (
                <div className="border-t border-[var(--border-subtle)] pt-3 mt-2 space-y-2">
                    {/* Theme Switch Control */}
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-all duration-200 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] select-none">
                            {theme === 'dark' ? (
                                <Moon className="w-4 h-4 text-[var(--accent-primary)] transition-transform duration-300" />
                            ) : (
                                <Sun className="w-4 h-4 text-[var(--accent-primary)] transition-transform duration-300" />
                            )}
                            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                        </div>

                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="relative w-10 h-5 rounded-full bg-[var(--bg-main)] border border-[var(--border-medium)] p-0.5 cursor-pointer transition-colors duration-300 focus:outline-none"
                            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
                        >
                            <div
                                className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-hover)] shadow-sm transform transition-transform duration-300 ease-in-out flex items-center justify-center ${
                                    theme === 'light' ? 'translate-x-5' : 'translate-x-0'
                                }`}
                            >
                                {theme === 'dark' ? (
                                    <Moon className="w-2 h-2 text-[var(--text-inverse)] stroke-[2.5]" />
                                ) : (
                                    <Sun className="w-2 h-2 text-[var(--text-inverse)] stroke-[2.5]" />
                                )}
                            </div>
                        </button>
                    </div>

                    <div className="group relative flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-surface-hover)] transition-all duration-200 shadow-md">
                        <div className="relative shrink-0">
                            {user?.picture && !imgError ? (
                                <img
                                    className="w-9 h-9 rounded-full object-cover border border-[var(--accent-border)] shadow-sm"
                                    src={user.picture}
                                    onError={() => setImgError(true)}
                                    alt={user?.fullname || "User"}
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-hover)] text-[var(--text-inverse)] font-bold text-sm flex items-center justify-center border border-[var(--accent-border)] shadow-sm">
                                    {(user?.fullname || user?.name || "User").charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[var(--accent-primary)] border-2 border-[var(--bg-sidebar)] rounded-full shadow-[0_0_6px_var(--accent-glow)]" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-xs text-[var(--text-primary)] font-semibold truncate leading-tight group-hover:text-[var(--accent-primary)] transition-colors">
                                {user?.fullname || user?.name || "Guest User"}
                            </span>
                            <span className="text-[11px] text-[var(--text-muted)] truncate leading-none mt-1 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-[var(--accent-primary)] shrink-0" />
                                {user?.email || "Pro Plan"}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="border-t border-[var(--border-subtle)] pt-3 mt-2 space-y-2 flex flex-col items-center">
                    {/* Theme Toggle Icon Button */}
                    <button
                        onClick={toggleTheme}
                        className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
                        title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-4 h-4" />
                        ) : (
                            <Moon className="w-4 h-4" />
                        )}
                    </button>

                    {/* User Profile Avatar Button */}
                    <div 
                        className="relative flex justify-center group/profile cursor-pointer"
                    >
                        {user?.picture && !imgError ? (
                            <img
                                className="w-9 h-9 rounded-full object-cover border border-[var(--accent-border)] shadow-sm"
                                src={user.picture}
                                onError={() => setImgError(true)}
                                alt={user?.fullname || "User"}
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-hover)] text-[var(--text-inverse)] font-bold text-sm flex items-center justify-center border border-[var(--accent-border)] shadow-sm">
                                {(user?.fullname || user?.name || "User").charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[var(--accent-primary)] border-2 border-[var(--bg-sidebar)] rounded-full shadow-[0_0_6px_var(--accent-glow)]" />

                        {/* Floating tooltip on hover */}
                        <div className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[var(--bg-popup)] text-[var(--text-primary)] text-xs rounded-lg border border-[var(--border-medium)] shadow-xl whitespace-nowrap opacity-0 group-hover/profile:opacity-100 pointer-events-none transition-opacity duration-150 z-50">
                            <p className="font-semibold">{user?.fullname || user?.name || "Guest User"}</p>
                            <p className="text-[10px] text-[var(--text-muted)]">{user?.email || "Pro Plan"}</p>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default SideNav;

