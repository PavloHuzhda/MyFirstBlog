import { AppBar, Box, Button, InputBase, Menu, MenuItem, styled, Toolbar } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
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
        {Name: "Home", Link: "#"},
        {Name: "Logout", Link: "#"},
        {Name: "Register", Link: "#"},
        {Name: "Login", Link: "/login"},
    ];

    const [open, setOpen] = useState(false);

    return (
        <AppBar sx={{ background: "black" }}>
            <StyledToolbar>
                <LogoBox><Button href="/blogs" sx={{color: "white"}} >MyBlog</Button></LogoBox>
                <MenuBox sx={{display: { xs: 'none', sm: 'none', md: 'flex'}}}>
                    {MenuItems.map((item)=>(
                        <Button variant="text" href={item.Link} key={item.Name} sx={{
                            color:'white',
                            '&:hover': {
                            backgroundColor: '#757575',
                        },
                        }}>{item.Name}</Button>
                    ))}
                    
                </MenuBox>
                <SearchBox>
                    <InputBase placeholder="Search ...." sx={{color: 'white'}}/>
                    <MenuIcon 
                        sx={{
                            cursor:"pointer",
                            color: 'white', 
                            display: { xs: 'block', sm: 'block', md: 'none'}
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
                <Box sx={{ width:350, height:'90vh' }}>
                    {MenuItems.map((item)=>(
                            <MenuItem href={item.Link} key={item.Name} sx={{cursor:"pointer"}} >{item.Name}</MenuItem>
                        ))}
                    <Button href="/login" sx={{variant: 'outlined'}} >LogButt</Button>
                </Box>
            </Menu>
        </AppBar>
    );
};