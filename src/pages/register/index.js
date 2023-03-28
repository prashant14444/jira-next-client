import {useState} from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';


import {REGISTER_USER_ROUTE} from '../../routes/auth.js';
import {USER_CREATED_SUCCESS_MESSAGE} from '../../messages/message.js';

export default function Register({token}) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    console.log(e.target.name)
    switch(e.target.name){
        case 'email':
            setEmail(e.target.value);
            break;
      
        case 'password':
            setPassword(e.target.value);
            break;

        case 'confirm_password':
            setConfirmPassword(e.target.value);
            break;

        case 'f_name':
            setFirstName(e.target.value);
            break;

        case 'l_name':
            setLastName(e.target.value);
            break;

        case 'role':
            console.log(e.target.value)
            setRole(e.target.value);
            break;

        case 'username':
            setUsername(e.target.value);
            break;

        default:
            break;
    }
  }

  const handleSubmit = async(e) => {
    setLoading(true);
    const options = {
      method: "POST",
      body: JSON.stringify({f_name:firstName, l_name: lastName, email, password, username, confirm_password: confirmPassword, role}),
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token
      },
    }
    
    try {
      setError('');
      setSuccess('');
      console.log(REGISTER_USER_ROUTE);
      const response = await fetch(REGISTER_USER_ROUTE, options);
      let responseJson = await response.json()
      const {status, data} = responseJson;
      const validationErrors = responseJson.errors
      if (status){
        setSuccess(USER_CREATED_SUCCESS_MESSAGE);
      }
      else{
        let validationErrorsArray = Object.keys(validationErrors).map((key) => validationErrors[key]);
        if(validationErrors){
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
      console.log(error.message);
    }
    setLoading(false);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <div style={{margin: '15% 30% 15% 30%'}}>
        <Box mt={4}>
          <Stack>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            
            <TextField
              required
              id="f_name"
              label="First Name"
              name="f_name"
              type="text"
              size="small"
              margin="normal"
              variant="standard"
              defaultValue={firstName}
              onChange={handleChange}
            />

            <TextField
              id="l_name"
              label="Last Name"
              name="l_name"
              type="text"
              size="small"
              margin="normal"
              variant="standard"
              defaultValue={lastName}
              onChange={handleChange}
            />

            <TextField
              required
              id="email"
              label="Email"
              name="email"
              type="text"
              size="small"
              margin="normal"
              variant="standard"
              defaultValue={email}
              onChange={handleChange}
            />

            <TextField
              required
              id="password"
              label="Password"
              name="password"
              size="small"
              type="password"
              variant="standard"
              margin="normal"
              defaultValue={password}
              onChange={handleChange}
            />

            <TextField
              required
              id="confirm_password"
              label="Confirm Password"
              name="confirm_password"
              size="small"
              type="password"
              variant="standard"
              margin="normal"
              defaultValue={confirmPassword}
              onChange={handleChange}
            />

            <TextField
              required
              id="username"
              label="Username"
              name="username"
              type="text"
              size="small"
              margin="normal"
              variant="standard"
              defaultValue={username}
              onChange={handleChange}
            />

            <FormControl variant="standard" sx={{ minWidth: 120 }}>
                <InputLabel id="role">Role</InputLabel>
                <Select
                required
                labelId="role"
                id="user-role"
                name="role"
                value={role}
                onChange={handleChange}
                label="Role *"
                >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value='admin'>Admin</MenuItem>
                <MenuItem value='user'>User</MenuItem>
                </Select>
            </FormControl>

            <LoadingButton
              size="small"
              onClick={handleSubmit}
              loading={loading}
              loadingIndicator="Registering..."
              variant="contained"
              sx={{marginTop: '20px'}}
            >
              <span>Submit</span>
            </LoadingButton>

          </Stack>
        </Box>
      </div>
    </Box>
  );
}