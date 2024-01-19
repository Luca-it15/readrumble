import TextField  from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material-next/Button";
import {SearchRounded } from "@mui/icons-material";
import { Typography } from "@mui/material";

const searchBar = {
    backgroundColor: 'white', 
    border: '3pt solid #1976d2', 
    borderRadius: '15px', 
    margin: '10px',
    fontSize: '18pt'
  }

  const toggle = {
    backgroundColor: '#1976d2', 
    padding: '15px', 
    margin: '5px',
    border: '3pt solid #1976d2', 
    borderRadius: '15px', 
    color: 'white'
  }

  const icon = {
    color: 'white'
  }

export default function SearchBar() {
        return (
            <Box component="form" sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField type="text" placeholder="Cerca" variant="outlined" sx={searchBar} />
                <Button 
                            sx={toggle}
                            variant="filledTonal" 
                            startIcon={<SearchRounded sx={icon}/>}>
                 <Typography variant='h5'>Cerca</Typography></Button>
            </Box>
        );
}