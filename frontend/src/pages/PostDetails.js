import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Grid, Paper} from "@mui/material";
import Button from "@mui/material-next/Button";
import {useParams, useNavigate} from "react-router-dom";
import Typography from "@mui/material/Typography";
import {red, blue} from "@mui/material/colors";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAddTwoTone";
import {Rating} from '@mui/material';
import DateFormatter from '../components/DataFormatter';
import { Box, Card, CardContent } from '@mui/material';
import RatingStars from '../components/RatingStars';


function PostDetails() {
    // Fetch post details from database
    const [post, setPost] = useState([]);
    let {id} = useParams();

    const [loginStatus, setLoginStatus] = useState({
      message: '',
      variant: 'success', // o 'danger' in caso di errore
    });

    const navigate = useNavigate();
  
    function timeout_text(text) {
      let status = text; 
      setTimeout(function() {
          // Azione da compiere dopo 1 secondo
          setLoginStatus({message: '', variant: status});
          navigate('/profile');
      }, 12000)
  }

    
    const fetchPost = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/post/details/' + id);

            setPost(response.data);
        } catch (error) {
            console.log(error.response)
        }
    }

    async function removePost(id) {
      try {
        // Invia i dati al server usando Axios
        const response = await axios.delete('http://localhost:8080/api/post/remove/' + id);
        setLoginStatus({message: response.data, variant: 'success'});
        timeout_text("success"); 
        // Esegui altre azioni dopo la submit se necessario
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
    }, [id]);
    console.log(post.rating); 
    console.log(post.date_added); 
    return (
        <Box sx={PaperStyle}>
      <Card variant="outlined">
        <CardContent> 
           <Typography variant="h5" component="div">
             {post.book_title}
          </Typography>
          <Typography variant="h6" component="div">
            {post.username}
          </Typography>
           <RatingStars 
              onChange={post.rating}
              readOnly={true} 
              isStatic={true}
              star={post.rating}
            />
           <DateFormatter originalTimestamp={post.date_added}/>
           <Button onClick={removePost(id)} sx={{
                            backgroundColor: red[300],
                            margin: "5px",
                            '&:hover': {backgroundColor: red[400]}
                        }}
          variant="filledTonal" startIcon={<BookmarkAddIcon sx={{color: blue[700]}}/>}>
           <Typography>Remove Post</Typography>
           </Button>
           <Grid item xs={12} md={11}>
                    <Paper elevation={0} sx={DescriptionPaperStyle}>
                        <Typography variant="h5">Description</Typography>
                        <Typography>{post.review_text}</Typography>
                    </Paper>
          </Grid>
        </CardContent>
      </Card>
    </Box>
    );
}

export default PostDetails;