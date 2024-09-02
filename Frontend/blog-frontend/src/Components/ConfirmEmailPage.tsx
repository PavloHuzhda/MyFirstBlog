import React, { useState } from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ConfirmEmailPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [confirmationSuccess, setConfirmationSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
      // Assuming you have token and email in the URL or context
      const token = new URLSearchParams(window.location.search).get('token');
      const email = new URLSearchParams(window.location.search).get('email');
      
      if (!token || !email) {
        setError("Invalid or missing token/email.");
        return;
      }

      // Make an API call to confirm the email
      const response = await axios.get(`/api/account/confirm-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`);

      if (response.status === 200) {
        setConfirmationSuccess(true);
        setOpen(true);
      } else {
        setError("Failed to confirm email.");
      }
    } catch (err) {
      setError("An error occurred during email confirmation.");
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (confirmationSuccess) {
      navigate('/login'); // Redirect to login after successful confirmation
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', textAlign: 'center', padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Confirm Your Email
      </Typography>
      <Typography variant="body1" gutterBottom>
        Are you ready to confirm your email address?
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 2 }}
        onClick={handleConfirm}
      >
        Confirm Email
      </Button>

      {error && (
        <Typography color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="confirmation-success"
        aria-describedby="confirmation-success-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography id="confirmation-success" variant="h6" component="h2">
            Email Confirmed
          </Typography>
          <Typography id="confirmation-success-description" sx={{ mt: 2 }}>
            Your email has been successfully confirmed.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            onClick={handleClose}
          >
            OK
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ConfirmEmailPage;
