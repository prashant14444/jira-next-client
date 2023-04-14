import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CreateTaskForm from './task-create.js';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Router from 'next/router.js';
import dynamic from "next/dynamic";
import { DragDropContext } from 'react-beautiful-dnd';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { deepOrange } from '@mui/material/colors';

import { GET_ALL_PROJECTS, GET_ALL_TASKS, UPDATE_TASK_STATUS, GET_ALL_PROJECT_MEMBERS } from '../../routes/auth.js';
import { PROJECTS_FETCHED_SUCCESS_MESSAGE, TASKS_FETCHED_SUCCESS_MESSAGE, TASK_UPDATED_SUCCESS_MESSAGE, PROJECT_MEMBERS_FETCHED_SUCCESS_MESSAGE } from '../../messages/message.js';
import { Divider } from '@mui/material';



const Column = dynamic(() => import("./column.js"), { ssr: false });

export default function Board({token}) {
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [projects, setProjects] = useState([]);
  const [spacing, setSpacing] = useState(4);
  const [tasks, setTasks] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);

  const handleProjectChange = (event) => {
    const projectId = event.target.value;
    console.log("changed project id to ", projectId);
    setSelectedProjectId(projectId);
    getAllTasks(projectId);
    getAllProjectMembers(projectId)
  };

  function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

  const getAllTasks = async(projectId) => {
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
      const response = await fetch(GET_ALL_TASKS.replace("{projectId}", projectId), options);
      let responseJson = await response.json()
      const {status, data} = responseJson;
      const validationErrors = responseJson.errors

      if(response.status == 401){ // if unauthorised then redirect back to the login page and remove token
        localStorage.removeItem('token');
        Router.push('/login');
      }

      if (status){
        setSuccess(TASKS_FETCHED_SUCCESS_MESSAGE);
        setTasks([...data.task]);
      }
      else{
        setTasks([]);
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
  }

  const updateTaskStatus = async(taskId, status) => {
    let token = localStorage.getItem('token');
    const options = {
       method: "PUT",
      //  url: UPDATE_TASK_STATUS.replace('{taskId}', taskId).replace('{projectId}', selectedProjectId),
       body: JSON.stringify({status}),
       headers: {
         "Content-Type": "application/json",
         "x-access-token": token
       },
    }
     
    try {
      setError('');
      setSuccess('');
      const response = await fetch(UPDATE_TASK_STATUS.replace('{taskId}', taskId).replace('{projectId}', selectedProjectId), options);
      let responseJson = await response.json()
      const {status, data} = responseJson;
      const validationErrors = responseJson.errors

      if(response.status == 401){ // if unauthorised then redirect back to the login page and remove token
        Router.push('/login');
        localStorage.removeItem('token');
      }

      if (status){
          setSuccess(TASK_UPDATED_SUCCESS_MESSAGE);
          let reorderedTask = tasks.filter((task) => task.id != taskId);
          setTasks([...reorderedTask, data.task]);
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
    }
  };

  const getAllProjectMembers = async(projectId) => {
    if (!projectId){
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
      setError('');
      setSuccess('');
      const response = await fetch(GET_ALL_PROJECT_MEMBERS.replace("{projectId}", projectId), options);
      let responseJson = await response.json()
      const {status, data} = responseJson;
      const validationErrors = responseJson.errors

      if(response.status == 401){ // if unauthorised then redirect back to the login page and remove token
        localStorage.removeItem('token');
        Router.push('/login');
      }

      if (status){
        setSuccess(PROJECT_MEMBERS_FETCHED_SUCCESS_MESSAGE);
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

  const reorderColumnList = (taskId, source, destination) => {
    updateTaskStatus(taskId, destination.droppableId);
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;

    // If user tries to drop in an unknown destination
    if (!destination) return;

    // if the user drags and drops back in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = result.draggableId; // the id of the task that has been dragged

    reorderColumnList( taskId, source, destination);
  };
  const addMoreTask = (task) => {
    debugger;
    if(selectedProjectId == task.project_id)
      setTasks([...tasks, task]);
  };

  useEffect(() => {
    if (!localStorage.getItem('token')){
      localStorage.removeItem('token')
      Router.push('/login');
    }
    getAllProjects(localStorage.getItem('token'));
  }, []);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <div role="presentation">
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/">Home</Link>
            <Typography color="text.primary">Board</Typography>
          </Breadcrumbs>
        </div>
      </Box>
      <div  style={{display: "flex"}}>
        <Box sx={{marginLeft: "auto" }} >
          <CreateTaskForm addTask={addMoreTask}/>
        </Box>
        <FormControl sx={{ml: 2,  minWidth: 220, maxWidth:350 }} size='small'>
          <InputLabel id="demo-select-small">Select Project</InputLabel>
          <Select
            labelId="project-listing"
            id="project-listing"
            value={selectedProjectId}
            label="Select Project"
            onChange={handleProjectChange}
            >
            <MenuItem value=""><em>None</em></MenuItem>
            {
              projects.map((project) => {
                return <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
              })
            }
          </Select>
        </FormControl>
      </div>
      <div style={{margin: "20px"}}></div>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <Divider mt={4}/>
      <AvatarGroup max={4}>
        {projectMembers.map((projectMember) => (
          <Avatar  {...stringAvatar(`${projectMember.user_id.f_name} ${projectMember.user_id.l_name}`)} key={projectMember.id} />
        ))}
      </AvatarGroup>

    <Grid sx={{ flexGrow: 1 }} container spacing={2} mt={2}>
      <Grid item xl={12}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Grid container justifyContent="center" spacing={spacing}>
            {["todo", "in-progress", "qa", "done"].map((value) =>{
              const column = value;
              let columnTasks = tasks.filter(task => task.status == column);
              return <Column value={value} key={column} column={column} tasks={columnTasks} />;
            } )}
          </Grid>
        </DragDropContext>
      </Grid>
      
    </Grid>
    </>
  );
}