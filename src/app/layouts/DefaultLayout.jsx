import { Link, Outlet, useNavigate } from "react-router-dom";
import ScrollTopFab from "./ScrollTopFab";
import useUser from "../../common/hooks/useUser";
import { AppBar, Toolbar, Container, Typography, Box, CssBaseline, Button, Avatar } from "@mui/material";
import { useDispatch } from "react-redux";
import { setToken, setUserData } from "../../common/store/authSlice";

const DefaultLayout = () => {
    const user = useUser();
    const avatarUrl = user?.profilePicture || "";
    // const fullName = user?.fullName || "Guest";
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch(setUserData(null));
        dispatch(setToken(null));
        navigate("/");
    };

    return (
        <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
            <CssBaseline />
            {/* Header */}
            <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ py: 1.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1 }}>
                            Intervu
                        </Typography>
                        <Link to="/profile">
                            <Avatar src={avatarUrl} alt="Profile" variant="body2" color="text.secondary" />
                        </Link>
                        <Button variant="outlined" sx={{ ml: 2 }} onClick={logout}>
                            Sign Out
                        </Button>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Main */}
            <Box component="main" sx={{ flex: 1 }}>
                <Container>
                    <Outlet />
                </Container>
            </Box>

            {/* Footer */}
            <Box component="footer" sx={{ borderTop: 1, borderColor: "divider", bgcolor: "background.default" }}>
                <Container maxWidth="lg" sx={{ py: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} Intervu. All rights reserved.
                    </Typography>
                </Container>
            </Box>

            <ScrollTopFab />
        </Box>
    );
};

export default DefaultLayout;
