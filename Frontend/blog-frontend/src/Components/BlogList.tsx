import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Box,
  CircularProgress,
  Modal,
  TextField,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';

interface BlogPost {
  id: string;
  title: string;
  content: string;
}

const BlogList: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<{ data: BlogPost[] }>('/api/blog', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data && Array.isArray(response.data.data)) {
          setBlogPosts(response.data.data);
        } else {
          setError('Invalid data format received.');
        }
      } catch (error) {
        setError('Error fetching blog posts.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, [token]);

  const handleEditClick = (post: BlogPost) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (postId: string) => {
    try {
      await axios.delete(`/api/blog/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlogPosts(blogPosts.filter(post => post.id !== postId));
    } catch (error) {
      setError("Error deleting the blog post.");
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setEditingPost(null);
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;
    
    try {
      const payload = {
        id: editingPost.id,
        title: editingPost.title,
        content: editingPost.content,
      };
  
      await axios.put(`/api/blog/${editingPost.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      setBlogPosts(blogPosts.map(post => (post.id === editingPost.id ? editingPost : post)));
      handleModalClose();
    } catch (error) {
      const err = error as any;  // Cast error to any
      console.error('Error updating the blog post:', err.response?.data || err.message);
      setError('There was an issue updating your blog post. Please try again.');
    }
  };
    

  const toggleExpandPost = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Blog Posts
      </Typography>
      <Grid container spacing={4}>
        {blogPosts.length > 0 ? (
          blogPosts.map((blogPost) => (
            <Grid item xs={12} key={blogPost.id}>
              <Card onClick={() => toggleExpandPost(blogPost.id)} sx={{ cursor: 'pointer' }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {blogPost.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                    {expandedPostId === blogPost.id
                      ? blogPost.content
                      : `${blogPost.content.slice(0, 100)}${blogPost.content.length > 100 ? '...' : ''}`}
                  </Typography>
                  {expandedPostId === blogPost.id && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button variant="contained" color="primary" onClick={() => handleEditClick(blogPost)}>
                        Edit
                      </Button>
                      <Button variant="contained" color="secondary" onClick={() => handleDeleteClick(blogPost.id)}>
                        Delete
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', marginTop: 4 }}>
            <Typography>No blog posts available.</Typography>
            <Button
              component={Link}
              to="/create-blog"
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
            >
              Create a Blog
            </Button>
          </Box>
        )}
      </Grid>

      {/* Edit Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={handleModalClose}
        aria-labelledby="edit-blog-modal"
        aria-describedby="edit-blog-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          {editingPost && (
            <Box>
              <Typography id="edit-blog-modal" variant="h6" component="h2">
                Edit Blog Post
              </Typography>
              <TextField
                fullWidth
                label="Title"
                margin="normal"
                value={editingPost.title}
                onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
              />
              <TextField
                fullWidth
                label="Content"
                margin="normal"
                multiline
                rows={4}
                value={editingPost.content}
                onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                <Button variant="contained" color="primary" onClick={handleUpdatePost}>
                  Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleModalClose} sx={{ marginLeft: 2 }}>
                  Cancel
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default BlogList;
