import axios from "axios";
import { BE_BASE_URL } from "../constants/env";
import { HTTP_RESPONSE_STATUS_CODE, METHOD } from "../constants/api";
import toast from "react-hot-toast";
import { setLoading } from "../store/authSlice";
import { store } from "../../main";

export const axiosInstance = axios.create({
    baseURL: BE_BASE_URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = JSON.parse(localStorage.getItem("token"));
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

export const callApi = async ({ method, endpoint, arg, displaySuccessMessage = false, alertErrorMessage = false }) => {
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
        return {
            success: response.data?.success,
            data: response.data?.data,
            message: response.data?.message,
        };
    } catch (error) {
        if (error.status == HTTP_RESPONSE_STATUS_CODE.UNAUTHORIZED) {
            confirm("Unauthorized access. Please log in again.");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        } else if (error.status == HTTP_RESPONSE_STATUS_CODE.FORBIDDENT) {
            alert("You do not have permission to perform this action.");
            window.location.href = "/";
        } else if (alertErrorMessage) {
            alert(error.message || "An error occurred");
        } else {
            throw error;
        }
    } finally {
        store.dispatch(setLoading(false));
    }
};
