import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import RatingStars from './RatingStars'; // Assicurati che il percorso sia corretto
import DateFormatter from './DataFormatter';

export default function PostRow({ title, username, rating, readOnly, date, user }) {


 console.log(user); 
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <CardContent> 
         {user.user ? (
        <Typography variant="h5" component="div">
            Titolo del libro: {title}
          </Typography> ) : 
        (<Typography variant="h6" component="div">
            Username: {username}
          </Typography> )}
          <Typography variant="h6" component="div">
            Valutazione: 
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
