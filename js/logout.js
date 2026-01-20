import { URL_BASE_KEYCLOAK, CLIENT_ID, CLIENT_SECRET, LOGIN_URL } from './config.js';

export const setupLogoutButton = () => {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log("Cerrando sesión...");
            // Generar la URL de logout
            const logoutParams = new URLSearchParams({
                id_token_hint: localStorage.getItem('idToken'),
                post_logout_redirect_uri: encodeURIComponent(REDIRECTION_URL)
            });

            console.log("Logout URL: ", `${URL_BASE_KEYCLOAK}/logout?${logoutParams.toString()}`);
            console.log("logoutParams: ", logoutParams.toString());

            fetch(`${URL_BASE_KEYCLOAK}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                params: logoutParams.toString(),
            })
                .then(response => {
                    console.log("Status Code: ", response.status);
                    // Con el fin de mantenerlo simple no voy a emplear metodos de redireccion al login
                    if (response.status === 204) {
                        console.log("Éxito al cerrar sesión");
                        console.log('response Logout: ', response);
                        localStorage.clear();
                    } else {

                        response.text().then(errorText => {
                            console.error('Error during logout:', errorText);
                        });
                    }
                })
                .catch(error => {
                    console.error('Logout error:', error);
                });
        });
    }
};
