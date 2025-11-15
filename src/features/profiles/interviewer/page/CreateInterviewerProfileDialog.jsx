import { Avatar, Dialog, Grid, Typography } from "@mui/material";
import { Form } from "react-router-dom";

function CreateInterviewerProfileDialog() {
    return (
        <Dialog open={true} onClose={() => {}}>
            <Form>
                <Typography variant="h5">Create Interviewer Profile</Typography>
                <Grid>
                    <Avatar src={avatarUrl} alt={fullName} sx={{ width: 96, height: 96 }}></Avatar>
                </Grid>
                <Grid>
                    <TextField
                        label="Full Name"
                        name="fullName"
                        value={fullName}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
                <Grid>
                    <TextField
                        label="Email"
                        name="email"
                        value={email}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
                <Grid>
                    <TextField
                        label="Phone Number"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
                <Button type="submit" variant="contained" color="primary">
                    Create Profile
                </Button>
            </Form>
        </Dialog>
    );
}
export default CreateInterviewerProfileDialog;
