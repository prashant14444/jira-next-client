import {useState} from 'react';
import { Avatar, Grid, Paper } from "@mui/material";
import moment from 'moment';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';

const imgLink =
  "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260";

const Comment = ({comment, deleteComment}) => {
  return (
    <div style={{ padding: 14 }} >
      <Paper style={{ border: "none" }}>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar alt="Remy Sharp" src={imgLink} />
          </Grid>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <h4 style={{ margin: 0, textAlign: "left" }}>{comment.commented_by.user_id.f_name} {comment.commented_by.user_id.l_name}</h4>
            <p style={{ textAlign: "left" }}>{comment.message}
            </p>
            <p style={{ textAlign: "left", color: "gray" }}>
                {moment(new Date(comment.timestamps).valueOf()).startOf('day').fromNow()}
                
                <Button sx={{ml:2}} size="small"  color="secondary" startIcon={<EditIcon />}>Edit</Button>
                <Button sx={{ml:2}} size="small" onClick={deleteComment} data-id={comment._id} color="error" endIcon={<DeleteIcon />}>Delete</Button>
            </p>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default Comment;