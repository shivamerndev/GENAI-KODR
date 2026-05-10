import React from 'react'
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useChat from '../hooks/useChat';
import { useNavigate } from 'react-router-dom';

const SideNav = ({chatId}) => {

    const user = useSelector((state) => state.auth.user);
    const chats = useSelector((state) => state.chat.chats);
    const navigate = useNavigate();

    const { handleGetChats } = useChat();

    useEffect(() => {
        handleGetChats()
    }, []);


    return (
        <aside className="w-70 shrink-0 bg-zinc-900 px-4 py-6 flex flex-col justify-between min-h-screen relative">
            <div>
                <button
                    onClick={() => navigate("/")}
                    className="w-full rounded-md bg-zinc-800/80 px-4 py-2 my-8 cursor-pointer text-left text-base font-semibold text-zinc-100 hover:bg-zinc-700/80 transition-colors shadow-sm"
                >
                    + New Chat
                </button>

                <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Recent
                </p>
                <ul className="space-y-1">
                    {chats.map((chat) => (
                        <li key={chat._id}>
                            <button
                                onClick={() => navigate(`/c/${chat._id}`)}
                                className={"w-full cursor-pointer rounded px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800/70 hover:text-white transition-colors "+ (chatId === chat._id ? "bg-zinc-800/90 text-white" : "")}
                            >
                                {chat.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex items-center gap-2 mt-8 p-2 rounded-md bg-zinc-900/70">
                <img className="w-8 h-8 rounded-full object-cover border border-zinc-800" src={user?.picture} alt="" />
                <span className="text-sm text-zinc-200 font-medium truncate max-w-[120px]">{user?.fullname}</span>
            </div>
        </aside>
    )
}
export default SideNav
