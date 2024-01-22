import {List, ListItem, ListItemText, ListItemIcon} from '@mui/material'; 
import TagIcon from '@mui/icons-material/Tag';

export default function Tags({tags}) {

return(
  <> 
  <List orientation="horizontal">
 {tags.map((tag, index) => (   
 
  <ListItem key={tag}>
   <ListItemIcon>
    <TagIcon />
   </ListItemIcon>
   <ListItemText primary={tag} />
   </ListItem>
 ))}
 </List>
 </> 
 );
} 