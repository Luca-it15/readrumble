import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Grid, List, ListItem, ListItemIcon, ListItemText, Paper, Rating} from "@mui/material";
import Button from "@mui/material-next/Button";
import {useParams, useNavigate} from "react-router-dom";
import Typography from "@mui/material/Typography";
import {red, blue} from "@mui/material/colors";
import {Alert} from '@mui/material';
import BookmarkAddIcon from "@mui/icons-material/BookmarkAddTwoTone";
import DateFormatter from '../components/DataFormatter';
import { Box, Card, CardContent } from '@mui/material';
import RatingStars from '../components/RatingStars';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import TagIcon from '@mui/icons-material/Tag';
import Tags from '../components/Tags';


function PostDetails() {
    // Fetch post details from database
    const [post, setPost] = useState([]);
    const [tags, setTags] = useState([]); 
    const [rating, setRating] = useState(''); 
    const [date, setDate] = useState(''); 
    let {id} = useParams();

    const [loginStatus, setLoginStatus] = useState({
      message: '',
      variant: 'success', // o 'danger' in caso di errore
    });
    const [validationError, setValidationError] = useState('');

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function backProfile() {
      navigate('/profile'); 
    }


    function timeout_text(text) {
      let status = text; 
      setTimeout(function() {
          // Azione da compiere dopo 1 secondo
          setLoginStatus({message: '', variant: status});
          backProfile()
      }, 6000)
  }

    
    const fetchPost = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/post/details/' + id);

            setPost(response.data);
            setTags(response.data.tags); 
            setRating(response.data.rating); 
            setDate(response.data.date_added); 
        } catch (error) {
            console.log(error.response)
        }
    }
    const removePost = (id) => async () => {
      try {
              const response = await axios.delete('http://localhost:8080/api/post/remove/' + id);
              setLoginStatus({message: response.data, variant: 'success'});
              handleClose(); 
              timeout_text("success"); 
              console.log('Recensione inviata con successo!');
              
      } catch (error) {
          console.error('Errore durante l\'invio della recensione:', error);
          setLoginStatus({message: error.response ? JSON.stringify(error.response.data) : error.message, variant: 'danger'});
          timeout_text("error"); 
      }
  }

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        margin: '10px',
        borderRadius: 5
    }

    const DescriptionPaperStyle = {
        backgroundColor: '#ffffff',
        padding: '30px',
        margin: '10px',
        borderRadius: 5,
    }

    useEffect(() => {
        fetchPost();
    }, []);
    return (
        <Paper sx={PaperStyle}>
            <Grid xs={2}>
             <Button onClick={backProfile} startIcon={<ArrowBack sx={{width: "35px", height: "35px"}}/>}></Button>
            <Typography variant="h3" fontWeight="bold" textAlign="center"
                        marginBottom="20px">{post.book_title}</Typography>
            </Grid>
            <Grid container direction="row" alignItems="center" justifyContent="center" spacing={3}>
                <Grid item xs={8}>
                <Card>
            <CardContent>   
                    <Typography variant="h4"> {post.username}</Typography>
                    <Typography variant="h5">Bookmark: {post.bookmark}</Typography>
             <Tags tags={tags} /> 
           <DateFormatter originalTimestamp={date}/>
           <Typography variant="h6" component="div"> 
            <RatingStars 
              onChange={rating}
              readOnly={true} 
              isStatic={true}
              star={rating}
            />
          </Typography>
          </CardContent>  
          </Card>
          </Grid>
           <Grid item xs={12} md={11}>
                    <Paper elevation={0} sx={DescriptionPaperStyle}>
                        <Typography variant="h5">Description</Typography>
                        <Typography>{post.review_text}</Typography>
                    </Paper>
          </Grid>
          <Button onClick={handleClickOpen}
                            sx={{backgroundColor: red[300], margin: "5px", '&:hover': {backgroundColor: red[400]}}}
                            variant="filledTonal" >
                        <Typography>Remove</Typography>
                    </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Conferma eliminazione"}</DialogTitle>
              <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                        Sei sicuro di voler eliminare questo post?
                  </DialogContentText>
              </DialogContent>
               <DialogActions>
                    <Button onClick={handleClose}>
                    <Typography>Annulla</Typography>
                      </Button>
                    <Button onClick={removePost(id)} >
                        <Typography>Elimina</Typography>
                    </Button>
                </DialogActions>
            </Dialog>
          {validationError && (
                                <Alert variant="danger">
                                    {validationError}
                                </Alert>
                            )}

                            {loginStatus.message && (
                                <Alert variant={loginStatus.variant}>
                                    {loginStatus.message}
                                </Alert>
                            )}
       </Grid>
      </Paper>
      );
}

export default PostDetails;