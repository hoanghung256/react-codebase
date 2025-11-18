import App from "../../App";
import InterviewRoomListPage from "../../features/interview/pages/InterviewRoomListPage/InterviewRoomListPage";
import InterviewRoomPage from "../../features/interview/pages/InterviewRoomPage/InterviewRoomPage";
import HomePage from "../../features/home/pages/HomePage";
import ScheduleManagement from "../../features/interviewer/pages/ScheduleManagement";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import DefaultLayout from "../layouts/DefaultLayout";
import { adminRoutes } from "./adminRoutes";
import { authRoutes } from "./authRoutes";
import { interviewerRoutes } from "./interviewerRoutes";
import { intervieweeRoutes } from "./intervieweeRoutes";
import { Navigate } from "react-router-dom";
import PublicInterviewerProfilePage from "../../features/profiles/interviewer/page/PublicInterviewerProfilePage/PublicInterviewerProfilePage";

export const routes = [
    { element: <AuthLayout />, children: authRoutes },
    {
        element: <MainLayout />,
        children: [
            // Startup redirect: root path sends users to interview list
            { path: "/", element: <Navigate to="/home" replace /> },
            { path: "/test", element: <App /> },
            { path: "/interview", element: <InterviewRoomListPage /> },
            { path: "/interview/room/:roomId", element: <InterviewRoomPage /> },
            { path: "/schedule", element: <ScheduleManagement /> },
        ],
    },
    {
        element: <DefaultLayout />,
        children: interviewerRoutes,
    },
    {
        element: <DefaultLayout />,
        children: adminRoutes,
    },
    {
        element: <DefaultLayout />,
        children: intervieweeRoutes,
    },
    // Public routes
    {
        element: <DefaultLayout />,
        children: [{ path: "/interviewer/:id", element: <PublicInterviewerProfilePage /> }],
    },
];
