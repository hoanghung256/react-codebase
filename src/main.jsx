import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { routes } from "./app/routes/index.jsx";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./common/store/index.js";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./common/constants/theme.jsx";

const router = createBrowserRouter(routes);
const store = configureStore({ reducer: rootReducer });

createRoot(document.getElementById("root")).render(
    <ThemeProvider theme={theme}>
        <Provider store={store}>
            <RouterProvider router={router} />
            <Toaster position="top-right" />
        </Provider>
    </ThemeProvider>,
);
