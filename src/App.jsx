import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import useUser from "./common/hooks/useUser";

function App() {
    const user = useUser();
    
    return (
        <div>
            <h1>Hello World</h1>
            <Button variant="contained" color="primary" LinkComponent={Link} to={`/test/${user.id}`}>
                Fetch your first API
            </Button>
            <Button variant="contained" color="secondary" LinkComponent={Link} to={"/signup"} style={{ marginLeft: 16 }}>
                Signup
            </Button>
            <Button variant="contained" color="secondary" LinkComponent={Link} to={"/login"} style={{ marginLeft: 16 }}>
                Login
            </Button>
        </div>
    );
}
export default App;
