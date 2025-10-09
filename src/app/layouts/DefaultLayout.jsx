import { Outlet } from "react-router-dom";
import ScrollTopFab from "./ScrollTopFab";

const DefaultLayout = () => {
    return (
        <>
            <Outlet />
            <ScrollTopFab />
        </>
    );
};

export default DefaultLayout;
