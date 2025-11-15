import ProtectedRoute from "../../common/components/ProtectedRoute";
import Test from "../../features/test/pages/Test";
import { ROLES } from "../../common/constants/common";
import HomePage from "../../features/home/pages/HomePage";

export const intervieweeRoutes = [
    { path: "/test/:id", element: <Test /> },
    { path: "/home", element: <HomePage /> }
];
