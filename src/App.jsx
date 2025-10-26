import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

function App() {
    return (
        <div>
            <h1>Hello World</h1>
            <Button variant="contained" color="primary" LinkComponent={Link} to={"/test/1"}>
                Fetch your first API
            </Button>
            <Button variant="contained" color="secondary">
                Secondary Button
            </Button>
        </div>
    );
}
export default App;
