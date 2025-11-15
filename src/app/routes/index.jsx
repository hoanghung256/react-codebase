import App from "../../App";
import InterviewRoomListPage from "../../features/interview/pages/InterviewRoomListPage/InterviewRoomListPage";
import InterviewRoomPage from "../../features/interview/pages/InterviewRoomPage/InterviewRoomPage";
import HomePage from "../../features/home/pages/HomePage";
import AuthLayout from "../layouts/AuthLayout";
import DefaultLayout from "../layouts/DefaultLayout";
import { authRoutes } from "./authRoutes";
import { intervieweeRoutes } from "./intervieweeRoutes";

export const routes = [
    { element: <AuthLayout />, children: authRoutes },
    {
        element: <DefaultLayout />,
        children: [
            { path: "/test", element: <App /> },
            { path: "/interview", element: <InterviewRoomListPage /> },
            { path: "/interview/room/:roomId", element: <InterviewRoomPage /> },
        ],
    },
    {element: <DefaultLayout />, children: intervieweeRoutes}
];
