import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import RatingStars from './RatingStars'; // Assicurati che il percorso sia corretto

export default function ReviewRow({ title, username, pagesRead, review, rating, readOnly }) {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <CardContent>
        <Typography variant="h5" component="div">
            Titolo del libro: {title}
          </Typography>
          <Typography variant="h6" component="div">
            Username: {username}
          </Typography>
          <Typography variant="h6" component="div">
            Pagine lette: {pagesRead}
          </Typography>
          <Typography variant="h6" component="div">
            Recensione: {review}
          </Typography>
          <Typography variant="h6" component="div">
            Valutazione: 
            <RatingStars 
              onChange={(newValue) => console.log(newValue)} 
              readOnly={readOnly} 
            />
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
