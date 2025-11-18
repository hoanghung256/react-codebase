import App from "../../App";
import InterviewRoomListPage from "../../features/interview/pages/InterviewRoomListPage/InterviewRoomListPage";
import InterviewRoomPage from "../../features/interview/pages/InterviewRoomPage/InterviewRoomPage";
import HomePage from "../../features/home/pages/HomePage";
import AuthLayout from "../layouts/AuthLayout";
import DefaultLayout from "../layouts/DefaultLayout";
import { adminRoutes } from "./adminRoutes";
import { authRoutes } from "./authRoutes";
import { interviewerRoutes } from "./interviewerRoutes";
import { intervieweeRoutes } from "./intervieweeRoutes";
import { Navigate } from "react-router-dom";

export const routes = [
    { element: <AuthLayout />, children: authRoutes },
    {
        element: <DefaultLayout />,
        children: [
            // Startup redirect: root path sends users to interview list
            { path: "/", element: <Navigate to="/home" replace /> },
            { path: "/test", element: <App /> },
            { path: "/interview", element: <InterviewRoomListPage /> },
            { path: "/interview/room/:roomId", element: <InterviewRoomPage /> },
            // You can alternatively expose a HomePage by replacing the redirect above:
            // { path: "/", element: <HomePage /> },
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
    { element: <DefaultLayout />, children: intervieweeRoutes },
];
