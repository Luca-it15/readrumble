import React from 'react';
import { format } from 'date-fns';

const DateFormatter = ({originalTimestamp}) => {
  const formattedDate = format(new Date(originalTimestamp), "yyyy-MM-dd HH:mm:ss");

  return (
    <div>
      <p>{formattedDate}</p>
    </div>
  );
}

export default DateFormatter;
