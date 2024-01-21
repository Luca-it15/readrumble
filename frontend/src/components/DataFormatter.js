import React from 'react';
import moment from 'moment';
import { Typography } from '@mui/material';



const DataFormatter = ({timestamp}) => {

  const inputFormat = moment.ISO_8601;
  const outputFormat = 'YYYY:MM:DD HH:mm:ss';
  let formattedDate = ''; 

  if (moment(timestamp, inputFormat, true).isValid()) {
    formattedDate = moment(timestamp).format(outputFormat);
    console.log(`La data fornita (${timestamp}) è valida e convertita in formato ${outputFormat}: ${formattedDate}`);
  } else {
    console.log(`La data fornita (${timestamp}) non è valida!`);
  }
  

    return (
      <Typography variant="h5">{formattedDate}</Typography>
        
    );
}

export default DataFormatter; 