import ProtectedRoute from "../../common/components/ProtectedRoute";
import LoginPage from "../../features/auth/pages/LoginPage/LoginPage";
import SignUpPage from "../../features/auth/pages/SignUpPage";
import Test from "../../features/test/pages/Test";

export const authRoutes = [
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignUpPage /> },
    { path: "/forget-password", element: null },
    { path: "/reset-password", element: null },
    { path: "/test/:id", element: <Test /> },
    {
        element: <ProtectedRoute />,
        children: [{ path: "/path", element: null }],
    },
];
