import axios from "axios";
import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { Avatar, Button, Grid, Link, Paper, styled, TextField, Typography, Modal, Box } from "@mui/material";
import { SecurityOutlined } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';

const SigninPaper = styled(Paper)({
    padding: 20,
    height: '70vh',
    width: '40vh',
    margin: "20px auto"
}); 

const Login: React.FC = () => {
    const [userNameOrEmail, setUserNameOrEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(''); // Clear previous errors
        try {
            const response = await axios.post('/api/account/login', { userNameOrEmail, password });
            login(response.data.token);
            navigate('/blogs'); // Redirect to home after successful login
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 400 && error.response?.data.includes("not been confirmed")) {
                setError("Your email has not been confirmed. A new confirmation email has been sent.");
                setModalOpen(true); // Open modal if the email is not confirmed
            } else {
                setError('Login failed. Please check your credentials.');
            }
        }
    };

    return (
        <Grid container justifyContent="center" alignItems="center">
            <Grid item>
                <SigninPaper elevation={10}>
                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid item>
                            <Avatar sx={{ background: "black" }}>
                                <SecurityOutlined />
                            </Avatar>
                        </Grid>
                        <Grid item>
                            <Typography variant="h5">Login</Typography>
                        </Grid>
                    </Grid>
                    <form onSubmit={handleLogin}>
                        <TextField
                            id="UserNameOrEmail"
                            label="Username or Email"
                            variant="standard"
                            placeholder="Enter your username or email"
                            fullWidth
                            autoFocus
                            autoComplete="email"
                            required
                            value={userNameOrEmail}
                            onChange={(e) => setUserNameOrEmail(e.target.value)}
                        />
                        <TextField
                            id="password"
                            type="password"
                            label="Password"
                            variant="standard"
                            placeholder="Enter your password"
                            fullWidth
                            required
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && (
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            style={{ margin: '8px 0' }}
                            variant="contained"
                            sx={{
                                color: 'white',
                                backgroundColor: 'black',
                                '&:hover': {
                                    backgroundColor: '#757575',
                                },
                            }}
                            fullWidth
                        >
                            Login
                        </Button>
                    </form>
                    <Typography>
                        <Link href="/forgot-password">Forgot password?</Link>
                    </Typography>
                    <Typography>
                        Don't have an account?
                        <Link href="/register"> Sign Up</Link>
                    </Typography>
                </SigninPaper>
                {/* Confirmation Modal */}
                <Modal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    aria-labelledby="confirmation-modal-title"
                    aria-describedby="confirmation-modal-description"
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
                        <Typography id="confirmation-modal-title" variant="h6">
                            Email Confirmation Required
                        </Typography>
                        <Typography id="confirmation-modal-description" sx={{ mt: 2 }}>
                            Your email is not confirmed. A new confirmation link has been sent to your email.
                        </Typography>
                        <Button onClick={() => setModalOpen(false)} sx={{ mt: 2 }} variant="contained" color="primary">
                            OK
                        </Button>
                    </Box>
                </Modal>
            </Grid>
        </Grid>
    );
};

export default Login;
