import { BE_BASE_URL } from "../../../common/constants/env";
import { apiConnector } from "../../../common/utils/apiConnector";
import { METHOD } from "../../../common/constants/api";
import { log } from "../../../common/utils/log";

export const testEndPoints = {
    GET_PROFILE_API: "/test",
    // SIGN_UP_API: BE_BASE_URL + "/auth/signup",
};

// export async function getProfile({ token, userId }) {
//     try {
//         const headers = token ? { Authorization: `Bearer ${token}` } : null;
//         const response = await apiConnector(METHOD.GET, endPoints.GET_PROFILE_API, null, headers, { id: userId });

//         // if (response.)
//         return response.data;
//     } catch (error) {
//         log("GET_PROFILE_API ERROR: ", error);
//         throw error;
//     }
// }
