import { testEndPoints } from "../services/testApi";
import useApi from "../../../common/hooks/useApi";
import { METHOD } from "../../../common/constants/api";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

function Test() {
    const { id } = useParams();
    const {
        data: profileData,
        error: getProfileError,
        loading: getProfileLoading,
    } = useApi({
        method: METHOD.GET,
        apiEndpoint: testEndPoints.GET_PROFILE_API,
        displaySuccessMessage: true,
        arg: {
            id: id,
            alo: "ALoooo",
        },
    });

    if (getProfileLoading) {
        return <CircularProgress size={50} />;
    }

    // return minimal UI so this is a valid React component
    return profileData ? (
        <div>
            <h1>Profile ID: {id}</h1>
            {profileData && <pre>{JSON.stringify(profileData, null, 2)}</pre>}
            {getProfileError && <p style={{ color: "red" }}>Error: {getProfileError.message}</p>}
        </div>
    ) : (
        <div>Not found</div>
    );
}

export default Test;
