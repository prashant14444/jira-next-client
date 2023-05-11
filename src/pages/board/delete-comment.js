import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import IconButton from '@mui/material/IconButton';
import toast, { Toaster } from 'react-hot-toast';

import {DELETE_COMMENT_BY_ID} from '../../routes/auth.js';
import {COMMENT_DELETED_SUCCESS_MESSAGE} from '../../messages/message.js'

export default function DeleteComment({currentModalState, updateParentDeleteModalState, commentId, deleteComment, selectedProjectId}) {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const handleClose = () => {
    setOpen(false);
    updateParentDeleteModalState(false);
  };

  const handleDelete = async() => {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem('token')
      },
    }
    
    try {
      const response = await fetch(DELETE_COMMENT_BY_ID.replace(':id', commentId).replace('{project_id}', selectedProjectId), options);
      let responseJson = await response.json()
      const {status, data} = responseJson;
      const validationErrors = responseJson.errors

      if(response.status == 401){ // if unauthorised then redirect back to the login page and remove token
        localStorage.removeItem('token');
        localStorage.removeItem('defaultProjectId');
        Router.push('/login');
      }

      if (status){
        toast.success(COMMENT_DELETED_SUCCESS_MESSAGE);
        deleteComment(data.comment); // this is setting up the state of the projectMember list on index page
        handleClose();
      }
      else{
        if(validationErrors){
          let validationErrorsArray = Object.keys(validationErrors).map((key) => validationErrors[key]);
          var errorMessage = '';
          validationErrorsArray.forEach(error => {
            errorMessage += error + ', ';
          });
          toast.error(errorMessage.replace(/,\s*$/, "")); // replace comma before setting the error
        }
        else{
          toast.error(responseJson.error.message);
        }
      }
    } catch (error) {
        toast.error(error);
    }
    
  }
  
  React.useEffect(() => {
    setOpen(currentModalState);
  });

  return (
    <div>
      <Toaster />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this record ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <IconButton  onClick={handleClose} color="primary" ><CloseOutlinedIcon /></IconButton >
          <IconButton  onClick={handleDelete} color="error"><DoneOutlinedIcon /></IconButton >
        </DialogActions>
      </Dialog>
    </div>
  );
}