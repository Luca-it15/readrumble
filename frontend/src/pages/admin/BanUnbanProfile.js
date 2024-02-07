import React, { useState, useEffect } from 'react';
import {Container, Grid, Typography, Paper, Alert} from '@mui/material';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import '../../App.css'

function BanUnbanProfile(){
    const PaperStyle = {
            backgroundColor: '#f1f7fa',
            padding: '10px',
            margin: '20px 10px 0px 10px',
            borderRadius: 18,
            width: '100%',
            textAlign: 'center'
        }
    const PaperStyleBan = {
      backgroundColor: 'Firebrick',
      color: 'white',
      padding: '10px',
      margin: '20px 10px 0px 10px',
      borderRadius: 18,
      width: '100%',
      textAlign: 'center',
      transition: 'background-color 0.3s ease',
    };

    const PaperStyleBanHover = {
      backgroundColor: 'DarkRed',
      color: 'white',
      padding: '10px',
      margin: '20px 10px 0px 10px',
      borderRadius: 18,
      width: '100%',
      textAlign: 'center',
      transition: 'background-color 0.3s ease',
    };

    var isJoined = false;
    const { name } = useParams();
    const navigate = useNavigate();
    const [banStatus,setBanStatus]= useState({
        message:'',
        variant:'success'
    })
    const [data, setData] = useState([]);
    const user = JSON.parse(localStorage.getItem('logged_user'));
    const [isBanned, setIsBanned] = useState(false);
    const [ButtonPaperStyle, setButtonPaperStyle] = useState(PaperStyleBan);
    function goBan()
    {
        var messager = '';
        if(isBanned)
        {
            axios.post("http://localhost:8080/api/admin/user/unban",name)
            .then(response =>{
                messager = response.data;
                setBanStatus({message:messager,variant:'success'});
                setTimeout(()=>{setBanStatus({messagge:'',variant:'success'});},2000)
                setIsBanned(!isBanned);
            })
        }
        else
        {
            axios.post("http://localhost:8080/api/admin/user/ban",name)
            .then(response =>{
                messager = response.data;
                setBanStatus({message:messager,variant:'success'});
                setTimeout(()=>{setBanStatus({messagge:'',variant:'success'});},2000)
                setIsBanned(!isBanned);
            })
        }


    }
    function getUserState()
    {
        axios.post("http://localhost:8080/api/admin/user/search_user",name)
        .then(response => {

            const jsonData = JSON.parse(JSON.stringify(response.data));
            if(jsonData == '')
            {
                localStorage.setItem("admin_search_response","NO")
                navigate("/admin_user");
            }
            setData(jsonData);
            if(jsonData.isBanned==0)
            {
                setIsBanned(false);
            }
            else
            {
                setIsBanned(true);
            }

        }).catch(error => console.error('Errore nella richiesta GET:', error));
    }
    useEffect(() => { getUserState()
        }, []);    // [] means "Execute this action just at the start of the page"


    return(
    <Grid
      container
      direction="column"
      justifyContent="space-evenly"
      alignItems="center" >
          <Grid item xs='auto'>
            <Paper elevation={2} style={PaperStyle}>
              <Typography variant="h4">Ban/Unban the user {data.id}</Typography>
            </Paper>
          </Grid>
          <Grid container xs='auto' direction="row" spacing={2}>
              <Grid item xs='auto'>
                <Paper elevation={2} style={PaperStyle}>
                  <Typography variant="h5">Name: {data.name}</Typography>
                </Paper>
              </Grid>
              <Grid item xs='auto'>
                <Paper elevation={2} style={PaperStyle}>
                  <Typography variant="h5">Surname: {data.surname}</Typography>
                </Paper>
              </Grid>
          </Grid>
          <Grid item xs='auto'>
            <Paper
              elevation={2}
              style={ButtonPaperStyle}
              onClick={() => goBan()}
              onMouseEnter={() => setButtonPaperStyle(PaperStyleBanHover)}
              onMouseLeave={() => setButtonPaperStyle(PaperStyleBan)}
            >
              <Typography variant="h4">{isBanned ? "Unban User" : "Ban User"}</Typography>
            </Paper>
          </Grid>
          <Grid item xs='auto'>
            {banStatus.message && (
                <Alert severity={banStatus.variant}>
                    {banStatus.message}
                </Alert>
            )}
          </Grid>
        </Grid>
    )
}

export default BanUnbanProfile;
