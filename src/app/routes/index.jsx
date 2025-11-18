import MainLayout from "../layouts/MainLayout";
import DefaultLayout from "../layouts/DefaultLayout";
import { adminRoutes } from "./adminRoutes";
import { authRoutes } from "./authRoutes";
import { interviewerRoutes } from "./interviewerRoutes";
import { intervieweeRoutes } from "./intervieweeRoutes";
import { Navigate } from "react-router-dom";
import PublicInterviewerProfilePage from "../../features/profiles/interviewer/page/PublicInterviewerProfilePage/PublicInterviewerProfilePage";
import EmptyLayout from "../layouts/EmptyLayout";
import ProtectedRoute from "../../common/components/ProtectedRoute";
import { ROLES } from "../../common/constants/common";
import HomePage from "../../features/home/pages/HomePage";
import UserProfilePage from "../../features/profile/pages/UserProfilePage";

export const routes = [
    { path: "/", element: <Navigate to="/home" replace /> },
    { element: <EmptyLayout />, children: authRoutes },
    // Profile route - accessible by all authenticated users
    {
        element: (
            <ProtectedRoute allowedRoles={[ROLES.INTERVIEWEE, ROLES.INTERVIEWER, ROLES.ADMIN]}>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: "/profile", element: <UserProfilePage /> }
        ],
    },
    {
        element: (
            <ProtectedRoute allowedRoles={[ROLES.INTERVIEWEE]}>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: intervieweeRoutes,
    },
    {
        element: (
            <ProtectedRoute allowedRoles={[ROLES.INTERVIEWER]}>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: interviewerRoutes,
    },
    {
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: adminRoutes,
    },
    // Public routes
    {
        element: <DefaultLayout />,
        children: [
            { path: "/interviewer/:id", element: <PublicInterviewerProfilePage /> }
        ],
    },
];
