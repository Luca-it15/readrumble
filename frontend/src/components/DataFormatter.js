import React from 'react';
import { format } from 'date-fns';

const DateFormatter = ({originalTimestamp}) => {
  const date = new Date(originalTimestamp);
  const formattedDate = date.toLocaleString('en-US', { timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });


  return (
    <div>
      <p>{formattedDate}</p>
    </div> 
  );
}

export default DateFormatter;
