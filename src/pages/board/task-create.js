import {useState} from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { Divider } from '@mui/material';

import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Router from 'next/router.js';
import TextField from '@mui/material/TextField';
import Editor from "../../components/Editor.js";

import {CREATE_TASK, GET_ALL_USERS, GET_ALL_PROJECTS} from '../../routes/auth.js';
import {TASK_CREATED_SUCCESS_MESSAGE, PROJECTS_FETCHED_SUCCESS_MESSAGE, USERS_FETCHED_SUCCESS_MESSAGE} from '../../messages/message.js';
import { TASK_STATUSES, TASK_TYPES, TASK_PRIORITY  } from '../../constants/task.js';

export default function CreateTaskForm({addTask}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [projects, setProjects] = useState([]);
  const [taskPriority, setTaskPriority] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskStatus, setTaskStatus] = useState('');
  const [taskType, setTaskType] = useState('');
  const [description, setDescription] = useState('');

  const handleChange = (e) => {
    switch(e.target.name){
      case 'project_id':
        setProjectId(e.target.value);
        break;
    
      case 'status':
        setTaskStatus(e.target.value);
        break;

      case 'taskTitle':
        setTaskTitle(e.target.value);
        break;

      case 'priority':
        setTaskPriority(e.target.value);
        break;

      case 'type':
        setTaskType(e.target.value);
        break;

      default:
        break;
    }
  }
  const handleClickOpen = () => {
    setOpen(true);
    getAllProjects();
    getAllUsers();
  };

  const handleClose = () => {
    setOpen(false);
    setSuccess('');
    setError('');
    setProjectId('');
    setTaskStatus('');
    setTaskPriority('');
    setTaskTitle('');
    setProjects([]);
    setTaskType('');
  };

  const handleSubmit = async(e) => {
    setLoading(true);
    let data = {
      project_id:projectId, 
      title: taskTitle, 
      description, 
      priority: taskPriority, 
      type: taskType, 
      status: taskStatus
    };

    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem('token')
      },
    }
    
    try {
      setError('');
      setSuccess('');

      const response = await fetch(CREATE_TASK, options);
      let responseJson = await response.json()
      const {status, data} = responseJson;
      const validationErrors = responseJson.errors
      if (status){
        setSuccess(TASK_CREATED_SUCCESS_MESSAGE);
        addTask(data.task);
        handleClose();
      }
      else{
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
      console.log(error);
    }
    setLoading(false);
  };

  const getAllProjects = async() => {
    // console.log(token);
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem('token')
      },
    }
    
    try {
      setError('');
      setSuccess('');
      const response = await fetch(GET_ALL_PROJECTS, options);
      let responseJson = await response.json()
      const {status, data} = responseJson;
      const validationErrors = responseJson.errors

      if(response.status == 401){ // if unauthorised then redirect back to the login page and remove token
        localStorage.removeItem('token');
        Router.push('/login');
      }

      if (status){
        setSuccess(PROJECTS_FETCHED_SUCCESS_MESSAGE);
        setProjects([...data.project]);
      }
      else{
        setProjects([]);
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
      // console.log(error.message);
    } 
  };

  const getAllUsers = async() => {
    // console.log(token);
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem('token')
      },
    }
    
    try {
      setError('');
      setSuccess('');
      const response = await fetch(GET_ALL_USERS, options);
      let responseJson = await response.json()
      const {status, data} = responseJson;
      const validationErrors = responseJson.errors

      if(response.status == 401){ // if unauthorised then redirect back to the login page and remove token
        localStorage.removeItem('token');
        Router.push('/login');
      }

      if (status){
        setSuccess(USERS_FETCHED_SUCCESS_MESSAGE);
        // setTask([...data.user]);
      }
      else{
        // setTask([]);
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
      // console.log(error.message);
    }
  }

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>+ Add</Button>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth="true">
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
            <DialogContentText></DialogContentText>
            <Divider />
            <Stack>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <FormControl variant="standard" sx={{ minWidth: 120 }}>
              <InputLabel id="project">Select Project</InputLabel>
              <Select
              required
              labelId="project"
              id="project"
              name="project_id"
              value={projectId}
              onChange={handleChange}
              label="Select Project *"
              >
              <MenuItem value=""><em>None</em></MenuItem>
              {projects.map((project) => {
                return <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
              })}
              
              </Select>
              </FormControl>

            <FormControl variant="standard" sx={{ minWidth: 120, mt:4 }}>
              <InputLabel id="task-status">Task Status</InputLabel>
              <Select
              required
              labelId="task-status"
              id="task-status"
              name="status"
              value={taskStatus}
              onChange={handleChange}
              label="Task Status *"
              >
              <MenuItem value=""><em>None</em></MenuItem>
              {TASK_STATUSES.map((status) => {
                return <MenuItem key={status.value} value={status.value}>{status.name}</MenuItem>
              })}
              </Select>
            </FormControl>

            <FormControl variant="standard" sx={{ minWidth: 120, mt:4 }}>
              <InputLabel id="task-type">Task Type</InputLabel>
              <Select
              required
              labelId="task-type"
              id="task-type"
              name="type"
              value={taskType}
              onChange={handleChange}
              label="Task Type *"
              >
              <MenuItem value=""><em>None</em></MenuItem>
              {TASK_TYPES.map((taskType) => {
                return <MenuItem key={taskType} value={taskType}>{taskType.toUpperCase()}</MenuItem>
              })}
              </Select>
            </FormControl>

            <FormControl variant="standard" sx={{ minWidth: 120, mt:4 }}>
              <TextField defaultValue={taskTitle} name="taskTitle" label="Title" variant="standard" onChange={handleChange} />
            </FormControl>

            <FormControl variant="standard" sx={{ minWidth: 120, mt:4 }}>
              <InputLabel id="priority">Priority</InputLabel>
              <Select
              required
              labelId="priority"
              id="user-priority"
              name="priority"
              value={taskPriority}
              onChange={handleChange}
              label="Priority *"
              >
              <MenuItem value=""><em>None</em></MenuItem>
              {TASK_PRIORITY.map((priority) => {
                return <MenuItem key={priority.value} value={priority.value}>{priority.name}</MenuItem>
              })}
              </Select>
            </FormControl>

            <FormControl variant="standard" sx={{ minWidth: 0, mt:4 }}>
              <Editor value={description} onChange={setDescription} />
            </FormControl>
          
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton
            size="small"
            onClick={handleSubmit}
            loading={loading}
            loadingIndicator="Adding..."
            variant="contained"
          >
            <span>Submit</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}