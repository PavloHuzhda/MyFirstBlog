import axios from "axios";
import { useState } from "react"
import { useAuth } from "../Contexts/AuthContext";
import { Avatar, Button, Grid, Link, Paper, styled, TextField, Typography } from "@mui/material";
import { SecurityOutlined } from "@mui/icons-material";


const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { setToken } = useAuth();

    const handleLogin = async () => {
        try {
            const response = await axios.post('/api/account/login', {email, password});
            setToken(response.data.token);
            console.log('Login successful', response.data);
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    const SignupPaper = styled(Paper)({
        padding: 20,
        height: '70vh',
        width: '40vh',
        margin: "20px auto"
    });    

    return (
        <Grid>
            <SignupPaper elevation={10} >

                
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
                        <h2>Login</h2>
                    </Grid>
                </Grid>                
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
                    onChange={(e) => setEmail(e.target.value)}/>
                <TextField 
                    id="password" 
                    type="password" 
                    label="Password" 
                    variant="standard" 
                    placeholder="Enter your password" 
                    fullWidth required 
                    autoComplete="current-password"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}/>
                <Button type="submit" style={{margin: '8px 0'}} variant="contained" 
                    sx={{                            
                            color:'white',
                            backgroundColor: 'black',
                            '&:hover': {
                            backgroundColor: '#757575',
                        },
                        }}
                    fullWidth
                    onClick={handleLogin}
                >
                            Login
                </Button>
                <Typography>
                    <Link href="#" >Forgot password ?</Link>                    
                </Typography>
                <Typography> Do you have an account?
                    <Link href="#"> Sign Up</Link>

                </Typography>
            </SignupPaper>
        </Grid>
        
    )
}

export default Login;