import ScheduleManagement from "../../features/interviewer/pages/ScheduleManagement";
import InterviewerProfilePage from "../../features/profiles/interviewer/page/InterviewerProfilePage";

export const interviewerRoutes = [
    { path: "/profile/:id", element: <InterviewerProfilePage /> },
    { path: "/schedule", element: <ScheduleManagement /> },
];
