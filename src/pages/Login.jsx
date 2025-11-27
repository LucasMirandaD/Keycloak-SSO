import React, { useEffect } from 'react';
import { Card, CardContent, Typography, Button, Box, Divider } from '@mui/material';
import { useCookies } from 'react-cookie';
import { CLIENT_ID, REDIRECTION_URL, URL_BASE_KEYCLOAK } from '../config';
import Navbar from '../components/Navbar';

const Login = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['session-sso']);

    useEffect(() => {
        if (cookies['session-sso']) {
            removeCookie('session-sso', { path: '/' });
        }
    }, [cookies, removeCookie]);

    const authUrl = `${URL_BASE_KEYCLOAK}/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECTION_URL)}&login=true&scope=openid`;

    return (
        <>
            <Navbar />
            <Box
                display="flex"
                justifyContent="center"
                marginTop={'5rem'}
                height="100vh"
            >
                <Card style={{
                    width: 600,
                    height: 200,
                    boxShadow: '0 4px 8px rgba(80, 46, 110, 0.1)',
                    backgroundColor: 'rgba(173, 148, 194, 0.2)',
                    borderRadius: '0.5rem',
                    position: 'flex',
                    padding: '50px',
                }}>
                    <CardContent>
                        <Typography variant="h4" component="h2" gutterBottom align="center">
                            Iniciá Sesión
                        </Typography>
                        <Divider />
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginTop: '35px', width: '100%', height: '4rem' }}
                            component="a"
                            href={authUrl}
                        >
                            Iniciar sesión
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
};

export default Login;