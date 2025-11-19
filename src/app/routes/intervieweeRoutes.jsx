import Test from "../../features/test/pages/Test";
import HomePage from "../../features/home/pages/HomePage";

export const intervieweeRoutes = [
    { path: "/test/:id", element: <Test /> },
    { path: "/home", element: <HomePage /> },
];
