import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Typography, CircularProgress, CardContent, Card, Box } from '@mui/material';
import { CLIENT_ID, REDIRECTION_URL, URL_BASE_KEYCLOAK, CLIENT_SECRET } from '../config.js';

const Home = () => {
    const [userInfo, setUserInfo] = useState(null);

    const renderUserInfo = () => {
        try {
            const userInfoData = {
                name: localStorage.getItem('userName'),
                email: localStorage.getItem('userEmail'),
                birthdate: localStorage.getItem('userDOB'),
                document_number: localStorage.getItem('userCUIL'),
            };
            const userRoles = localStorage.getItem('userRoles');

            if (!userInfoData) {
                throw new Error('No hay información de usuario');
            }

            setUserInfo({
                name: userInfoData.name,
                email: userInfoData.email,
                birthdate: userInfoData.birthdate,
                document_number: userInfoData.document_number,
                realm_access: { roles: userRoles }
            });
        } catch (error) {
            console.error('Error al obtener información del usuario:', error);
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
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: params.toString(),
                    });

                    result = await result.json();
                    console.log('result:', result);

                    localStorage.setItem('idToken', result.id_token);
                    localStorage.setItem('refreshToken', result.refresh_token);

                    let userInfo = await fetch(`${URL_BASE_KEYCLOAK}/userinfo`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${result.access_token}`,
                            'Content-Type': 'application/json'
                        },
                    });
                    userInfo = await userInfo.json();

                    localStorage.setItem('userName', userInfo.name);
                    localStorage.setItem('userEmail', userInfo.email);
                    localStorage.setItem('userDOB', userInfo.birthdate.toString());
                    localStorage.setItem('userCUIL', userInfo.document_number);
                    localStorage.setItem('userRoles', userInfo.realm_access.roles.join(', '));

                    setUserInfo(userInfo);
                    console.log('User information:', userInfo);

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
                            <Typography variant="body1"><strong>Roles:</strong> {userInfo.realm_access.roles}</Typography>
                            <Typography variant="body1"><strong>Token:</strong> {localStorage.getItem('idToken').slice(0,30)}</Typography>
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