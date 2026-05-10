import { createSlice } from "@reduxjs/toolkit"

let initialState = {
    user: null,
    loading: true
}

const userSlice = createSlice({

    name: "auth",
    initialState,

    reducers: {
        setUser: (state, { payload }) => {
            state.user = payload;
            state.loading = false
        }
    }
})

export const { setUser } = userSlice.actions
export default userSlice.reducer;