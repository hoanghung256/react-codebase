import InterviewRoomListPage from "../../features/interview/pages/InterviewRoomListPage/InterviewRoomListPage";
import InterviewRoomPage from "../../features/interview/pages/InterviewRoomPage/InterviewRoomPage";
import EmptyLayout from "../layouts/EmptyLayout";
import ScheduleManagement from "../../features/interviewer/pages/ScheduleManagement";
import InterviewerProfilePage from "../../features/profiles/interviewer/page/InterviewerProfilePage";
import ScheduleManagement from "../../features/interviewer/pages/ScheduleManagement";

export const interviewerRoutes = [
    { path: "/interview", element: <InterviewRoomListPage /> },
    { path: "/profile", element: <InterviewerProfilePage /> },
    { path: "/profile/:id", element: <InterviewerProfilePage /> },

    { path: "/schedule", element: <ScheduleManagement /> },
];
