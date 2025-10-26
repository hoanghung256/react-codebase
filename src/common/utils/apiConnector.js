import axios from "axios";
import { BE_BASE_URL } from "../constants/env";

export const axiosInstance = axios.create({
    baseURL: BE_BASE_URL,
});

axiosInstance.interceptors.response.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
});
