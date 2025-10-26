import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
    loading: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setUser(state, value) {
            state.user = value.payload;
        },
        setToken(state, value) {
            state.token = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
        },
    },
});

export const { setUserData, setToken, setLoading } = authSlice.actions;

export default authSlice.reducer;
