import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ allowedRoles, children }) {
    const { token, userData } = useSelector((state) => state.auth);

    if (!token || !allowedRoles.includes(userData.role)) {
        return <Navigate to="/login" />;
    } else {
        return children;
    }
}

export default ProtectedRoute;
