import {List, ListItem, ListItemText, ListItemIcon, Grid} from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import React from "react";
import Typography from "@mui/material/Typography";

export default function Tags({tags}) {

    return (
        <Grid container direction="row " justifyContent="center" alignItems="center" sx={{gap: '10px'}}>
            <Typography>Tags: </Typography>
            {tags.map((tag) => (
                <Grid item xs="auto">
                    <TagIcon sx={{height: '15px', marginBottom: '2px'}}/>
                    {tag}
                </Grid>
            ))}
        </Grid>
    );
} 