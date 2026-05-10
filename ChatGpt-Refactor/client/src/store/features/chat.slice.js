import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
    name: "chat",
    initialState: {
        messages: [],
        chats: []
    },

    reducers: {
        setMessages: (state, { payload }) => {
            state.messages = payload
        },
        appendMessages: (state, { payload }) => {
            state.messages = [...state.messages, ...payload]
        },
        appendAiChunks: (state, { payload }) => {
            state.messages[state.messages.length - 1].content = payload
        },
        setChats: (state, { payload }) => {
            state.chats = payload;
        },
        appendNewChats: (state, { payload }) => {
            state.chats.unshift(payload)
        }
    }

})

export const { setMessages, appendMessages, appendAiChunks, setChats, appendNewChats } = chatSlice.actions;
export default chatSlice.reducer