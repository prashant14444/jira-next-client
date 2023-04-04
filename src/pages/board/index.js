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
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import { GET_ALL_PROJECTS, GET_ALL_TASKS } from '../../routes/auth.js';
import { PROJECTS_FETCHED_SUCCESS_MESSAGE, TASKS_FETCHED_SUCCESS_MESSAGE } from '../../messages/message.js';
import { Divider } from '@mui/material';

export default function Board({token}) {
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [projects, setProjects] = useState([]);
  const [spacing, setSpacing] = useState(4);
  const [tasks, setTasks] = useState([]);

  const handleProjectChange = (event) => {
    const projectId = event.target.value;
    console.log("changed project id to ", projectId);
    setSelectedProjectId(projectId);
    getAllTasks(projectId);
  };

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

  const addMoreTask = (task) => {
    console.log("task", task);
  };

  const handleChange = (event) => {
    setSpacing(Number(event.target.value));
  };

  const jsx = `<Grid container spacing={${spacing}}>`;

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

      <Grid sx={{ flexGrow: 1 }} container spacing={2} mt={2}>
      <Grid item xl={12}>
        <Grid container justifyContent="center" spacing={spacing}>
          {["todo", "in-progress", "qa", "done"].map((value) => (
            <Grid key={value} item>
              <InputLabel sx={{marginBottom: "10px", color: "primary.main"}}>{value.toUpperCase()}</InputLabel>
              <Paper
                sx={{
                  minHeight: "40vh",
                  maxHeight: "auto",
                  width: "35vh",
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'primary.main',
                  backgroundColor: "#F4F1F0"
                }}
              >
                {tasks.map((task) => {
                  if(task.status != value)
                    return <></>;

                  switch (task.status) {
                    case 'todo':
                      return (
                        <Card sx={{ maxWidth: 345, margin:"10px", maxHeight: 300 }}>
                          <CardMedia
                            sx={{ height: 100 }}
                            image={"/static/images/cards/contemplative-reptile.jpg"}
                            title="green iguana"
                            />
                          <CardContent>
                            <Typography variant="body2" color="text.secondary">{task.title}</Typography>
                          </CardContent>
                          <CardActions>
                            <CheckBoxIcon />
                            <Button size="small">Share</Button>
                            <Button size="small">Learn More</Button>
                          </CardActions>
                        </Card>
                      );
                    case 'in-progress':
                      return (
                        <Card sx={{ maxWidth: 345, margin:"10px", maxHeight: 300 }}>
                          <CardMedia
                            sx={{ height: 100 }}
                            image={"/static/images/cards/contemplative-reptile.jpg"}
                            title="green iguana"
                            />
                          <CardContent>
                            <Typography variant="body2" color="text.secondary">{task.title}</Typography>
                          </CardContent>
                          <CardActions>
                            <CheckBoxIcon />
                            <Button size="small">Share</Button>
                            <Button size="small">Learn More</Button>
                          </CardActions>
                        </Card>
                      );
                    case 'qa':
                      return (
                        <Card sx={{ maxWidth: 345, margin:"10px", maxHeight: 300 }}>
                          <CardMedia
                            sx={{ height: 100 }}
                            image={"/static/images/cards/contemplative-reptile.jpg"}
                            title="green iguana"
                            />
                          <CardContent>
                            <Typography variant="body2" color="text.secondary">{task.title}</Typography>
                          </CardContent>
                          <CardActions>
                            <CheckBoxIcon />
                            <Button size="small">Share</Button>
                            <Button size="small">Learn More</Button>
                          </CardActions>
                        </Card>
                      );
                    case 'done':
                      return (
                        <Card sx={{ maxWidth: 345, margin:"10px", maxHeight: 300 }}>
                          <CardMedia
                            sx={{ height: 100 }}
                            image={"/static/images/cards/contemplative-reptile.jpg"}
                            title="green iguana"
                            />
                          <CardContent>
                            <Typography variant="body2" color="text.secondary">{task.title}</Typography>
                          </CardContent>
                          <CardActions>
                            <CheckBoxIcon />
                            <Button size="small">Share</Button>
                            <Button size="small">Learn More</Button>
                          </CardActions>
                        </Card>
                      );

                    default:
                      return<></>;
                  }
                })}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
      
    </Grid>
    </>
  );
}