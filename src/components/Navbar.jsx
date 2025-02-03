import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link } from "react-router";
import { handleLogout } from '../utils/logout';
/* import { URL_BASE_KEYCLOAK, LOGIN_URL } from '../config.js'; */

const Navbar = () => {
    const navStyles = {
        backgroundColor: '#f8f9fa',
        borderRadius: '0.5rem',
        position: 'flex',
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

    return (
        <Container>
            {localStorage.getItem('userName') ? (
                <AppBar position="static" sx={navStyles}>
                    <Toolbar>
                        <Typography variant="h6" sx={titleStyles}>
                            {`Bienvenido ${localStorage.getItem('userName')}`}
                        </Typography>
                        <Box sx={navListStyles}>
                            <Button sx={navLinkStyles} onClick={handleLogout}>Logout</Button>
{/*                             <Button sx={navLinkStyles} href={`${URL_BASE_KEYCLOAK}/logout?id_token_hint=${localStorage.getItem('idToken')}&post_logout_redirect_uri=${encodeURIComponent(LOGIN_URL)}`}>Logout</Button>
 */}                        </Box>
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