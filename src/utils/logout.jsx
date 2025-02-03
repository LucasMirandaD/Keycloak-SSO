import { Navigate } from 'react-router-dom';
import { URL_BASE_KEYCLOAK, LOGIN_URL } from '../config.js';

const handleLogout = () => {
    console.log("Cerrando sesión...");

    console.log('manual url: ', `${URL_BASE_KEYCLOAK}/logout?id_token_hint=${localStorage.getItem('idToken')}&post_logout_redirect_uri=${encodeURIComponent(LOGIN_URL)}`);
    
    fetch(`${URL_BASE_KEYCLOAK}/logout?id_token_hint=${localStorage.getItem('idToken')}&post_logout_redirect_uri=${encodeURIComponent(LOGIN_URL)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': '*'
        },
        body: new URLSearchParams({
            id_token_hint: localStorage.getItem('idToken'),
            post_logout_redirect_uri: LOGIN_URL
        })
    })
        .then(response => {
            console.log("Status Code: ", response.status);

            if (response.status === 204) {
                console.log("Éxito al cerrar sesión");
                console.log('response Logout: ', response);
                localStorage.clear();
                Navigate('/login');
            } else {

                response.text().then(errorText => {
                    console.error('Error during logout:', errorText);
                });
            }
        })
        .catch(error => {
            console.error('Logout error:', error);
        });
};
export { handleLogout };