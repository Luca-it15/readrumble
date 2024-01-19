import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton'; 
import ToggleButtonGroup from '@mui/material/ToggleButton'; 
import '../App.css';
import BookListShow from '../components/BookListShow';
import SearchBar from '../components/SearchBar';
import UserList from '../components/UserList';
import PostsListAll from '../components/PostsListAll';
import { Paper } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material-next/Button';
import { SearchRounded } from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import SuggestBooks from '../components/SuggestedBooks';

export default function Explore() {
 
 let currentUser = JSON.parse(localStorage.getItem('logged_user'));

 const [value, setValue] = useState(0); 
 const [toggle1, setToggle1] = useState(true); 
 const [toggle2, setToggle2] = useState(false); 
 const [toggle3, setToggle3] = useState(false); 
 const [searchText, setSearchText] = useState('');
  
  
  
 const PaperStyle = {
  backgroundColor: '#f1f7fa',
  padding: '10px',
  margin: '10px',
  borderRadius: 5
}
 
 const toggle = {
   backgroundColor: '#1976d2', 
   padding: '15px', 
   margin: '5px',
   border: '3pt solid #1976d2', 
   borderRadius: '15px', 
   color: 'white'
 }

 const toggleGroup = {
  backgroundColor: 'white', 
  border: '3pt solid #1976d2', 
  borderRadius: '15px', 
}

const searchBar = {
  backgroundColor: 'white',
  border: '3pt solid #1976d2',
  borderRadius: '15px',
  margin: '10px',
  fontSize: '18pt'
}

const searchBotton = {
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



  function getBook() {
    setValue(0); 
    setToggle1(true);
    setToggle2(false);
    setToggle3(false);
  }

  function getPost() {
    setValue(1); 
    setToggle1(false);
    setToggle2(true);
    setToggle3(false);
  }

  function getUser() {
    setValue(2); 
    setToggle1(false);
    setToggle2(false);
    setToggle3(true);
  }

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearchButtonClick = () => {
     
  };

  const Choiche = ({value}) => {

   if(value === 0) {
    return(
    <>   
      <div className='choiche'>
      <Typography variant="h3">
        Books
        </Typography>
      <SuggestBooks user={currentUser['_id']}/>
      </div>
     </>
    ); 
  }
   else if(value === 1) {
    return (
     <>   
        <div className='choiche'>
        <Typography variant="h3">
          Posts
        </Typography>
      < PostsListAll/>
      </div>
      </>
       ); 
     }
    else {
        return (
            <>   
            <div className='choiche'>
             <Typography variant="h3">
              Users
             </Typography>
             <UserList />
             </div>
             </>
        ); 
     }
   }

        return (
          <Paper sx={PaperStyle}>
            <Container>
                <Typography variant="h2">Esplora</Typography>
                <Box component="form" sx={{ display: 'flex', alignItems: 'center' }}>
                 <TextField type="text" placeholder="Cerca" variant="outlined" sx={searchBar} value={searchText} onChange={handleSearchTextChange} />
                 <Button
                  sx={searchBotton}
                  variant="filledTonal"
                  startIcon={<SearchRounded sx={icon} />}
                  onClick={handleSearchButtonClick}
                 >
                 <Typography variant='h5'>Cerca</Typography>
                 </Button>
                </Box>
                <Container className='explore'>
                <ToggleButtonGroup
                    exclusive
                    aria-label="explore"
                    size="large"
                    role="group"
                    sx={toggleGroup}
                >
                    <ToggleButton onClick={getBook} sx={toggle} value="Book" aria-label="book" disabled={toggle1}>
                       <h4>Book</h4>
                    </ToggleButton>
                    <ToggleButton onClick={getPost} sx={toggle} value="Post" aria-label="post" disabled={toggle2}>
                       <h4>Post</h4>
                    </ToggleButton>
                    <ToggleButton onClick={getUser} sx={toggle} value="User" aria-label="user" disabled={toggle3}>
                       <h4>User</h4>
                    </ToggleButton>
                </ToggleButtonGroup>
                  <Choiche  value={value} />
                </Container>
            </Container>
            </Paper>
        );

}