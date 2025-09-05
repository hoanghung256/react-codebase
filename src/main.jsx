import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { routes } from "./app/routes/index.jsx";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
    <>
        {/* <StrictMode> */}
        <RouterProvider router={router} />
        <Toaster position="top-right" />
        {/* </StrictMode> */}
    </>,
);
