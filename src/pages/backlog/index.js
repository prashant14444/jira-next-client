import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export default function Backlog({token}) {
  console.log(token);
  return (
    <Box sx={{ flexGrow: 1 }}>
        <div role="presentation">
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/">
              Home
            </Link>
            <Typography color="text.primary">Backlog</Typography>
          </Breadcrumbs>
        </div>
        <h1>Backlog page</h1>
    </Box>
  );
}