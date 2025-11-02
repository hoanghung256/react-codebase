import { Button, Card, CircularProgress } from "@mui/material";
import useQueryApi from "../../../../common/hooks/useQueryApi";
import { interviewEndPoints } from "../../services/interviewRoomApi";
import InterviewRoomStatusChip from "../../../../common/components/InterviewRoomStatusChip";
import { useNavigate } from "react-router-dom";
import { formattedDateTime } from "../../../../common/utils/dateFormatter";
import useUser from "../../../../common/hooks/useUser.jsx";

function InterviewRoomListPage() {
    const user = useUser();
    const {
        data: interviewRooms,
        loading,
        error,
    } = useQueryApi({
        endPoint: interviewEndPoints.INTERVIEW_ROOMS,
        displaySuccessMessage: false,
        trigger: true,
        param: {
            userId: user.id,
            role : user.role,
        },
    });
    const navigate = useNavigate();

    if (loading) {
        return <CircularProgress size={50} />;
    }

    return (
        <div>
            <h2>Interview Rooms</h2>
            <Button variant="contained" onClick={() => setOpenCreateModal(true)}>
                Create
            </Button>
            {interviewRooms?.map((room) => (
                <div key={room.id} onClick={() => navigate(`/interview/room/${room.id}`)}>
                    <Card>
                        {user.role === 0 ? (
                            <h3>Interview with interviewerId: {room.interviewerId}</h3>
                        ) : user.role === 1 ? (
                            <h3>Interview with intervieweeId: {room.studentId}</h3>
                        ) : (
                            <h3>
                                Interview with interviewerId: {room.interviewerId} and intervieweeId: {room.intervieweeId}
                            </h3>
                        )}
                        <p>Time: {formattedDateTime(room.scheduledTime)}</p>
                        <InterviewRoomStatusChip status={room.status} />
                    </Card>
                </div>
            ))}
        </div>
    );
}

export default InterviewRoomListPage;
