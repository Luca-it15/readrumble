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

export default function Explore() {
 const [value, setValue] = useState(0); 
  

  function getBook() {
    setValue(0); 
  }

  function getPost() {
    setValue(1); 
  }

  function getUser() {
    setValue(2); 
  }

  const Choiche = ({value}) => {

   if(value === 0) {
    return(
    <>   
      <div className='choiche'>
     <h3>Books</h3>
      < BookListShow />
      </div>
     </>
    ); 
  }
   else if(value === 1) {
    return (
     <>   
           <div className='choiche'>
      <h3>Post</h3>
      < PostsListAll/>
      </div>
      </>
       ); 
     }
    else {
        return (
            <>   
             <div className='choiche'>
             <h3>Users</h3>
             <UserList />
             </div>
             </>
        ); 
     }
   }

        return (
            <Container>
                <Typography variant="h2">Esplora</Typography>
                <SearchBar />
                <Container className='explore'>
                <ToggleButtonGroup
                    exclusive
                    aria-label="explore"
                    color={"primary"}
                    size="large"
                    role="group"
                >
                    <ToggleButton onClick={getBook} className='toggle' value="book" aria-label="book">
                       <h4>Book</h4>
                    </ToggleButton>
                    <ToggleButton onClick={getPost} className='toggle' value="review" aria-label="review">
                       <h4>Post</h4>
                    </ToggleButton>
                    <ToggleButton onClick={getUser} className='toggle' value="user" aria-label="user">
                       <h4>User</h4>
                    </ToggleButton>
                </ToggleButtonGroup>
                  <Choiche  value={value} />
                </Container>
            </Container>
        );

}