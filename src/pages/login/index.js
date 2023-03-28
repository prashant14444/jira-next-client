import {useState} from 'react';
import Router from 'next/router';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';

import {LOGIN_ROUTE} from '../../routes/auth.js';
import { useEffect } from 'react';

console.log("sdkjsdfjk");
export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    switch(e.target.name){
      case 'email':
        setEmail(e.target.value);
        break;
      
      case 'password':
        setPassword(e.target.value);
        break;

      default:
        break;
    }
  }

  const handleSubmit = async(e) => {
    setLoading(true);
    const options = {
      method: "POST",
      body: JSON.stringify({email, password}),
      headers: {
        "Content-Type": "application/json",
      },
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess(false);
      const response = await fetch(LOGIN_ROUTE, options);
      let responseJson = await response.json()
      const {status, data} = responseJson;
      
      setSuccess(status);
      if (status){
        localStorage.setItem('token', data.user.token);
        Router.push("/projects");
      }
      else{
        setError(responseJson.error.message);
      }
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
        const token = localStorage.getItem('token');
        if (token){
            Router.push("/projects");
        }
  })

  return (
    <Box sx={{ flexGrow: 1 }}>
      <div style={{margin: '15% 30% 15% 30%'}}>
        <Box mt={4}>
          <Stack>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">Logged In..</Alert>}
            
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

            <LoadingButton
              size="small"
              onClick={handleSubmit}
              loading={loading}
              loadingIndicator="Logging In..."
              variant="contained"
              sx={{marginTop: '20px'}}
            >
              <span>Login</span>
            </LoadingButton>

          </Stack>
        </Box>
      </div>
    </Box>
  );
}