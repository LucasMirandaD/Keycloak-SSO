// auth.js
import { CLIENT_ID, REDIRECTION_URL, URL_BASE_KEYCLOAK, CLIENT_SECRET } from './config.js';
import { displayUserInfo } from './user.js';
import { setupLogoutButton } from './logout.js';

export const keycloak = async () => {
    // Obtiene los parámetros de la URL actual
    const urlParams = window.location.search && new URLSearchParams(window.location.search);
    if (urlParams && urlParams.get('code')) {
        const code = urlParams.get('code');
        try {
            // Crea los parámetros para el intercambio de código por token
            const params = new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: code,
                redirect_uri: REDIRECTION_URL,
                grant_type: 'authorization_code',
            });

            // Realiza la solicitud para obtener el token
            let result = await fetch(`${URL_BASE_KEYCLOAK}/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString(),
            });
            result = await result.json();

            // Almacena el ID Token para usarlo en el cierre de sesión
            localStorage.setItem('idToken', result.id_token);
            localStorage.setItem('refreshToken', result.refresh_token);

            // Obtiene la información del usuario
            let userInfo = await fetch(`${URL_BASE_KEYCLOAK}/userinfo`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${result.access_token}`,
                    'Content-Type': 'application/json',
                },
            });
            userInfo = await userInfo.json();

            // Almacena la información del usuario en localStorage
            localStorage.setItem('userName', userInfo.name);
            localStorage.setItem('userEmail', userInfo.email);
            localStorage.setItem('userDOB', userInfo.birthdate.toString());
            localStorage.setItem('userCUIL', userInfo.document_number);
            localStorage.setItem('userRoles', userInfo.realm_access.roles.join(', '));

            // Muestra la información del usuario
            displayUserInfo();
        } catch (error) {
            console.log('keycloak ~ error:', error);
        }
    } else {
        // Muestra la información del usuario si está disponible en localStorage
        displayUserInfo();
    }
};

keycloak();
setupLogoutButton();
