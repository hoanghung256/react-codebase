import ProtectedRoute from "../../common/components/ProtectedRoute";
import InterviewerProfilePage from "../../features/profiles/interviewer/page/InterviewerProfilePage";

export const interviewerRoutes = [
    { path: "/profile", element: <InterviewerProfilePage /> },
    { path: "/profile/:id", element: <InterviewerProfilePage /> },
    {
        element: <ProtectedRoute />,
        children: [{ path: "/path", element: null }],
    },
];
