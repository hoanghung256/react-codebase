import App from "../../App";
import InterviewRoomListPage from "../../features/interview/pages/InterviewRoomListPage/InterviewRoomListPage";
import InterviewRoomPage from "../../features/interview/pages/InterviewRoomPage/InterviewRoomPage";
import AuthLayout from "../layouts/AuthLayout";
import DefaultLayout from "../layouts/DefaultLayout";
import { adminRoutes } from "./adminRoutes";
import { authRoutes } from "./authRoutes";
import { interviewerRoutes } from "./interviewerRoutes";

export const routes = [
    { element: <AuthLayout />, children: authRoutes },
    {
        element: <DefaultLayout />,
        children: [
            { path: "/", element: <App /> },
            { path: "/interview", element: <InterviewRoomListPage /> },
            { path: "/interview/room/:roomId", element: <InterviewRoomPage /> },
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
];
