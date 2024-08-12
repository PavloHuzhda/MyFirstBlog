import { CheckBox, PersonAdd } from "@mui/icons-material";
import { Avatar, Button, FormControlLabel, Grid, Paper, styled, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";


const Register: React.FC = () => {
    const SignupPaper = styled(Paper)({
        padding: "30px 20px",
        height: '70vh',
        width: '40vh',
        margin: "20px auto"
    });

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {        
        try{
            const response = await axios.post('/api/account/register', {firstName, lastName, email, password});
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }        
    };


    return (
        <Grid>
            <SignupPaper elevation={20}>
                <a href=""></a>
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
                        <Typography variant="h5" sx={{margin:0}}>Sign Up</Typography>
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
                        autoFocus 
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
                        autoFocus 
                        autoComplete="lastname" 
                        required 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <TextField 
                        id="email" 
                        label="Email" 
                        variant="standard" 
                        placeholder="Enter your email" 
                        fullWidth 
                        autoFocus 
                        autoComplete="email" 
                        required 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField 
                        id="password" 
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
                        control={<CheckBox name="CheckedA" />}
                        label="I accept the terms and conditions."
                    />
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

            </SignupPaper>
        </Grid>
        // <div>
        //     <h2>Register</h2>
        //     <input 
        //         type="firstname"
        //         placeholder="First Name"
        //         value={firstName}
        //         onChange={(e) => setFirstName(e.target.value)}
        //     />
        //     <input 
        //         type="lastname"
        //         placeholder="Last Name"
        //         value={lastName}
        //         onChange={(e) => setLastName(e.target.value)}
        //     />
        //     <input 
        //         type="email"
        //         placeholder="Email"
        //         value={email}
        //         onChange={(e) => setEmail(e.target.value)}
        //     />
        //     <input 
        //         type="password"
        //         placeholder="Password"
        //         value={password}
        //         onChange={(e) => setPassword(e.target.value)}
        //     />
        //     <button onClick={handleRegister}>Register</button>
        // </div>
    );
};

export default Register;