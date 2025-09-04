import axios from "axios";
import { log } from "log";

export const axiosInstance = axios.create({});

export const apiConnector = (method, url, bodyData, headers, params) => {
    const res = axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params: params ? params : null,
    });

    res.then((data) => {
        log(data);
    }).catch((error) => {
        if (error.status == 401) {
            log("Unauthorized");
            // dispatch(setToken(null));
            // dispatch(setUser(null));
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
        }
        log(error);
    });

    return res;
};
