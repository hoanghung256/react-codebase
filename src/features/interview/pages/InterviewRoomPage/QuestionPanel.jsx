import { useState, useEffect, useCallback } from "react";
import { Box, Typography, Paper, TextField } from "@mui/material";

function QuestionPanel({ conn, roomId }) {
    const [text, setText] = useState(
        "Welcome to the shared whiteboard! Both interviewer and interviewee can edit this space collaboratively.",
    );

    useEffect(() => {
        if (!conn) return;

        const handleReceiveWhiteboardText = (receivedText) => {
            console.log("Received whiteboard text:", receivedText);
            setText(receivedText);
        };

        conn.on("ReceiveWhiteboardText", handleReceiveWhiteboardText);

        return () => {
            conn.off("ReceiveWhiteboardText", handleReceiveWhiteboardText);
        };
    }, [conn]);

    const sendText = useCallback(
        debounce(async (newText) => {
            if (conn && roomId) {
                try {
                    await conn.invoke("SendWhiteboardText", roomId, newText);
                    console.log("Sent whiteboard text:", newText);
                } catch (error) {
                    console.error("Error sending whiteboard text:", error);
                }
            }
        }, 500), // Debounce 500ms to avoid too many requests
        [conn, roomId],
    );

    const handleTextChange = (e) => {
        const newText = e.target.value;
        setText(newText);
        sendText(newText);
    };

    // Simple debounce implementation
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                p: 2,
            }}
        >
            <Typography variant="h6" sx={{ mb: 2 }}>
                Whiteboard
            </Typography>

            <Paper
                elevation={0}
                sx={{
                    flex: 1,
                    // p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    overflow: "auto",
                }}
            >
                <TextField
                    fullWidth
                    multiline
                    rows={20}
                    value={text}
                    onChange={handleTextChange}
                    placeholder="Start typing here... Both sides can edit this whiteboard collaboratively."
                    variant="outlined"
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            height: "100%",
                            alignItems: "flex-start",
                        },
                        "& .MuiOutlinedInput-input": {
                            height: "100% !important",
                        },
                    }}
                />
            </Paper>
        </Box>
    );
}

export default QuestionPanel;
