import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";



export default function GoBack() {
     
     const navigate = useNavigate(); 

     function handleGoBack() {
          navigate(-1); 
     }
    return (
        <Button onClick={handleGoBack} startIcon={<ArrowBack sx={{width: "35px", height: "35px"}}/>}>
        </Button>
    ); 
}