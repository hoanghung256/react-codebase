import Test from "../../features/test/pages/Test";
import HomePage from "../../features/home/pages/HomePage";
import InterviewRoomListPage from "../../features/interview/pages/InterviewRoomListPage/InterviewRoomListPage";
import InterviewRoomPage from "../../features/interview/pages/InterviewRoomPage/InterviewRoomPage";
import EmptyLayout from "../layouts/EmptyLayout";

export const intervieweeRoutes = [
    { path: "/test/:id", element: <Test /> },
    { path: "/home", element: <HomePage /> },
    { path: "/interview", element: <InterviewRoomListPage /> },
    {
        element: <EmptyLayout />,
        children: [{ path: "/interview/room/:roomId", element: <InterviewRoomPage /> }],
    },
];
