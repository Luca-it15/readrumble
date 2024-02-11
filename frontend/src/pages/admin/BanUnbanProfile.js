import React, {useState, useEffect} from 'react';
import {Container, Typography, Paper, Alert} from '@mui/material';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import '../../App.css'
import Button from "@mui/material-next/Button";
import {red} from "@mui/material/colors";
import GoBack from "../../components/GoBack";

function BanUnbanProfile() {
    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        margin: '20px 10px 0px 10px',
        "width": "50%",
        "position": "relative",
        "left": "25%",
        borderRadius: 18,
        textAlign: 'center'
    }

    const PaperStyle1 = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        width: '80%',
        "position": "relative",
        "left": "10%",
        margin: '20px 10px 0px 10px',
        borderRadius: 18,
        textAlign: 'center'
    }

    const PaperStyleBan = {
        backgroundColor: 'Firebrick',
        color: 'white',
        padding: '10px',
        width: "50%",
        "position": "relative",
        "left": "25%",
        margin: '20px 10px 0px 10px',
        borderRadius: 18,
        textAlign: 'center',
        transition: 'background-color 0.3s ease'
    };

    const PaperStyleBanHover = {
        backgroundColor: 'DarkRed',
        color: 'white',
        padding: '10px',
        width: "50%",
        "position": "relative",
        "left": "25%",
        margin: '20px 10px 0px 10px',
        borderRadius: 18,
        textAlign: 'center',
        transition: 'background-color 0.3s ease'
    };

    const {name} = useParams();
    const navigate = useNavigate();
    const [banStatus, setBanStatus] = useState({
        message: '',
        variant: 'success'
    })
    const [data, setData] = useState([]);
    const [isBanned, setIsBanned] = useState(false);
    const [ButtonPaperStyle, setButtonPaperStyle] = useState(PaperStyleBan);

    function goBan() {
        var messager = '';
        if (isBanned) {
            axios.post("http://localhost:8080/api/admin/user/unban", name)
                .then(response => {
                    messager = response.data;
                    setBanStatus({message: messager, variant: 'success'});
                    setTimeout(() => {
                        setBanStatus({messagge: '', variant: 'success'});
                    }, 2000)
                    setIsBanned(!isBanned);
                })
        } else {
            axios.post("http://localhost:8080/api/admin/user/ban", name)
                .then(response => {
                    messager = response.data;
                    setBanStatus({message: messager, variant: 'success'});
                    setTimeout(() => {
                        setBanStatus({messagge: '', variant: 'success'});
                    }, 2000)
                    setIsBanned(!isBanned);
                })
        }


    }

    function getUserState() {
        axios.post("http://localhost:8080/api/admin/user/search_user", name)
            .then(response => {

                const jsonData = JSON.parse(JSON.stringify(response.data));
                if (jsonData === '') {
                    localStorage.setItem("admin_search_response", "NO")
                    navigate("/admin_user");
                }
                setData(jsonData);
                if (jsonData.isBanned == 0) {
                    setIsBanned(false);
                } else {
                    setIsBanned(true);
                }

            }).catch(error => console.error(error));
    }

    useEffect(() => {
        getUserState()
    }, []);

    return (
        <Container alignItems="center">
            <Paper elevation={2} style={PaperStyle1}>
                <GoBack/>
                <Typography variant="h5">Ban/Unban the user: {data.id}</Typography>
                <Paper elevation={2} style={PaperStyle} xs={6}>
                    <Typography variant="h6">Name: <b>{data.name}</b></Typography>
                </Paper>
                <Paper elevation={2} style={PaperStyle} xs={6}>
                    <Typography variant="h6">Surname: <b>{data.surname}</b></Typography>
                </Paper>
                <Button
                    sx={{
                        color: '#ffffff',
                        backgroundColor: red[300],
                        height: "40px",
                        marginTop: '10px',
                        '&:hover': {backgroundColor: red[200]}
                    }}
                    onClick={() => goBan()}
                    onMouseEnter={() => setButtonPaperStyle(PaperStyleBanHover)}
                    onMouseLeave={() => setButtonPaperStyle(PaperStyleBan)}
                >
                    <Typography>{isBanned ? "Unban User" : "Ban User"}</Typography>
                </Button>
                {banStatus.message && (
                    <Alert severity={banStatus.variant}>
                        {banStatus.message}
                    </Alert>
                )}
            </Paper>
        </Container>
    )
}

export default BanUnbanProfile;
