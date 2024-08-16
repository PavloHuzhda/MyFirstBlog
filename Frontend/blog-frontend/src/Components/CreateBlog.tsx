import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';

const CreateBlog: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      // Include the token in the headers
      await axios.post('/api/blog', 
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/blogs'); // Redirect to the blog list after successful creation
    } catch (error) {
      console.error('Error creating blog post:', error);
      setError('There was an issue creating your blog post. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: '0 auto',
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Create a New Blog Post
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Content"
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          multiline
          rows={4}
          margin="normal"
        />
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CreateBlog;
