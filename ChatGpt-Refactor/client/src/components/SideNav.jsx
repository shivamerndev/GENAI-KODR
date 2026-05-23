import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useChat from '../hooks/useChat';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, MoreHorizontal, Pencil, Trash2, Plus } from 'lucide-react';

const SideNav = ({ chatId }) => {

    const user = useSelector((state) => state.auth.user);
    const chats = useSelector((state) => state.chat.chats);

    const [activePopUpId, setActivePopUpId] = useState(null);
    const [editingChatId, setEditingChatId] = useState(null);
    const [renameText, setRenameText] = useState("");
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const navigate = useNavigate();

    const { handleGetChats, handleDeleteChat, handleRenameChat } = useChat();

    const handleSaveRename = async (chatId) => {
        if (renameText.trim() && renameText !== chats.find(c => c._id === chatId)?.title) {
            await handleRenameChat(chatId, renameText.trim());
        }
        setEditingChatId(null);
    };

    useEffect(() => {
        handleGetChats();
    }, []);

    useEffect(() => {
        const handleOutsideClick = () => {
            setActivePopUpId(null);
        };
        if (activePopUpId) {
            document.addEventListener('click', handleOutsideClick);
        }
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [activePopUpId]);


    return (
        <aside className="w-70 shrink-0 bg-zinc-900 px-4 py-6 flex flex-col justify-between min-h-screen relative border-r border-zinc-800/50">
            <div>
                <button
                    onClick={() => navigate("/")}
                    className="w-full group flex items-center gap-2.5 rounded-lg border border-zinc-800/80 bg-zinc-950/40 hover:bg-zinc-800/60 hover:border-zinc-700/80 px-3.5 py-2.5 my-6 cursor-pointer text-sm font-medium text-zinc-300 hover:text-white transition-all duration-200 active:scale-[0.98] shadow-md shadow-black/10"
                >
                    <Plus className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    <span>New Chat</span>
                </button>

                <div className="flex items-center justify-between px-2 mb-3">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-500">
                        Recent
                    </span>
                    <div className="h-[1px] flex-1 ml-3 bg-zinc-800/60" />
                </div>
                <ul className="space-y-1">
                    {chats.map((chat) => {
                        const isOpen = activePopUpId === chat._id;
                        const isEditing = editingChatId === chat._id;
                        return (
                            <li key={chat._id || chat.title}>
                                <div
                                    onClick={() => !isEditing && navigate(`/c/${chat._id}`)}
                                    className={`group w-full relative flex justify-between items-center cursor-pointer rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 ${chatId === chat._id
                                        ? "bg-zinc-800 text-white font-medium pl-2.5 border-l-2 border-emerald-500"
                                        : "text-zinc-300 hover:bg-zinc-800/50 hover:text-white"
                                        }`}
                                >
                                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                        <MessageSquare className={`w-4 h-4 shrink-0 transition-colors ${chatId === chat._id ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-400"
                                            }`} />
                                        {isEditing ? (
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
                                                onClick={(e) => e.stopPropagation()}
                                                className="bg-zinc-950 text-zinc-200 border border-zinc-700/80 rounded px-1.5 py-0.5 text-xs w-full focus:outline-none focus:border-emerald-500"
                                            />
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
                                                className={`p-1 rounded-md hover:bg-zinc-700/50 text-zinc-400 hover:text-zinc-200 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-150 cursor-pointer ${isOpen ? "opacity-100 bg-zinc-700/50 text-zinc-200" : ""
                                                    }`}
                                            >
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                            {
                                                isOpen &&
                                                <div
                                                    className="absolute right-0 top-7 z-30 w-44 rounded-lg border border-zinc-800 bg-zinc-950 p-1 shadow-2xl"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {confirmDeleteId === chat._id ? (
                                                        <div className="px-2 py-2">
                                                            <p className="text-[11px] text-zinc-400 mb-2 leading-tight">Delete this chat?<br /><span className="text-zinc-600">This can't be undone.</span></p>
                                                            <div className="flex gap-1.5">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setConfirmDeleteId(null);
                                                                        setActivePopUpId(null);
                                                                    }}
                                                                    className="flex-1 rounded px-2 py-1 text-[11px] font-medium text-zinc-400 bg-zinc-800 hover:bg-zinc-700 hover:text-zinc-200 transition-colors cursor-pointer"
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
                                                                    className="flex-1 rounded px-2 py-1 text-[11px] font-medium text-white bg-red-600 hover:bg-red-500 transition-colors cursor-pointer"
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
                                                                className="w-full flex items-center gap-2 rounded px-2 py-1.5 text-left text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
                                                            >
                                                                <Pencil className="w-3.5 h-3.5" />
                                                                Rename
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setConfirmDeleteId(chat._id);
                                                                }}
                                                                className="w-full flex items-center gap-2 rounded px-2 py-1.5 text-left text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                Delete
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            }
                                        </div>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="flex items-center gap-3 mt-8 p-3 rounded-xl bg-zinc-800/40 border border-zinc-800/30 backdrop-blur-sm shadow-inner">
                <img className="w-9 h-9 rounded-full object-cover border border-zinc-700 shadow-sm" src={user?.picture} alt="" />
                <div className="flex flex-col min-w-0">
                    <span className="text-sm text-zinc-200 font-semibold truncate leading-tight">{user?.fullname}</span>
                    <span className="text-xs text-zinc-500 truncate leading-none mt-0.5">{user?.email || "Free Plan"}</span>
                </div>
            </div>
        </aside>
    )
}
export default SideNav
