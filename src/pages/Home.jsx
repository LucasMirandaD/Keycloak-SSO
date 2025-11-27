import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Navbar from '../components/Navbar';
import { Typography, CircularProgress, CardContent, Card, Box } from '@mui/material';
import { CLIENT_ID, REDIRECTION_URL, URL_BASE_KEYCLOAK, CLIENT_SECRET } from '../config.js';

const Home = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [cookies, setCookie] = useCookies(['session-sso']);

    const renderUserInfo = () => {
        try {
            const sessionCookie = cookies['session-sso'];
            if (!sessionCookie) {
                throw new Error('No hay información de sesión');
            }
            const sessionData = typeof sessionCookie === 'string' ? JSON.parse(sessionCookie) : sessionCookie;
            if (!sessionData.user || !sessionData.user.name) {
                throw new Error('No hay información de usuario');
            }
            setUserInfo(sessionData.user);
        } catch (error) {
            console.error('Error al obtener la sesión:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const urlParams = window.location.search && new URLSearchParams(window.location.search);
            if (urlParams && urlParams.get('code')) {
                const code = urlParams.get('code');
                try {
                    const params = new URLSearchParams({
                        client_id: CLIENT_ID,
                        client_secret: CLIENT_SECRET,
                        code: code,
                        redirect_uri: REDIRECTION_URL,
                        grant_type: 'authorization_code',
                    });

                    let result = await fetch(`${URL_BASE_KEYCLOAK}/token`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: params.toString(),
                    });

                    result = await result.json();
                    console.log('result:', result);

                    let userInfoResponse = await fetch(`${URL_BASE_KEYCLOAK}/userinfo`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${result.access_token}`,
                            'Content-Type': 'application/json'
                        },
                    });
                    const userInfoData = await userInfoResponse.json();

                    // Construir la sesión con toda la información relevante
                    const sessionData = {
                        idToken: result.id_token,
                        refreshToken: result.refresh_token,
                        user: {
                            name: userInfoData.name,
                            email: userInfoData.email,
                            birthdate: userInfoData.birthdate.toString(),
                            document_number: userInfoData.document_number,
                            roles: userInfoData.realm_access.roles,
                        }
                    };

                    // Almacenar toda la sesión en una única cookie
                    setCookie('session-sso', JSON.stringify(sessionData));

                    setUserInfo(sessionData.user);
                    console.log('User information:', userInfoData);

                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <Navbar />
            <Box position="flex" display="flex" flexDirection="column" alignItems="center" marginTop="5rem">
                {userInfo ? (
                    <Card elevation={3} style={{ padding: '16px', borderRadius: '0.5rem' }}>
                        <Typography variant="h4" component="h1" gutterBottom align="center">
                            Estos son tus datos:
                        </Typography>
                        <CardContent>
                            <Typography variant="body1"><strong>Name:</strong> {userInfo.name}</Typography>
                            <Typography variant="body1"><strong>Email:</strong> {userInfo.email}</Typography>
                            <Typography variant="body1"><strong>Date of Birth:</strong> {userInfo.birthdate}</Typography>
                            <Typography variant="body1"><strong>CUIL:</strong> {userInfo.document_number}</Typography>
                            <Typography variant="body1"><strong>Roles:</strong> {userInfo.roles.join(', ')}</Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {renderUserInfo()}
                        <CircularProgress />
                    </>
                )}
            </Box>
        </>
    );
};

export default Home;