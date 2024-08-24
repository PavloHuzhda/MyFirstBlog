import React, { useState } from "react";
import { AppBar, Box, Button, Menu, styled, Toolbar } from "@mui/material";
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {   

    const LogoBox = styled(Box)({
        display: "flex",
        gap: 10,
    });

    const MenuBox = styled(Box)({
        display: "flex",
        gap: 30,
    });    

    const MenuItems = [
        { Name: "Create my blog", Link: "/create-blog" },
    ];

    const [open, setOpen] = useState(false);   

    return (
        <AppBar position="fixed" sx={{ background: "black" }} >
            <Toolbar sx={{display: "flex", justifyContent: "space-between"}}>
                <LogoBox>
                    <Button component={Link} to="/blogs" sx={{ color: "white" }}>MyBlog</Button>
                </LogoBox>
                <MenuBox autoFocus={false} sx={{ display: { xs: 'flex', sm: 'flex', md: 'flex' } }}>
                    {MenuItems.map((item) => (
                        <Button 
                            key={item.Name} 
                            component={Link} 
                            to={item.Link} 
                            sx={{
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#757575',
                                },
                            }}
                        >
                            {item.Name}
                        </Button>
                    ))}
                </MenuBox>                
            </Toolbar>
            <Menu
                disableAutoFocus={true}
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                open={open}
                onClose={() => setOpen(!open)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                
            </Menu>
        </AppBar>
    );
};
