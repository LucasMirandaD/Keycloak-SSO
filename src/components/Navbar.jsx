import React from 'react';
import { useCookies } from 'react-cookie';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link } from "react-router";
import useLogout from '../utils/useLogout';

const Navbar = () => {
    const [cookies] = useCookies(['session-sso']);

    const navStyles = {
        borderRadius: '0.5rem',
        fullwidth: '100%',
        boxShadow: '0 4px 8px rgba(133, 57, 200, 0.79)',
        backgroundColor: 'rgba(173, 148, 194, 0.2)',
        marginTop: '2rem'
    };

    const titleStyles = {
        flexGrow: 1,
        color: '#333'
    };

    const navListStyles = {
        display: 'flex',
        gap: '1rem'
    };

    const navLinkStyles = {
        color: '#666',
        textTransform: 'none',
        textDecoration: 'none',
        padding: '6px 8px',
        fontSize: '0.875rem',
        minWidth: '64px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const logout = useLogout();

    const sessionCookie = cookies['session-sso'];
    const cookie = sessionCookie ? JSON.parse(sessionCookie) : {};

    return (
        <Container>
            {cookie.user && cookie.user.name ? (
                <AppBar position="static" sx={navStyles}>
                    <Toolbar>
                        <Typography variant="h6" sx={titleStyles}>
                            {`Bienvenido ${cookie.user.name}`}
                        </Typography>
                        <Box sx={navListStyles}>
                            <Button sx={navLinkStyles} onClick={logout}>Logout</Button>    
                        </Box>
                    </Toolbar>
                </AppBar>
            ) : (
                <AppBar position="static" sx={navStyles}>
                    <Toolbar>
                        <Typography variant="h6" sx={titleStyles}>
                            SSO MxM Keycloak
                        </Typography>
                        <Box sx={navListStyles}>
                            <Link style={navLinkStyles} to="/home">Home</Link>
                        </Box>
                    </Toolbar>
                </AppBar>
            )}
        </Container>
    );
};

export default Navbar;