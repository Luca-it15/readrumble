import TextField  from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material-next/Button";
import {SearchRounded } from "@mui/icons-material";
import { Typography } from "@mui/material";
import {blue} from "@mui/material/colors";


  
 

export default function SearchBar({handleSearchButtonClick, handleSearchTextChange, searchText}) {
   const searchBar = {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: '10px',
    fontSize: '18pt',
    padding: '5px 10px',
    width: '25vw',
 }

 const searchButton = {
    backgroundColor: blue[400],
    margin: '5px',
    borderRadius: 10,
    textAlign: 'center',
    '&:hover': {
        backgroundColor: blue[300],
    }
 }
        return (
          <Box component="form" sx={{display: 'flex', alignItems: 'center'}}>
          <TextField type="text" placeholder="Search" variant="standard" sx={searchBar} value={searchText}
                     onChange={handleSearchTextChange}/>
          <Button sx={searchButton} variant="filledTonal" onClick={handleSearchButtonClick}>
              <SearchRounded sx={{color: '#ffffff'}}/>
          </Button>
      </Box>
        );
}