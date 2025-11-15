import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "./authSlice.js";
import homeReducer from "../../features/home/store/homeSlice.js";

export const rootReducer = combineReducers({
    auth: authReducer,
    home: homeReducer,
});
