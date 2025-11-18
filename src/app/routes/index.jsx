import App from "../../App";
import InterviewRoomListPage from "../../features/interview/pages/InterviewRoomListPage/InterviewRoomListPage";
import InterviewRoomPage from "../../features/interview/pages/InterviewRoomPage/InterviewRoomPage";
import HomePage from "../../features/home/pages/HomePage";
import ScheduleManagement from "../../features/interviewer/pages/ScheduleManagement";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import { authRoutes } from "./authRoutes";
import { intervieweeRoutes } from "./intervieweeRoutes";

export const routes = [
    { element: <AuthLayout />, children: authRoutes },
    {
        element: <MainLayout />,
        children: [
            { path: "/test", element: <App /> },
            { path: "/interview", element: <InterviewRoomListPage /> },
            { path: "/interview/room/:roomId", element: <InterviewRoomPage /> },
            { path: "/schedule", element: <ScheduleManagement /> },
        ],
    },
    {element: <MainLayout />, children: intervieweeRoutes}
];
