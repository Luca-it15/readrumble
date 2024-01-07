

import Button from '@mui/material/Button';
import {Col} from 'react-bootstrap'; 

export default function UserInformation({props, goSettings}) {
  return (
   <Col> 
    <div
      className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4 bg-gray-200 dark:bg-gray-700"
    >
      <div className="flex flex-col sm:flex-grow text-center sm:text-left">
        <h2 className="text-2xl font-bold">{props.Username}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{props.Name}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{props.Surname}</p>
      </div>
      <Button variant="contained" onClick={goSettings} className="self-center sm:self-start mt-0 sm:mt-0 bg-blue-500 text-white dark:text-gray-200 rounded-full border-2 border-blue-500">
        Settings
      </Button>
    </div>
    </Col>
  )
}
