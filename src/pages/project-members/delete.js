import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import IconButton from '@mui/material/IconButton';
import { Alert } from '@mui/material';

import {DELETE_PROJECT_MEMBER_BY_ID} from '../../routes/auth.js';
import {PROJECT_MEMBER_DELETED_SUCCESS_MESSAGE} from '../../messages/message.js'

export default function DeleteMember({currentModalState, updateParentDeleteModalState, userId, deleteProjectMember}) {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const handleClose = () => {
    setOpen(false);
    updateParentDeleteModalState(false);
  };

  const handleDelete = async() => {
    console.log(userId);
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem('token')
      },
    }
    
    try {
      setError('');
      setSuccess('');
      const response = await fetch(DELETE_PROJECT_MEMBER_BY_ID.replace(':id', userId), options);
      let responseJson = await response.json()
      const {status, data} = responseJson;
      const validationErrors = responseJson.errors

      if(response.status == 401){ // if unauthorised then redirect back to the login page and remove token
        localStorage.removeItem('token');
        Router.push('/login');
      }

      if (status){
        setSuccess(PROJECT_MEMBER_DELETED_SUCCESS_MESSAGE);
        deleteProjectMember(data.projectMember); // this is setting up the state of the projectMember list on index page
        handleClose();
      }
      else{
        // setRows([]);
        if(validationErrors){
          let validationErrorsArray = Object.keys(validationErrors).map((key) => validationErrors[key]);
          var errorMessage = '';
          validationErrorsArray.forEach(error => {
            errorMessage += error + ', ';
          });
          setError(errorMessage.replace(/,\s*$/, "")); // replace comma before setting the error
        }
        else{
          setError(responseJson.error.message);
        }
      }
    } catch (error) {
      setError(error);
      console.log(error.message);
    }
    
  }
  
  React.useEffect(() => {
    setOpen(currentModalState);
  });

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
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