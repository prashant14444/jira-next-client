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

import {CREATE_PROJECT_MEMBER, GET_ALL_USERS, GET_ALL_PROJECTS} from '../../routes/auth.js';
import {PROJECT_MEMBER_CREATED_SUCCESS_MESSAGE, PROJECTS_FETCHED_SUCCESS_MESSAGE, USERS_FETCHED_SUCCESS_MESSAGE} from '../../messages/message.js';
import {PROJECT_MEMBERS_DESIGNATIONS} from '../../constants/project_member_designations.js';

export default function CreateUserForm({addMember}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [projectMember, setProjectMember] = useState('');
  const [designation, setDesignation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const handleChange = (e) => {
    console.log(e.target.name)
    switch(e.target.name){
      case 'project_id':
        setProjectId(e.target.value);
        break;
    
      case 'project_member_id':
        setProjectMember(e.target.value);
        break;

      case 'confirm_password':
        setConfirmPassword(e.target.value);
        break;

      case 'designation':
        console.log(e.target.value)
        setDesignation(e.target.value);
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
    setProjectMember('');
    setProjects([]);
    setUsers([]);
    setDesignation('');
  };

  const handleSubmit = async(e) => {
    setLoading(true);
    const options = {
      method: "POST",
      body: JSON.stringify({project_id:projectId, user_id: projectMember, designation}),
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem('token')
      },
    }
    
    try {
      setError('');
      setSuccess('');

      const response = await fetch(CREATE_PROJECT_MEMBER, options);
      let responseJson = await response.json()
      const {status, data} = responseJson;
      const validationErrors = responseJson.errors
      if (status){
        setSuccess(PROJECT_MEMBER_CREATED_SUCCESS_MESSAGE);
        addMember(data.projectMember);
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
        localStorage.removeItem('defaultProjectId');
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
        localStorage.removeItem('defaultProjectId');
        Router.push('/login');
      }

      if (status){
        setSuccess(USERS_FETCHED_SUCCESS_MESSAGE);
        setUsers([...data.user]);
      }
      else{
        setUsers([]);
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
            <DialogContentText></DialogContentText>
            <Divider />
            <Stack sx={{width:"55vh"}}>
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
              <InputLabel id="project-member">Project Member</InputLabel>
              <Select
              required
              labelId="project-member"
              id="project-member"
              name="project_member_id"
              value={projectMember}
              onChange={handleChange}
              label="Project Member *"
              >
              
              {users.map((user) => {
                return <MenuItem key={user.id} value={user.id}>{user.f_name} {user.l_name}</MenuItem>
              })}
              </Select>
            </FormControl>

            <FormControl variant="standard" sx={{ minWidth: 120, mt:4 }}>
              <InputLabel id="designation">Designation</InputLabel>
              <Select
              required
              labelId="designation"
              id="user-designation"
              name="designation"
              value={designation}
              onChange={handleChange}
              label="Designation *"
              >
              <MenuItem value=""><em>None</em></MenuItem>
              {PROJECT_MEMBERS_DESIGNATIONS.map((designation) => {
                return <MenuItem key={designation.value} value={designation.value}>{designation.name}</MenuItem>
              })}
              </Select>
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