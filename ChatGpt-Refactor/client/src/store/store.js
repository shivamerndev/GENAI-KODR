import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./features/auth.slice.js"
import chatReducer from "./features/chat.slice.js";

const store = configureStore({
    reducer: {
        auth: authSlice,
        chat: chatReducer
    }
})

export default store;
