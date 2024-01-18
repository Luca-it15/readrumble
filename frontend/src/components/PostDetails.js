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
import DateFormatter from './DataFormatter';

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
        <Paper sx={PaperStyle}>
        <Typography variant="h4" fontWeight="bold" textAlign="center"
                    marginBottom="20px">{post.book_title}</Typography>
        <Grid container direction="row" alignItems="center" justifyContent="center" spacing={3}>
            <Grid item xs={2}>
                <Typography variant="h5">By: {post.username}</Typography>
                <Typography variant='h5'>Pages read: {post.bookmark}</Typography>
                <Typography variant='h6'><DateFormatter originalTimestamp={post.date_added}/></Typography>
            </Grid>
            <Rating name="read-only" value={post.rating} readOnly />
            <Grid container direction="column" alignItems="center" justifyContent="center" xs={4}>
            <Button onClick={removePost(id)} sx={{
                        backgroundColor: red[300],
                        margin: "5px",
                        '&:hover': {backgroundColor: red[400]}
                    }}
                            variant="filledTonal" startIcon={<BookmarkRemoveIcon sx={{color: blue[700]}}/>}>
                        <Typography>Remove post</Typography>
                </Button>
            </Grid>
            <Grid item xs={12} md={11}>
                <Paper elevation={0} sx={DescriptionPaperStyle}>
                    <Typography variant="h5">Description</Typography>
                    <Typography>{post.review_text}</Typography>
                </Paper>
            </Grid>
        </Grid>
    </Paper>
    );
}

export default PostDetails;