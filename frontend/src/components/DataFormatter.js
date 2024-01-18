import React from 'react';
import moment from 'moment';
import { Typography } from '@mui/material';

const formatDate = (date) => {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

const DataFormatter = ({timestamp}) => {
    const formattedDate = formatDate(timestamp);

    return (
      <Typography variant="h5">{formattedDate}</Typography>
        
    );
}

export default DataFormatter; 