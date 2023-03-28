import Router from 'next/router';
import Box from '@mui/material/Box';
import Link from 'next/link.js';


console.log("sdkjsdfjk");
export default function Login() {
  

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Link href="/login">Login</Link>
    </Box>
  );
}