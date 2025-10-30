import axios from "axios";
import { BE_BASE_URL } from "../constants/env";
import { HTTP_RESPONSE_STATUS_CODE, METHOD } from "../constants/api";
import toast from "react-hot-toast";
import { setLoading } from "../store/authSlice";
import { store } from "../../main";

export const axiosInstance = axios.create({
    baseURL: BE_BASE_URL,
});

axiosInstance.interceptors.response.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
});

export const callApi = async ({ method, endpoint, displaySuccessMessage = false, alertErrorMessage = false, arg }) => {
    try {
        store.dispatch(setLoading(true));
        const isGetOrDelete = method === METHOD.GET || method === METHOD.DELETE;
        const response = await axiosInstance({
            method,
            url: endpoint,
            data: !isGetOrDelete ? arg : null,
            params: isGetOrDelete ? arg : null,
        });

        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        if (displaySuccessMessage) {
            toast.success(response.data.message || "Successful");
        }
        return response.data.data;
    } catch (error) {
        if (error.status == HTTP_RESPONSE_STATUS_CODE.UNAUTHORIZED) {
            confirm("Unauthorized access. Please log in again.");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        } else if (alertErrorMessage) {
            alert(error.message || "An error occurred");
        } else {
            throw error;
        }
    } finally {
        store.dispatch(setLoading(false));
    }
};
