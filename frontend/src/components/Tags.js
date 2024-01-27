import {List, ListItem, ListItemText, ListItemIcon} from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import React from "react";

export default function Tags({tags}) {

    return (
        <React.Fragment>
            <List orientation="horizontal">
                {tags.map((tag) => (

                    <ListItem key={tag}>
                        <ListItemIcon>
                            <TagIcon/>
                        </ListItemIcon>
                        <ListItemText primary={tag}/>
                    </ListItem>
                ))}
            </List>
        </React.Fragment>
    );
} 