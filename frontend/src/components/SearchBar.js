import TextField  from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";


export default function SearchBar() {
        return (
            <Box component="form" sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField type="text" placeholder="Cerca" variant="outlined" sx={{ mr: 2 }} />
                <Button variant="contained" color="primary">Cerca</Button>
            </Box>
        );
}