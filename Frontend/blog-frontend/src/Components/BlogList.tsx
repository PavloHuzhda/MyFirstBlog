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
  TablePagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  InputBase,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { Search as SearchIcon, Sort as SortIcon } from '@mui/icons-material';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  createdDate: string;
}

const BlogList: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('createdDate');
  const [sortDirection, setSortDirection] = useState<string>('asc');
  const { token } = useAuth();

  useEffect(() => {
    fetchBlogPosts();
  }, [page, rowsPerPage, token, sortOption, sortDirection]);

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<{ data: BlogPost[]; totalCount: number }>('/api/blog', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          pageNum: page + 1, // page is zero-based, API expects 1-based
          pageSize: rowsPerPage,
          search: searchQuery, // Pass search query to API
          sortBy: sortOption, // Pass sort option to API
          sortDirection: sortDirection, // Pass sort direction to API
        },
      });
      if (response.data && Array.isArray(response.data.data)) {
        setBlogPosts(response.data.data);
        setTotalCount(response.data.totalCount);
      } else {
        setError('Invalid data format received.');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        setTimeout(() => {
          window.location.href = '/login'; // Redirect to login page after a short delay
        }, 3000); // 3 seconds delay
      } else {
        setError('Error fetching blog posts: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      fetchBlogPosts(); // Trigger search when "Enter" is pressed
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortOption(event.target.value as string);
    setPage(0); // Reset to the first page on a new sort option
  };

  const handleSortDirectionToggle = () => {
    setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
    setPage(0); // Reset to the first page on a new sort direction
  };

  const handleEditClick = (post: BlogPost) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (postId: string) => {
    try {
      await axios.delete(`/api/blog/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      fetchBlogPosts();
    } catch (error) {
      setError('Error deleting the blog post.');
      console.error('Error deleting the blog post:', error);
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

      setBlogPosts(blogPosts.map((post) => (post.id === editingPost.id ? editingPost : post)));
      handleModalClose();
    } catch (error) {
      const err = error as any; // Cast error to any
      console.error('Error updating the blog post:', err.response?.data || err.message);
      setError('There was an issue updating your blog post. Please try again.');
    }
  };

  const toggleExpandPost = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when rows per page changes
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

  // If no blog posts are available, show only the message and button
  if (blogPosts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Typography variant="h6">You have no posts.</Typography>
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
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      {/* Main content displayed only if there are posts */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <InputBase
          id="outlined-basic"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown} // Trigger search on Enter key press
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          sx={{
            width: '300px',
            border: '1px solid #707070',
            padding: '0 10px',
            height: '40px',
            borderRadius: '4px',
            '&:focus-within': { border: '1px solid black' },
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControl variant="outlined" sx={{ minWidth: 120, marginRight: 2 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOption}
              onChange={handleSortChange}
              label="Sort By"
              sx={{
                height: '40px',
                '&.Mui-focused': {
                  borderColor: 'green', // Change border color to green on focus
                },
                '&:focus-within': { borderColor: 'black' },
              }}
            >
              <MenuItem value="createdDate">Date</MenuItem>
              <MenuItem value="title">Title</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={handleSortDirectionToggle}>
            <SortIcon sx={{ transform: sortDirection === 'asc' ? 'rotate(0deg)' : 'rotate(180deg)' }} />
          </IconButton>
        </Box>
      </Box>
      <Typography variant="h4" gutterBottom>
        My Blog Posts
      </Typography>
      <Grid container spacing={4}>
        {blogPosts.map((blogPost) => (
          <Grid item xs={12} key={blogPost.id}>
            <Card onClick={() => toggleExpandPost(blogPost.id)} sx={{ cursor: 'pointer' }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {blogPost.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', marginBottom: 1 }}>
                  {new Date(blogPost.createdDate).toLocaleString()} {/* Formats the date */}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2, whiteSpace: 'pre-line' }}>
                  {expandedPostId === blogPost.id
                    ? blogPost.content
                    : `${blogPost.content.slice(0, 10)}${blogPost.content.length > 10 ? '...' : ''}`}
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
        ))}
      </Grid>

      {/* Edit Modal */}
      <Modal
        disableAutoFocus
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
      {/* Pagination Component */}
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[3, 5, 10, 25]}
      />
    </Box>
  );
};

export default BlogList;
