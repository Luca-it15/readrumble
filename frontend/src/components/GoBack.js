import { useNavigate } from "react-router-dom";
import Button from "@mui/material-next/Button";
import ArrowBack from '@mui/icons-material/KeyboardBackspaceTwoTone';
import { blue } from "@mui/material/colors";

export default function GoBack() {

    const navigate = useNavigate();

    function handleGoBack() {
        navigate(-1);
    }

    return (
        <Button onClick={handleGoBack} startIcon={<ArrowBack
            sx={{ width: "35px", height: "35px", color: blue[500] }}/>} sx={{ '&:hover': { backgroundColor: blue[50] } }} >
        </Button>
    );
}