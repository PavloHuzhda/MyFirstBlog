import React from 'react';
import { Box, Container, Typography, Link, IconButton } from '@mui/material';
import { GitHub, LinkedIn, Email, MailOutline } from '@mui/icons-material'; // Import icons from Material-UI

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
        <Typography sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          My social networks:
        </Typography>        
        {/* Social Media Icons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          {/* GitHub */}
          <IconButton
            component="a"
            href="https://github.com/PavloDeveloper9"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
          >
            <GitHub />
          </IconButton>

          {/* LinkedIn */}
          <IconButton
            component="a"
            href="https://www.linkedin.com/in/pavlo-huzhda-a62781172/"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
          >
            <LinkedIn />
          </IconButton>

          {/* Gmail */}
          <IconButton
            component="a"
            href="mailto:pavlohuzhda@gmail.com"
            color="inherit"
          >
            <Email />
          </IconButton>

          {/* Microsoft Mail */}
          <IconButton
            component="a"
            href="mailto:pavlohuzhda@outlook.com"
            color="inherit"
          >
            <MailOutline />
          </IconButton>
        </Box>

        <Copyright />
      </Container>
    </Box>
  );
};

export default Footer;
