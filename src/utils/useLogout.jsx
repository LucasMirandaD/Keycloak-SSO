import { URL_BASE_KEYCLOAK, LOGIN_URL } from '../config.js';
import { useCookies } from 'react-cookie';

const useLogout = () => {
    const [cookies, , removeCookie] = useCookies(['session-sso']);

    const handleLogout = () => {
        console.log("Cerrando sesión...");
        const id_token = cookies['session-sso'] ? JSON.parse(cookies['session-sso']).idToken : null;
        const LOGOUT_URL = `${URL_BASE_KEYCLOAK}/logout?id_token_hint=${id_token}&post_logout_redirect_uri=${encodeURIComponent(LOGIN_URL)}`;
        
        removeCookie('session-sso');
        window.location.href = LOGOUT_URL;
    };

    return handleLogout;
};

export default useLogout;