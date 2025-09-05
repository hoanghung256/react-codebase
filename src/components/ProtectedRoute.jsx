import { Outlet } from "react-router-dom";

function ProtectedRoute() {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);

    if (!token || !user) {
        return <Navigate to="/login" />;
    } else {
        return <Outlet />;
    }
}

export default ProtectedRoute;
