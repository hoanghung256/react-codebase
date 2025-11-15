import { BE_BASE_URL } from "../../../../common/constants/env";

export const interviewerProfileEndPoints = {
    VIEW_OWN_INTERVIEWER_PROFILE: BE_BASE_URL + `/interviewer-profile/{id}`,
    VIEW_PROFILE_BY_INTERVIEWEE: BE_BASE_URL + `/interviewer-profile/interviewee/{id}/profile`,
    CREATE_INTERVIEWER_PROFILE: BE_BASE_URL + "/interviewer-profile",
    UPDATE_INTERVIEWER_PROFILE: BE_BASE_URL + `/interviewer-profile/{id}`,
};
