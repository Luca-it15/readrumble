import React from 'react';
import moment from 'moment';
import {Typography} from '@mui/material';

const DataFormatter = ({timestamp}) => {
    const inputFormat = moment.ISO_8601;
    const outputFormat = 'DD MMM YYYY, HH:mm';
    let formattedDate = '';

    if (moment(timestamp, inputFormat, true).isValid()) {
        formattedDate = moment(timestamp).format(outputFormat);
    }

    return formattedDate;
}

export default DataFormatter; 