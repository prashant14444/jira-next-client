import React, {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextareaAutosize from '@mui/base/TextareaAutosize';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Divider } from '@mui/material';
import Alert from '@mui/material/Alert';

import IconButton from '@mui/material/IconButton';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Label } from '@mui/icons-material';
import dayjs from 'dayjs';

import {CREATE_NEW_PROJECT} from '../../routes/auth.js';
import {PROJECT_CREATED_SUCCESS_MESSAGE} from '../../messages/message.js';

export default function CreateProjectForm({addProject}) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(dayjs());
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [formattedDueDate, setFormattedDueDate] = useState('');

  const today = dayjs();

  const handleChange = (e) => {

    switch(e.target.name){
      case 'name':
        setName(e.target.value);
        break;
      
      case 'description':
        setDescription(e.target.value);
        break;

      case 'files[]':
        setFiles([...(e.target.files)]);
        break;

      default:
        break;
    }
  }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSuccess('');
    setError('');
    setName('');
    setDescription('');
  };

  const handleSubmit = async() => {
    console.log();

    // console.log(token);
    let token = localStorage.getItem('token');
    const options = {
      method: "POST",
      url: CREATE_NEW_PROJECT,
      body: JSON.stringify({name, description, formattedDueDate, files}),
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token
      },
    }
    
    try {
      setError('');
      setSuccess('');
      const response = await fetch(CREATE_NEW_PROJECT, options);
      let responseJson = await response.json()
      const {status, data} = responseJson;
      const validationErrors = responseJson.errors

      if(response.status == 401){ // if unauthorised then redirect back to the login page and remove token
        Router.push('/login');
        localStorage.removeItem('token');
      }

      if (status){
          setSuccess(PROJECT_CREATED_SUCCESS_MESSAGE);
          addProject(data.project);
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
      setError(error.message);
    }
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>+ Add</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
            <DialogContentText></DialogContentText>
            <Divider />

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                name="name"
                type="text"
                fullWidth
                variant="standard"
                onChange={handleChange}
                defaultValue ={name}
                sx={{marginBottom: '20px'}}
                />

            <TextareaAutosize
                sx={{marginBottom: '20px'}}
                aria-label="projectDescription"
                id="projectDescription"
                name="description"
                defaultValue ={description}
                placeholder="Enter Description here"
                onChange={handleChange}
                style={{ width: '100%', height: 100 }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker defaultValue={today} disablePast views={['year', 'month', 'day']} name="dueDate" sx={{marginBottom: '20px'}}  onChange={(e) => {setFormattedDueDate(e.$d.toJSON()) ; setDueDate(e)}} value ={dueDate}/>
            </LocalizationProvider>

            <IconButton color="primary" aria-label="upload picture"  component="label">
                <input hidden name="files[]" onChange={handleChange}  type="file" multiple defaultValue ={files} />
                <Label>Upload File</Label>
                <AttachFileIcon label="sdfdfdsfsdf"/>
            </IconButton>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}