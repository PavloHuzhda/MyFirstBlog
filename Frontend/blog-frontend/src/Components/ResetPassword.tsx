import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
  const { token, email } = useParams<{ token: string; email: string }>();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/account/reset-password', { token, email, password });
      setMessage('Password has been reset successfully.');
      navigate('/login');
    } catch (error) {
      setMessage('Error resetting password.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>Reset Password</Typography>
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
