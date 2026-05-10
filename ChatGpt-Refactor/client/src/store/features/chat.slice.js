import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
    name: "chat",
    initialState: {
        messages: [],
        chats: [],
        tempChat: false
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
        },
        setTempChat: (state, { payload }) => {
            state.tempChat = state.tempChat ? false : true
        }
    }

})

export const { setMessages, appendMessages, appendAiChunks, setChats, appendNewChats , setTempChat } = chatSlice.actions;
export default chatSlice.reducer