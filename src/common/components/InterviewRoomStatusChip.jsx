import { Chip } from "@mui/material";
import { interviewRoomStatuses } from "../constants/status";

function InterviewRoomStatusChip({ status }) {
    if (status < 0 || status >= interviewRoomStatuses.length) {
        return <Chip label="Unknown" style={{ backgroundColor: "grey" }} />;
    }

    const statusDisplay = interviewRoomStatuses[status];

    return <Chip label={statusDisplay.name} style={{ backgroundColor: statusDisplay.color }} />;
}

export default InterviewRoomStatusChip;
