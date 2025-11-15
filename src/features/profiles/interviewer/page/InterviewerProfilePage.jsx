import React, { useEffect, useMemo, useState } from "react";
import useUser from "../../../../common/hooks/useUser";
import { callApi } from "../../../../common/utils/apiConnector";
import { METHOD } from "../../../../common/constants/api";
import { interviewerProfileEndPoints } from "../service/interviewerProfileApi";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Link,
    Rating,
    Stack,
    Typography,
} from "@mui/material";

function safeArray(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return [];
}

function InterviewerProfilePage() {
    const user = useUser();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedBio, setExpandedBio] = useState(false);

    const endpoint = useMemo(() => {
        if (!user?.id) return null;
        // If current user is interviewer (role 1 or "interviewer"), load own profile, else load by interviewee.
        const isInterviewer = user?.role === 1 || String(user?.role).toLowerCase() === "interviewer";
        return isInterviewer
            ? interviewerProfileEndPoints.VIEW_OWN_INTERVIEWER_PROFILE.replace("{id}", user.id)
            : interviewerProfileEndPoints.VIEW_PROFILE_BY_INTERVIEWEE.replace("{id}", user.id);
    }, [user?.id, user?.role]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!endpoint) return;
            setLoading(true);
            setError(null);
            try {
                const { success, data, message } = await callApi({ method: METHOD.GET, endpoint });
                if (success) {
                    setProfile(data);
                } else {
                    setError(message || "Failed to load profile");
                }
            } catch (err) {
                setError(err.message || "An error occurred while fetching the profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [endpoint]);

    if (!user) return <Typography sx={{ p: 2 }}>Please login to view your profile.</Typography>;

    const avatarUrl = profile?.user?.profilePicture || profile?.avatar || "";
    const fullName = profile?.user?.fullName || profile?.fullName || user?.fullName || "Unnamed";
    const email = profile?.user?.email || user?.email || "-";
    const years = profile?.experienceYears ?? profile?.yearsOfExperience;
    const bio = profile?.bio || profile?.description || "";
    const skills = safeArray(profile?.skills)
        .map((s) => (typeof s === "string" ? s : s?.name))
        .filter(Boolean);
    const companies = safeArray(profile?.companies)
        .map((c) => (typeof c === "string" ? c : c?.name))
        .filter(Boolean);
    const industries = safeArray(profile?.industries)
        .map((i) => (typeof i === "string" ? i : i?.name))
        .filter(Boolean);
    const roles = [
        user?.role === 1 || String(user?.role).toLowerCase() === "interviewer" ? "Interviewer" : "Interviewee",
    ];
    const rating = profile?.rating; // show only if backend provides it

    const truncatedBio = useMemo(() => {
        if (!bio) return "";
        if (bio.length <= 240) return bio;
        return expandedBio ? bio : bio.slice(0, 240) + "...";
    }, [bio, expandedBio]);

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: "auto" }}>
            <Card elevation={0} sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item>
                            <Avatar src={avatarUrl} alt={fullName} sx={{ width: 96, height: 96 }} />
                        </Grid>
                        <Grid item xs>
                            <Stack spacing={0.5}>
                                <Typography variant="h5" fontWeight={700}>
                                    {fullName}
                                </Typography>
                                {years != null && (
                                    <Typography color="text.secondary">{years} years of experience</Typography>
                                )}
                                {typeof rating === "number" && (
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Rating
                                            name="profile-rating"
                                            value={rating}
                                            precision={0.1}
                                            readOnly
                                            size="small"
                                        />
                                        <Typography color="text.secondary" variant="body2">
                                            {rating.toFixed(1)}
                                        </Typography>
                                    </Stack>
                                )}
                            </Stack>
                        </Grid>
                        <Grid item xs="auto" sx={{ ml: "auto" }}>
                            <Button variant="contained" href="/interviewer/profile/edit">
                                Edit Profile
                            </Button>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 2 }}>
                        {loading && (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CircularProgress size={20} />
                                <Typography>Loading profile…</Typography>
                            </Stack>
                        )}
                        {error && (
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        )}
                    </Box>

                    {profile && (
                        <>
                            {bio && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                                        {truncatedBio}
                                    </Typography>
                                    {bio.length > 240 && (
                                        <Link
                                            component="button"
                                            type="button"
                                            onClick={() => setExpandedBio((v) => !v)}
                                            sx={{ mt: 1 }}
                                        >
                                            {expandedBio ? "Show less" : "Read more"}
                                        </Link>
                                    )}
                                </Box>
                            )}

                            <Divider sx={{ my: 3 }} />

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <InfoRow label="Email" content={email} />
                                    {profile?.portfolioUrl && (
                                        <InfoRow
                                            label="Portfolio"
                                            content={
                                                <Link href={profile.portfolioUrl} target="_blank" rel="noopener">
                                                    {profile.portfolioUrl}
                                                </Link>
                                            }
                                        />
                                    )}
                                    {profile?.cvUrl && (
                                        <InfoRow
                                            label="CV"
                                            content={
                                                <Link href={profile.cvUrl} target="_blank" rel="noopener">
                                                    {profile.cvUrl}
                                                </Link>
                                            }
                                        />
                                    )}
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    {roles.length > 0 && <ChipRow label="Roles" items={roles} />}
                                    {skills.length > 0 && <ChipRow label="Skills" items={skills} />}
                                    {industries.length > 0 && <ChipRow label="Industries" items={industries} />}
                                    {companies.length > 0 && <ChipRow label="Companies" items={companies} />}
                                </Grid>
                            </Grid>
                        </>
                    )}

                    {!loading && !profile && !error && (
                        <Typography color="text.secondary">No profile found.</Typography>
                    )}
                </CardContent>
            </Card>

            {process.env.NODE_ENV === "development" && profile && (
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                            Raw profile data
                        </Typography>
                        <Box
                            component="pre"
                            sx={{ m: 0, p: 2, bgcolor: (t) => t.palette.action.hover, overflowX: "auto" }}
                        >
                            {JSON.stringify(profile, null, 2)}
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}

function InfoRow({ label, content }) {
    return (
        <Stack spacing={0.5} sx={{ mb: 2 }}>
            <Typography variant="overline" color="text.secondary">
                {label}
            </Typography>
            {typeof content === "string" ? <Typography>{content}</Typography> : content}
        </Stack>
    );
}

function ChipRow({ label, items }) {
    return (
        <Stack spacing={1} sx={{ mb: 2 }}>
            <Typography variant="overline" color="text.secondary">
                {label}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {items.map((item, idx) => (
                    <Chip key={`${label}-${idx}`} label={item} size="small" />
                ))}
            </Stack>
        </Stack>
    );
}

export default InterviewerProfilePage;
