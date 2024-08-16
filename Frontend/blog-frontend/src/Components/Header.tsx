import { AppBar, Box, Button, InputBase, Menu, MenuItem, styled, Toolbar } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Link } from 'react-router-dom';
import { useState } from "react";


export const Header: React.FC = () => {

    const StyledToolbar = styled(Toolbar)(
        {
            display: "flex",
            justifyContent: "space-between",
        }
    );

    const LogoBox = styled(Box)({
        display: "flex",
        gap: 10,
    });

    const MenuBox = styled(Box)({
        display: "flex",
        gap: 30,
    });

    const SearchBox = styled(Box)({
        display: "flex",
        gap: 5,
    });

    const MenuItems = [
        { Name: "Home", Link: "/" },
        { Name: "Logout", Link: "/logout" },
        { Name: "Register", Link: "/register" },
        { Name: "Login", Link: "/login" },
    ];

    const [open, setOpen] = useState(false);

    return (
        <AppBar sx={{ background: "black" }}>
            <StyledToolbar>
                <LogoBox>
                    <Button component={Link} to="/blogs" sx={{ color: "white" }}>MyBlog</Button>
                </LogoBox>
                <MenuBox sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}>
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
                <SearchBox>
                    <InputBase placeholder="Search ...." sx={{ color: 'white' }} />
                    <MenuIcon
                        sx={{
                            cursor: "pointer",
                            color: 'white',
                            display: { xs: 'block', sm: 'block', md: 'none' }
                        }}
                        onClick={() => setOpen(!open)}
                    />
                </SearchBox>
            </StyledToolbar>
            <Menu
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
                <Box sx={{ width: 350, height: '90vh' }}>
                    {MenuItems.map((item) => (
                        <MenuItem 
                            key={item.Name} 
                            component={Link} 
                            to={item.Link} 
                            sx={{ cursor: "pointer" }}
                        >
                            {item.Name}
                        </MenuItem>
                    ))}
                    <Button component={Link} to="/login" sx={{ variant: 'outlined' }}>LogButt</Button>
                </Box>
            </Menu>
        </AppBar>
    );
};
