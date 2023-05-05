import {useEffect, useState, forwardRef} from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { Divider, Input } from '@mui/material';

import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Router from 'next/router.js';
import TextField from '@mui/material/TextField';
import Editor from "../../components/Editor.js";
import toast, { Toaster } from 'react-hot-toast';

import {EDIT_TASK, GET_TASK_BY_ID, GET_ALL_USERS, GET_ALL_PROJECTS, GET_ALL_PROJECT_MEMBERS} from '../../routes/auth.js';
import {TASK_CREATED_SUCCESS_MESSAGE, TASK_FETCHED_SUCCESS_MESSAGE, PROJECTS_FETCHED_SUCCESS_MESSAGE, USERS_FETCHED_SUCCESS_MESSAGE, TASK_UPDATED_SUCCESS_MESSAGE} from '../../messages/message.js';
import { TASK_STATUSES, TASK_TYPES, TASK_PRIORITY  } from '../../constants/task.js';

const EditTaskForm = ({updateTask, clickedTaskId, updateClickedTaskId, defaultProjectId}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [taskPriority, setTaskPriority] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskStatus, setTaskStatus] = useState('');
  const [taskType, setTaskType] = useState('');
  const [description, setDescription] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [projectMembers, setProjectMembers] = useState([]);

  const handleChange = (e) => {
    switch(e.target.name){    
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

      case 'assign_to':
        setAssignTo(e.target.value);
        break;

      default:
        break;
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
    getAllProjects();
    getAllUsers();
    getAllProjectMembers();
    getTaskById(clickedTaskId);
  };

  const handleClose = () => {
    setOpen(false);
    setTaskStatus('');
    setTaskPriority('');
    setTaskTitle('');
    setProjects([]);
    setTaskType('');
    setDescription('');
    setAssignTo('');
    updateClickedTaskId('');
  };

  const handleSubmit = async(e) => {
    setLoading(true);
    let data = {
      project_id:defaultProjectId, 
      title: taskTitle, 
      description, 
      priority: taskPriority, 
      type: taskType, 
      status: taskStatus,
      assigned_to: assignTo,
    };
    console.log(data);
    const options = {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem('token')
      },
    }

    try {
      const response = await fetch(EDIT_TASK.replace('{task_id}', clickedTaskId).replace('{projectId}', defaultProjectId), options);
      let responseJson = await response.json()
      const {status, data} = responseJson;
      const validationErrors = responseJson.errors
      if (status){
        toast.success(TASK_UPDATED_SUCCESS_MESSAGE);
        updateTask(data.task);
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
      toast.error(error.message);
    }
    setLoading(false);
  };

  const getTaskById = async(taskId) => {
    if(!taskId) return;
    
    // console.log(token);
    const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem('token')
        },
    }
      
    try {
        const response = await fetch(GET_TASK_BY_ID.replace("{task_id}", taskId).replace("{projectId}", defaultProjectId), options);
        let responseJson = await response.json()
        const {status, data} = responseJson;
        const validationErrors = responseJson.errors
  
        if(response.status == 401){ // if unauthorised then redirect back to the login page and remove token
          localStorage.removeItem('token');
          localStorage.removeItem('defaultProjectId');
          Router.push('/login');
        }
  
        if (status){
          toast.success(TASK_FETCHED_SUCCESS_MESSAGE);
          const task = data.task;
          setTaskPriority(task.priority? task.priority : '');
          setTaskStatus(task.status? task.status : '');
          setTaskType(task.type? task.type : '');
          setTaskTitle(task.title? task.title : '');
          setDescription(task.description? task.description : '');
          setAssignTo(task.assigned_to ? task.assigned_to : '');
        }
        else{
          // setTask([]);
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
        toast.error(error.message);
    }
  };

  const getAllProjects = async() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem('token')
      },
    }
    const toastId = toast.loading('Waiting...');
    try {
      const response = await fetch(GET_ALL_PROJECTS, options);
      let responseJson = await response.json()
      const {status, data} = responseJson;
      const validationErrors = responseJson.errors

      if(response.status == 401){ // if unauthorised then redirect back to the login page and remove token
        localStorage.removeItem('token');
        localStorage.removeItem('defaultProjectId');
        Router.push('/login');
      }

      if (status){
        // toast.success(PROJECTS_FETCHED_SUCCESS_MESSAGE);
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
          toast.error(errorMessage.replace(/,\s*$/, "")); // replace comma before setting the error
        }
        else{
          toast.error(responseJson.error.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
      // console.log(error.message);
    }
    toast.dismiss(toastId);
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
      const response = await fetch(GET_ALL_USERS, options);
      let responseJson = await response.json()
      const {status, data} = responseJson;
      const validationErrors = responseJson.errors

      if(response.status == 401){ // if unauthorised then redirect back to the login page and remove token
        localStorage.removeItem('token');
        localStorage.removeItem('defaultProjectId');
        Router.push('/login');
      }

      if (status){
        // toast.success(USERS_FETCHED_SUCCESS_MESSAGE);
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
          toast.error(errorMessage.replace(/,\s*$/, "")); // replace comma before setting the error
        }
        else{
          toast.error(responseJson.error.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
      // console.log(error.message);
    }
  };

  const getAllProjectMembers = async() => {
    if (!defaultProjectId){
      setProjectMembers([]);
      return;
    }
    // console.log(token);
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem('token')
      },
    }
    
    try {
      const response = await fetch(GET_ALL_PROJECT_MEMBERS.replace("{projectId}", defaultProjectId), options);
      let responseJson = await response.json()
      const {status, data} = responseJson;
      const validationErrors = responseJson.errors

      if(response.status == 401){ // if unauthorised then redirect back to the login page and remove token
        localStorage.removeItem('token');
        localStorage.removeItem('defaultProjectId');
        Router.push('/login');
      }

      if (status){
        setProjectMembers([...data.projectMember]);
      }
      else{
        setProjectMembers([]);
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
      toast.error(error.message);
      // console.log(error.message);
    }
    
  };

  useEffect(() => {
    if(clickedTaskId){
      handleClickOpen();
      getTaskById(clickedTaskId);
    }
  },[clickedTaskId]);

  return (
    <>
      <Toaster />
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth={true}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
            <DialogContentText></DialogContentText>
            <Divider />
            <Stack>

            <FormControl variant="standard" sx={{ minWidth: 120 }}>
              <InputLabel id="project">Select Project</InputLabel>
              <Select
              required
              labelId="project"
              id="project"
              name="project_id"
              value={defaultProjectId}
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

            <FormControl variant="standard" sx={{ minWidth: 120, mt:4, mb:4 }}>
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

              <TextField mt={4} mb={4} value={taskTitle} name="taskTitle" label="Title" variant="standard" onChange={handleChange} />

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
            <FormControl variant="standard" sx={{ minWidth: 120, mt:4 }}>
              <InputLabel id="project">Assign To</InputLabel>
              <Select
              required
              labelId="assign_to"
              id="assign_to"
              name="assign_to"
              value={assignTo}
              onChange={handleChange}
              label="Assign To"
              >
              <MenuItem value=""><em>None</em></MenuItem>
              {projectMembers.map((projectMember) => {
                return <MenuItem key={projectMember.id} value={projectMember.id}>{projectMember.user_id.f_name} {projectMember.user_id.l_name}</MenuItem>
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
};

export default EditTaskForm;