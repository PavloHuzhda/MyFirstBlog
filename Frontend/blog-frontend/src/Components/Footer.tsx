import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import { useAuth } from '../Contexts/AuthContext';
import { Link as RouterLink } from 'react-router-dom';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Footer: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body1">
          My sticky footer can be found here.
        </Typography>
        {isAuthenticated && (
          <Link component={RouterLink} to="/logout" color="inherit">
            Logout
          </Link>
        )}
        <Copyright />
      </Container>
    </Box>
  );
};

export default Footer;
