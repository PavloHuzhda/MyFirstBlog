import { PersonAdd } from "@mui/icons-material";
import { Avatar, Button, Checkbox, FormControlLabel, Grid, Link, Paper, styled, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPaper = styled(Paper)({
    padding: "30px 20px",
    height: '70vh',
    width: '40vh',
    margin: "20px auto"
});

const Register: React.FC = () => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');

        if (!termsAccepted) {
            setError('You must accept the terms and conditions.');
            return;
        }

        try {
            const response = await axios.post('/api/account/register', {
                firstName,
                lastName,
                userName,
                email,
                password,
              }, {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );
            console.log(response);
            console.log('Registration successful', response.data);
            navigate('/login'); // Redirect to home after successful login
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Axios-specific error handling
                if (error.response && error.response.data && Array.isArray(error.response.data)) {
                    const messages = error.response.data.map((err: any) => err.description).join(' ');
                    setError(messages);
                } else {
                    console.error('Registration failed', error.response?.data);
                    setError(error.response?.data.message || 'Registration failed. Please try again.');
                    // setError('Registration failed. Please try again.');
                }
            } else {
                // Generic error handling
                console.error('Registration failed', error);
                setError('An unexpected error occurred. Please try again.');
            }           
        }
    };

    return (
        <Grid container justifyContent="center" alignItems="center">
            <Grid item>
                <SignupPaper elevation={20}>
                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid item>
                            <Avatar sx={{ background: "black" }}>
                                <PersonAdd />
                            </Avatar>
                        </Grid>
                        <Grid item>
                            <Typography variant="h5" sx={{ margin: 0 }}>Sign Up</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="caption" gutterBottom>Please fill this form to create an account!</Typography>
                        </Grid>
                    </Grid>
                    <form onSubmit={handleRegister}>
                        <TextField 
                            id="firstName" 
                            label="First Name" 
                            variant="standard" 
                            placeholder="Enter your First Name" 
                            fullWidth 
                            autoComplete="firstName" 
                            required 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <TextField 
                            id="lastname" 
                            label="Last Name" 
                            variant="standard" 
                            placeholder="Enter your Last Name" 
                            fullWidth 
                            autoComplete="lastname" 
                            required 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <TextField 
                            id="username" 
                            label="UserName" 
                            variant="standard" 
                            placeholder="Enter your UserName" 
                            fullWidth 
                            autoComplete="username" 
                            required 
                            value={userName} 
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        <TextField 
                            id="email" 
                            label="Email" 
                            variant="standard" 
                            placeholder="Enter your email" 
                            fullWidth 
                            autoComplete="email" 
                            required 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField 
                            id="password" 
                            type="password"
                            label="Password" 
                            variant="standard" 
                            placeholder="Enter your password" 
                            fullWidth                          
                            autoComplete="password" 
                            required 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <FormControlLabel 
                            control={
                                <Checkbox 
                                    checked={termsAccepted} 
                                    onChange={(e) => setTermsAccepted(e.target.checked)} 
                                    name="terms" 
                                />
                            }
                            label="I accept the terms and conditions."
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
                            Sign up
                        </Button>
                    </form>
                    <Typography> 
                        I already have an account 
                        <Link href="/login"> Sign In</Link>
                    </Typography>
                </SignupPaper>
            </Grid>
        </Grid>
    );
};

export default Register;
