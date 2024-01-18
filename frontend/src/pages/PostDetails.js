import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Grid, Paper} from "@mui/material";
import Button from "@mui/material-next/Button";
import {useParams} from "react-router-dom";
import Typography from "@mui/material/Typography";
import {blue, red, yellow} from "@mui/material/colors";
import StarTwoToneIcon from "@mui/icons-material/StarTwoTone";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemoveTwoTone";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAddTwoTone";
import {Rating} from '@mui/material';
import DateFormatter from '../components/DataFormatter';
import { Box, Card, CardContent } from '@mui/material';
import RatingStars from '../components/RatingStars';


function PostDetails() {
    // Fetch post details from database
    const [post, setPost] = useState([]);
    let {id} = useParams();

    
    const fetchPost = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/post/details/' + id);

            setPost(response.data);
        } catch (error) {
            console.log(error.response)
        }
    }

    async function removePost(id) {
      return null;   
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
                            backgroundColor: blue[200],
                            margin: "5px",
                            '&:hover': {backgroundColor: blue[100]}
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