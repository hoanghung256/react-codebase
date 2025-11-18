import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ allowedRoles = [], children }) {
    const { token, userData } = useSelector((state) => state.auth);

    console.log('🔒 ProtectedRoute check:', {
        token: !!token,
        userRole: userData?.role,
        allowedRoles,
        hasAccess: allowedRoles.includes(userData?.role)
    });

    if (!token) {
        alert("Session expired. Please log in again.");
        return <Navigate to="/login" />;
    } else if (!allowedRoles.includes(userData?.role)) {
        console.warn('⛔ Access denied - redirecting to /home');
        return <Navigate to="/home" />;
    } else {
        return children;
    }
}

export default ProtectedRoute;
