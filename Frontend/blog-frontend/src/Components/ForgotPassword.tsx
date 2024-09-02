import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/account/forgot-password', { email });
      if (response.status === 200) {
        setMessage('Error sending password reset email.');
      }
      else{
        setMessage('A password reset link has been sent to your email.');
      }
    } catch (error) {
      setMessage('Error sending password reset email.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>Forgot Password</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button variant="contained" color="primary" type="submit" sx={{ marginTop: 2 }}>
          Send Reset Link
        </Button>
      </form>
      {message && <Typography color="textSecondary" sx={{ marginTop: 2 }}>{message}</Typography>}
    </Box>
  );
};

export default ForgotPassword;
