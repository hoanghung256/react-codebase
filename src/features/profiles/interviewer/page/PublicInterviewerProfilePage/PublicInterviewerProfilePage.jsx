import { useEffect, useState, useMemo } from "react";
import { callApi } from "../../../../../common/utils/apiConnector";
import { METHOD } from "../../../../../common/constants/api";
import { interviewerProfileEndPoints } from "../../service/interviewerProfileApi";
import { useParams } from "react-router-dom";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Stack,
    Typography,
    Link,
    Paper,
    Skeleton,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LaunchIcon from "@mui/icons-material/Launch";
import StarIcon from "@mui/icons-material/Star";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import BusinessIcon from "@mui/icons-material/Business";
import CodeIcon from "@mui/icons-material/Code";

function PublicInterviewerProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        if (id) fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await callApi({
                method: METHOD.GET,
                endpoint: interviewerProfileEndPoints.VIEW_PROFILE_BY_INTERVIEWEE.replace("{id}", id),
            });
            setProfile(res.data);
        } catch (e) {
            setError("Failed to load profile.");
        } finally {
            setLoading(true);
            setTimeout(() => setLoading(false), 200);
        }
    };

    const avatarLetter = useMemo(() => profile?.user?.fullName?.trim()?.charAt(0)?.toUpperCase() || "?", [profile]);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {loading && (
                <Box display="flex" justifyContent="center" py={6}>
                    <CircularProgress />
                </Box>
            )}

            {!loading && error && (
                <Paper sx={{ p: 3, bgcolor: "error.light" }}>
                    <Typography color="error.contrastText">{error}</Typography>
                </Paper>
            )}

            {!loading && profile && (
                <Grid container spacing={4}>
                    {/* Left column */}
                    <Grid item xs={12} md={8}>
                        <Stack spacing={3}>
                            <Box display="flex">
                                <Avatar
                                    src={profile.user.profilePicture || ""}
                                    alt={profile.user.fullName}
                                    sx={{ width: 96, height: 96, fontSize: 40, mr: 3 }}
                                >
                                    {avatarLetter}
                                </Avatar>
                                <Box flex={1} display="flex" flexDirection="column" justifyContent="center">
                                    <Typography variant="h4" fontWeight={600}>
                                        {profile.user.fullName}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
                                        Senior Interviewer • {profile.experienceYears}+ years of experience
                                    </Typography>
                                    <Stack direction="row" spacing={1} mt={1}>
                                        <Chip
                                            icon={<WorkOutlineIcon />}
                                            label="Backend"
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                        <Chip
                                            icon={<CodeIcon />}
                                            label="System Design"
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                        />
                                    </Stack>
                                </Box>
                            </Box>

                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        About Me
                                    </Typography>
                                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                                        {profile.bio}
                                    </Typography>
                                    <Box mt={2}>
                                        <Link
                                            href={profile.portfolioUrl}
                                            target="_blank"
                                            rel="noopener"
                                            underline="hover"
                                            display="inline-flex"
                                            alignItems="center"
                                            gap={0.5}
                                        >
                                            Portfolio <LaunchIcon fontSize="small" />
                                        </Link>
                                    </Box>
                                </CardContent>
                            </Card>

                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Skills
                                    </Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap">
                                        {profile.skills.map((s) => (
                                            <Chip key={s.id} label={s.name} variant="outlined" />
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>

                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Companies Worked At
                                    </Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap">
                                        {profile.companies.map((c) => (
                                            <Chip
                                                key={c.id}
                                                icon={<BusinessIcon />}
                                                label={c.name}
                                                variant="outlined"
                                                onClick={() => window.open(c.website, "_blank")}
                                                clickable
                                            />
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>

                    {/* Right column */}
                    <Grid item xs={12} md={4}>
                        <Stack spacing={3}>
                            <Card elevation={2} sx={{ position: "sticky", top: 24 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Book an Interview
                                    </Typography>
                                    <Stack spacing={1} mb={2}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <CalendarMonthIcon fontSize="small" />
                                            <Typography variant="body2">1-hour video call</Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <StarIcon fontSize="small" color="warning" />
                                            <Typography variant="body2">Detailed feedback</Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <WorkOutlineIcon fontSize="small" />
                                            <Typography variant="body2">Real-world experience</Typography>
                                        </Stack>
                                    </Stack>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        onClick={() => alert("Implementing")}
                                    >
                                        Book Now
                                    </Button>
                                </CardContent>
                                <Divider />
                                <CardContent>
                                    <Typography variant="caption" color="text.secondary">
                                        You will receive a confirmation email after booking.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>
            )}

            {!loading && !error && !profile && (
                <Box py={6} textAlign="center">
                    <Skeleton variant="rectangular" height={120} />
                    <Typography variant="body2" mt={2}>
                        No data found.
                    </Typography>
                </Box>
            )}
        </Container>
    );
}

export default PublicInterviewerProfilePage;
