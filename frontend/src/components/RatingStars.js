import React, {useState} from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';

const RatingStars = ({onChange, readOnly, isStatic, star}) => {

    const [value, setValue] = useState(2);
    const [hover, setHover] = useState(-1);

    const handleChange = (newValue) => {
        setValue(newValue);
        onChange(newValue); // Chiamare la funzione di callback per aggiornare il form
    };

    return (
        <Box>
            <Rating
                name="hover-feedback"
                value={isStatic ? star : value}
                precision={1}
                readOnly={readOnly}
                onChange={(event, newValue) => handleChange(newValue)}
                onChangeActive={(event, newHover) => {
                    setHover(newHover);
                }}
                emptyIcon={<StarIcon style={{opacity: 0.55}} fontSize="inherit"/>}
            />
        </Box>
    );
};

export default RatingStars;
