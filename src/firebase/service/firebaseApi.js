import { BE_BASE_URL } from "../../common/constants/env";

export const firebaseEndPoints = {
    UPLOAD_AVATAR: BE_BASE_URL + "/firebase/upload-avatar/{id}",
    GET_AVATAR: BE_BASE_URL + "/firebase/get-avatar/{id}",
    DELETE_AVATAR: BE_BASE_URL + "/firebase/delete-avatar/{id}",
};
