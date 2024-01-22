import {Typography, Paper, Grid} from '@mui/material/';
import BookListShow from "./BookListShow";
import PostsList from './PostList';
import UserListShow from './UserListShow';


const SearchChoice = ({value, searchText}) => {

  const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        margin: '10px',
        borderRadius: 5,
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    } 
   
    console.log(searchText); 

    if (value === 0) {
        return (
            <Grid container direction="row" sx={{gap: '10%'}} justifyContent="center">
                  <Typography variant='h3'>Search Books</Typography>
                <BookListShow title={searchText} />
            </Grid>
        );
    } else if (value === 1) {
        return (
            <Paper sx={PaperStyle}>
                <Typography variant='h3'>Search Posts</Typography>
                <PostsList all={true} size={12} username={searchText} path={2} user={true}/>
            </Paper>
        );
    } else {
        return (
            <Paper sx={PaperStyle}>
              <Typography variant='h3'>Search Users</Typography>
             <UserListShow username={searchText} />
            </Paper>
        );
    }
}

export default SearchChoice; 