import InterviewRoomListPage from "../../features/interview/pages/InterviewRoomListPage/InterviewRoomListPage";
import InterviewRoomPage from "../../features/interview/pages/InterviewRoomPage/InterviewRoomPage";
import EmptyLayout from "../layouts/EmptyLayout";
import ScheduleManagement from "../../features/interviewer/pages/ScheduleManagement";

export const interviewerRoutes = [
    { path: "/interview", element: <InterviewRoomListPage /> },
    { path: "/schedule", element: <ScheduleManagement /> },
    {
        element: <EmptyLayout />,
        children: [{ path: "/interview/room/:roomId", element: <InterviewRoomPage /> }],
    },
];
