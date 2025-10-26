import { useEffect, useMemo, useState } from "react";
import { axiosInstance } from "../utils/apiConnector";
import { HTTP_RESPONSE_STATUS_CODE, METHOD } from "../constants/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function useApi({ method, apiEndpoint, displaySuccessMessage = false, arg = null }) {
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const argKey = useMemo(() => JSON.stringify(arg), [arg]);

    useEffect(() => {
        let isMounted = true;
        if (method && apiEndpoint && displaySuccessMessage) {
            callApi(isMounted);
        }
        return () => {
            isMounted = false;
        };
    }, [method, apiEndpoint, displaySuccessMessage, argKey]);

    const callApi = async (isMounted) => {
        setLoading(true);
        setError(null);
        try {
            const isGetOrDelete = method === METHOD.GET || method === METHOD.DELETE;
            const response = await axiosInstance({
                method,
                url: apiEndpoint,
                data: !isGetOrDelete ? arg : null,
                params: isGetOrDelete ? arg : null,
            });

            if (isMounted) {
                if (!response.data.success) {
                    throw new Error(response.data.message);
                }
                if (displaySuccessMessage) {
                    toast.success(response.data.message || "Successful");
                }
                setData(response.data.data);
            }
        } catch (error) {
            if (error.status == HTTP_RESPONSE_STATUS_CODE.UNAUTHORIZED) {
                confirm("Unauthorized access. Please log in again.");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
            }
            if (isMounted) {
                setError(error);
            }
        } finally {
            if (isMounted) {
                setLoading(false);
            }
        }
    };

    return { data, error, loading };
}

export default useApi;
