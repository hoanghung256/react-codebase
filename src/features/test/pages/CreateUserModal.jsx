import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress } from "@mui/material";
import { METHOD } from "../../../common/constants/api";
import { testEndPoints } from "../services/testApi";
import { callApi } from "../../../common/utils/apiConnector";

function CreateUserModal({ open, onClose, onSuccess }) {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const createUser = async () => {
        const  { success } = await callApi({
            method: METHOD.POST,
            endpoint: testEndPoints.GET_PROFILE_API,
            displaySuccessMessage: true,
            alertErrorMessage: true,
            arg: { fullname, email, password },
        });

        if (success) {
            onSuccess();
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create User</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Full Name"
                    fullWidth
                    variant="outlined"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {/* {error && <p style={{ color: "red" }}>Error: {error.message}</p>} */}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={createUser}>{false ? <CircularProgress size={20} /> : "Create"}</Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateUserModal;
