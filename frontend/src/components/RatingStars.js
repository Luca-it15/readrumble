import React, { useState } from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';

// ... (import React e useState)

const RatingStars = ({ onChange, readOnly, isStatic, star}) => {
  const labels = {
    0: 'I read new pages',
    1: 'Useless',
    2: 'Poor',
    3: 'Ok',
    4: 'Good',
    5: 'Excellent',
  };

  const [value, setValue] = useState(2);
  const [hover, setHover] = useState(-1);

  const getLabelText = (value) => `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;

  const handleChange = (newValue) => {
    setValue(newValue);
    onChange(newValue); // Chiamare la funzione di callback per aggiornare il form
  };
  
  return (
    <Box
  >
    <Rating
      name="hover-feedback"
    value={isStatic ? star : value }
      precision={1}
      getLabelText={getLabelText}
      readOnly = {readOnly}
      onChange={(event, newValue) => handleChange(newValue)}
      onChangeActive={(event, newHover) => {
        setHover(newHover);
      }}
      emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
    />
    {value !== null && (
      <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : (isStatic? star : value)]}</Box>
    )}
  </Box>
);
};

export default RatingStars;
