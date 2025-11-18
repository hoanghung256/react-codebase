import { useState, useEffect } from "react";
import {
    Alert,
    Modal,
    Box,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Rating,
    TextField,
    Button,
    Stack,
} from "@mui/material";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import { callApi } from "../../../../common/utils/apiConnector.js";
import { METHOD } from "../../../../common/constants/api.js";
import { interviewEndPoints } from "../../services/interviewRoomApi";

function FeedbackListModal({ open, onClose, onFeedbackSubmitted, mode = 'pending' }) {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [rating, setRating] = useState(0);
    const [comments, setComments] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFeedbacks = async () => {
            setLoading(true);
            try {
                const res = await callApi({
                    method: METHOD.GET,
                    endpoint: interviewEndPoints.GET_FEEDBACKS,
                });
                const feedbackData = res?.data?.items;
                if (feedbackData) {
                    if (mode === 'pending') {
                        // Filter for feedbacks that are not yet completed
                        const pending = feedbackData.filter(fb => !fb.comments || fb.comments.trim() === '');
                        setFeedbacks(pending);
                        if (pending.length === 1) { // Automatically select if only one pending
                            handleFeedbackSelect(pending[0]);
                        }
                    } else {
                        // Show all feedbacks
                        setFeedbacks(feedbackData);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch feedbacks:", error);
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            fetchFeedbacks();
        }
    }, [open, mode]); // handleFeedbackSelect is stable

    const handleFeedbackSelect = (feedback) => {
        setSelectedFeedback(feedback);
        setRating(feedback.rating || 0);
        setComments(feedback.comments || '');
        setError(''); // Clear previous errors when selecting a new item
    };

    const handleRatingChange = (event, newRating) => {
        setRating(newRating);
    };

    const handleCommentsChange = (event) => {
        setComments(event.target.value);
    };

    const handleSubmit = async () => {
        if (!selectedFeedback) return;

        try {
            setError(''); // Reset error before new submission
            await callApi({
                method: METHOD.PUT,
                endpoint: interviewEndPoints.UPDATE_FEEDBACK(selectedFeedback.id),
                arg: { rating: rating, comments: comments },
            });
            
            // Notify parent component to re-fetch data and check pending status
            if (onFeedbackSubmitted) {
                onFeedbackSubmitted();
            }

            const updatedFeedbacks = feedbacks.filter((fb) => fb.id !== selectedFeedback.id).map(fb => fb.id === selectedFeedback.id ? {...fb, comments, rating} : fb);
            setFeedbacks(updatedFeedbacks);

            // Reset form state
            setSelectedFeedback(null);
            setRating(0);
            setComments('');

            // If in pending mode and this was the last one, close the modal
            if (mode === 'pending' && updatedFeedbacks.length === 0) {
                onClose();
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update feedback. Please try again.";
            setError(errorMessage);
            console.error("Failed to update feedback:", error.response?.data || error);
        }
    };

    const handleClose = (event, reason) => {
        const hasPending = mode === 'pending' && feedbacks.length > 0;
        if (hasPending && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
            // Prevent closing the modal if there are pending feedbacks
            return;
        }
        onClose();
    };

    const hasPendingFeedbacks = mode === 'pending' && feedbacks.length > 0;


    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="feedback-list-modal"
            aria-describedby="feedback-submission-form"
        >
            <Box sx={style}>
                <Typography id="feedback-list-modal" variant="h6" component="h2">
                    {mode === 'pending' ? 'Pending Feedbacks' : 'All Feedbacks'}
                </Typography>
                {loading ? (
                    <Typography>Loading feedbacks...</Typography>
                ) : (
                    <>
                        {feedbacks.length === 0 ? (
                            <Typography color="text.secondary" sx={{ mt: 2 }}>{mode === 'pending' ? 'No pending feedbacks.' : 'No feedbacks found.'}</Typography>
                        ) : (
                            <List>
                                {feedbacks.map((feedback) => (
                                    <ListItem
                                        button
                                        key={feedback.id}
                                        onClick={() => handleFeedbackSelect(feedback)}
                                        selected={selectedFeedback?.id === feedback.id}
                                        sx={{
                                            ...(selectedFeedback?.id === feedback.id && {
                                                bgcolor: 'action.selected',
                                            })
                                        }}
                                    >
                                        <ListItemIcon>
                                            <RateReviewOutlinedIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={`Feedback for Room: ${feedback.interviewRoomId}`}
                                            secondary={
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    spacing={0.5}
                                                    sx={{ color: feedback.comments ? 'success.main' : 'warning.main' }}
                                                >
                                                    {feedback.comments ? <CheckCircleOutlineIcon sx={{ fontSize: '1rem' }} /> : <PendingActionsOutlinedIcon sx={{ fontSize: '1rem' }} />}
                                                    <Typography variant="body2" component="span">
                                                        {feedback.comments ? `Completed - Rating: ${feedback.rating}/5` : 'Pending'}
                                                    </Typography>
                                                </Stack>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </>
                )}

                {selectedFeedback && (
                    <Box component="form" mt={2} noValidate autoComplete="off">
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <Typography variant="h6">
                            {selectedFeedback.comments ? `View Feedback for Room: ${selectedFeedback.interviewRoomId}` : `Submit Feedback for Room: ${selectedFeedback.interviewRoomId}`}
                        </Typography>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <Rating name="feedback-rating" value={rating} onChange={handleRatingChange} readOnly={!!selectedFeedback.comments} />
                            <TextField
                                label="Comments"
                                multiline
                                rows={4}
                                fullWidth
                                value={comments}
                                onChange={handleCommentsChange} // This is fine, as the whole field is disabled
                                margin="normal"
                                disabled={!!selectedFeedback.comments}
                                InputProps={{
                                    readOnly: !!selectedFeedback.comments,
                                }}
                            />
                            {!selectedFeedback.comments && <Button variant="contained" color="primary" onClick={handleSubmit}>
                                Submit Feedback
                            </Button>}
                        </Stack>
                    </Box>
                )}
                {!hasPendingFeedbacks && (
                    <Button onClick={onClose} sx={{ mt: 2 }}>
                        Close
                    </Button>
                )}
            </Box>
        </Modal>
    );
}

export default FeedbackListModal;