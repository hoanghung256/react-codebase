import InterviewerProfilePage from "../../features/profiles/interviewer/page/InterviewerProfilePage";
import ScheduleManagement from "../../features/interviewer/pages/ScheduleManagement";

export const interviewerRoutes = [
    { path: "/profile", element: <InterviewerProfilePage /> },
    { path: "/profile/:id", element: <InterviewerProfilePage /> },
    { path: "/schedule", element: <ScheduleManagement /> },
];
