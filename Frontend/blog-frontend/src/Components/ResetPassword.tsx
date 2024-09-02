import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
 
  const email = new URLSearchParams(window.location.search).get('email'); 
  const token = new URLSearchParams(window.location.search).get('token');
  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (!token || !email) {
        setMessage("Invalid or missing token/email.");
        return;
      }

      const response = await axios.post(`/api/account/reset-password`, { 
        email, 
        token, 
        password 
      });
      if (response.status === 200) {
        setMessage('Error resetting password. Please ensure your token and email are correct.');
      }
      else{
        setMessage('Password has been reset successfully.');
        navigate('/login');
      }
      
    } catch (error) {
      setMessage('Error resetting password. Please ensure your token and email are correct.');
      console.error('Error during reset:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>Reset Password</Typography>
      <Typography variant="body1" gutterBottom>
        Resetting password for: <strong>{email}</strong>
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="New Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button variant="contained" color="primary" type="submit" sx={{ marginTop: 2 }}>
          Reset Password
        </Button>
      </form>
      {message && <Typography color="textSecondary" sx={{ marginTop: 2 }}>{message}</Typography>}
    </Box>
  );
};

export default ResetPassword;
