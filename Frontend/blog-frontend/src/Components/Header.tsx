import React from "react";
import { AppBar, Box, Button, styled, Toolbar } from "@mui/material";
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {    

    // Define styles for the boxes that hold the buttons
    const LeftBox = styled(Box)({
        flex: 1, // Takes up space on the left
        display: 'flex',
        justifyContent: 'flex-start', // Aligns items to the left
    });

    const CenterBox = styled(Box)({
        flex: 1, // Takes up space in the center
        display: 'flex',
        justifyContent: 'center', // Aligns items to the center
    });

    const RightBox = styled(Box)({
        flex: 1, // Takes up space on the right
        display: 'flex',
        justifyContent: 'flex-end', // Aligns items to the right
    });

    return (
        <AppBar position="fixed" sx={{ background: "black" }} >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                {/* Left Box */}
                <LeftBox>
                    <Button 
                        component={Link} 
                        to="/create-blog" 
                        sx={{
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#757575',
                            },
                        }}
                    >
                        Create my blog
                    </Button>
                </LeftBox>

                {/* Center Box */}
                <CenterBox>
                    <Button 
                        component={Link} 
                        to="/blogs" 
                        sx={{
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#757575',
                            },
                        }}
                    >
                        MyBlog
                    </Button>
                </CenterBox>

                {/* Right Box */}
                <RightBox>
                    <Button 
                        component={Link} 
                        to="/logout" 
                        sx={{
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#757575',
                            },
                        }}
                    >
                        Logout
                    </Button>
                </RightBox>
            </Toolbar>
        </AppBar>
    );
};

