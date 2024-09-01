import axios from "axios";
import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { Avatar, Button, Grid, Link, Paper, styled, TextField, Typography } from "@mui/material";
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
    const { login  } = useAuth();
    const navigate = useNavigate ();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(''); // Clear previous errors
        try {
            const response = await axios.post('/api/account/login', {userNameOrEmail, password});
            login(response.data.token);
            // console.log('Login successful', response.data);
            navigate('/blogs'); // Redirect to home after successful login
        } catch (error) {
            console.error('Login failed', error);
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <Grid container justifyContent="center" alignItems="center">
            <Grid item>
                <SigninPaper elevation={10} >
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
                        <Link href="/forgot-password" >Forgot password?</Link>                    
                    </Typography>
                    <Typography> 
                        Don't have an account?
                        <Link href="/register"> Sign Up</Link>
                    </Typography>
                </SigninPaper>
            </Grid>
        </Grid>
    )
}

export default Login;
