import * as React from 'react';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import RatingStars from './RatingStars'; // Assicurati che il percorso sia corretto
import DateFormatter from './DataFormatter';
import { Link } from '@mui/material';

export default function PostRow({ id, title, username, rating, readOnly, date, user }) {


  const navigate = useNavigate();

  function seeDetails(id) {
    navigate(`/posts/${id}`); 
  }

 console.log(user); 
  return (
  <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <CardContent> 
         {user.user ? (
         <Link onClick={() => {
          seeDetails(id)
      }} sx={{color: "#000000"}}>
         <Typography variant="h5" component="div">
            {title}
          </Typography> </Link> ) : 
        (<Link> 
          <Typography variant="h6" component="div">
            {username}
          </Typography> </Link> )}
          <Typography variant="h6" component="div"> 
            <RatingStars 
              onChange={rating}
              readOnly={readOnly} 
              isStatic={true}
              star={rating}
            />
          </Typography>
        </CardContent>
        <DateFormatter originalTimestamp={date}/>
      </Card>
    </Box>
  );
}
