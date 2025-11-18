import {
    Card,
    CardContent,
    Grid,
    Box,
    Typography,
    Avatar,
    Chip,
    Stack,
    Skeleton,
    Button,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CodeIcon from "@mui/icons-material/Code";
import { interviewEndPoints } from "../../services/interviewRoomApi";
import { useNavigate } from "react-router-dom";
import { formattedDateTime } from "../../../../common/utils/dateFormatter";
import useUser from "../../../../common/hooks/useUser.jsx";
import { callApi } from "../../../../common/utils/apiConnector.js";
import { METHOD } from "../../../../common/constants/api.js";
import { useEffect, useState } from "react";
import { INTERVIEW_ROOM_STATUS } from "../../../../common/constants/status.js";
import { ROLES } from "../../../../common/constants/common.js";
import FeedbackListModal from "./FeedbackListModal.jsx"; // Import the FeedbackListModal

function InterviewRoomListPage() {
    const user = useUser();
    const [upcomingRooms, setUpcomingRooms] = useState([]);
    const [pastRooms, setPastRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasPendingFeedbacks, setHasPendingFeedbacks] = useState(false);
    const [feedbackModalState, setFeedbackModalState] = useState({ open: false, mode: 'pending' }); // 'pending' or 'all'

    useEffect(() => {
        if (user) {
            fetchRooms();
            // Check for pending feedbacks only if the user is an interviewee
            if (user.role === ROLES.INTERVIEWEE) {
                checkPendingFeedbacks();
            }
        }
    }, [user]);

    const fetchRooms = async () => {
        setLoading(true);
        const res = await callApi({
            method: METHOD.GET,
            endpoint: interviewEndPoints.INTERVIEW_ROOMS,
        });
        const interviewRooms = res?.data || [];

        if (interviewRooms) {
            setUpcomingRooms(
                interviewRooms.filter(
                    (room) =>
                        room.status === INTERVIEW_ROOM_STATUS.SCHEDULED ||
                        room.status === INTERVIEW_ROOM_STATUS.ON_GOING,
                ),
            );
            setPastRooms(interviewRooms.filter((room) => room.status === INTERVIEW_ROOM_STATUS.COMPLETED));
        }
        setLoading(false);
    };

    const checkPendingFeedbacks = async () => {
        try {
            const res = await callApi({
                method: METHOD.GET,
                endpoint: interviewEndPoints.GET_FEEDBACKS,
            });
            if (res?.data) {
                const pending = res.data.items.filter(fb => !fb.comments || fb.comments.trim() === '');
                if (pending.length > 0) {
                    setHasPendingFeedbacks(true);
                    setFeedbackModalState({ open: true, mode: 'pending' }); // Open modal automatically if pending feedbacks exist
                } else {
                    setHasPendingFeedbacks(false);
                }
            }
        } catch (error) {
            console.error("Failed to check pending feedbacks:", error);
        }
    };

    const handleOpenFeedbackModal = (mode) => setFeedbackModalState({ open: true, mode });
    const handleCloseFeedbackModal = () => setFeedbackModalState({ open: false, mode: 'pending' });

    if (loading) return <RoomsSkeleton />;

    return (
        <Box sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h5">Upcoming Interviews</Typography>
                {user?.role === ROLES.INTERVIEWEE && ( // Only show buttons for interviewee
                    <Stack direction="row" spacing={2}>
                        {/*<Button*/}
                        {/*    variant="contained"*/}
                        {/*    onClick={() => handleOpenFeedbackModal('pending')}*/}
                        {/*    disabled={!hasPendingFeedbacks}*/}
                        {/*>*/}
                        {/*    {hasPendingFeedbacks ? "View Pending Feedbacks" : "No Pending Feedbacks"}*/}
                        {/*</Button>*/}
                        <Button variant="outlined" onClick={() => handleOpenFeedbackModal('all')}>
                            View All Feedbacks
                        </Button>
                    </Stack>
                )}
            </Stack>

            {upcomingRooms.length === 0 ? (
                <Typography color="text.secondary">No upcoming interviews.</Typography>
            ) : (
                <Grid container spacing={2}>
                    {upcomingRooms.map((room) => (
                        <RoomCard key={room.id} user={user} room={room} />
                    ))}
                </Grid>
            )}

            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                Past Interviews
            </Typography>

            {pastRooms.length === 0 ? (
                <Typography color="text.secondary">No past interviews.</Typography>
            ) : (
                <Grid container spacing={2}>
                    {pastRooms.map((room) => (
                        <RoomCard key={room.id} user={user} room={room} />
                    ))}
                </Grid>
            )}
            <FeedbackListModal
                open={feedbackModalState.open}
                onClose={handleCloseFeedbackModal}
                mode={feedbackModalState.mode}
                onFeedbackSubmitted={checkPendingFeedbacks} // Re-check feedbacks after one is submitted
            />
        </Box>
    );
}

function RoomsSkeleton() {
    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
                {[...Array(3)].map((_, i) => (
                    <Grid item xs={12} md={6} lg={4} key={i}>
                        <Card sx={{ height: "100%" }}>
                            <CardContent>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Skeleton variant="circular" width={40} height={40} />
                                    <Box sx={{ flex: 1 }}>
                                        <Skeleton width="70%" height={20} />
                                        <Skeleton width="50%" height={16} sx={{ mt: 1 }} />
                                    </Box>
                                    <Skeleton variant="rounded" width={70} height={24} />
                                </Stack>

                                <Stack spacing={1} direction="row" alignItems="center" sx={{ mt: 2 }}>
                                    <Skeleton width={90} height={14} />
                                    <Skeleton width={50} height={14} />
                                    <Skeleton width={40} height={14} />
                                </Stack>

                                <Skeleton width="100%" height={16} sx={{ mt: 2 }} />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

function RoomCard({ user, room }) {
    const navigate = useNavigate();

    const getParticipantLabel = (room) => {
        if (user.role === ROLES.INTERVIEWEE) return `Interview with: ${room.interviewerId}`;
        if (user.role === ROLES.INTERVIEWER) return `Interview with: ${room.studentId}`;
        return `Interview with interviewer:${room.interviewerId} / interviewee:${room.intervieweeId}`;
    };

    return (
        <Grid item xs={12} md={6} lg={4} key={room.id}>
            <Card
                sx={{ cursor: "pointer", height: "100%", display: "flex", flexDirection: "column" }}
                onClick={() => {
                    if (
                        room.status === INTERVIEW_ROOM_STATUS.ON_GOING ||
                        room.status === INTERVIEW_ROOM_STATUS.COMPLETED
                    ) {
                        navigate(`/interview/room/${room.id}`);
                    }
                }}
            >
                <CardContent sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: "primary.main" }}>{room.interviewerId ?? "I"}</Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ lineHeight: 1 }}>
                                {room.problemShortName || "Interview"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {getParticipantLabel(room)}
                            </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }} />
                        <Chip
                            label={room.status === 0 ? "Scheduled" : room.status === 1 ? "Ongoing" : "Completed"}
                            color={room.status === 0 ? "info" : room.status === 1 ? "success" : "default"}
                            size="small"
                        />
                    </Stack>

                    <Stack spacing={1} direction="row" alignItems="center" sx={{ mt: 1, mb: 1 }}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <AccessTimeIcon fontSize="small" />
                            <Typography variant="caption">{formattedDateTime(room.scheduledTime)}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ ml: 1 }}>
                            <Typography variant="caption">• {room.durationMinutes ?? 60} min</Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ ml: 1 }}>
                            <CodeIcon fontSize="small" />
                            <Typography variant="caption">{room.currentLanguage || "—"}</Typography>
                        </Stack>
                    </Stack>

                    {room.status === INTERVIEW_ROOM_STATUS.COMPLETED && room.problemDescription && (
                        <Typography
                            variant="body2"
                            sx={{
                                mt: 1,
                                maxWidth: 200,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {room.problemDescription}
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Grid>
    );
}

export default InterviewRoomListPage;
