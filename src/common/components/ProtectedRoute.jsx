import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ allowedRoles, children }) {
    const { token, userData } = useSelector((state) => state.auth);

    if (!token || !allowedRoles.includes(userData.role)) {
        alert("Access Denied. Please login with appropriate credentials.");
        return <Navigate to="/login" />;
    } else {
        return children;
    }
}

export default ProtectedRoute;
