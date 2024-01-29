import {List, ListItem, ListItemText, ListItemIcon, Grid} from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import React from "react";

export default function Tags({tags}) {

    return (
        <Grid container direction="row " justifyContent="center" alignItems="center" sx={{gap: '10px'}}>
            {tags.map((tag) => (
                <Grid item xs="auto">
                <TagIcon/>
                {tag}
                </Grid>
            ))}
        </Grid>
    );
} 