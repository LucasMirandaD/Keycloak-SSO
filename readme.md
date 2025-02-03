# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# SSO_MxM_Keycloak

Este proyecto es una demostración de cómo integrar Keycloak para autenticación utilizando HTML y JavaScript. A continuación, se detallan los pasos para configurar y utilizar este proyecto.

## Requisitos

- Un servidor de Keycloak configurado.
- Un `client_id`, `redirect_uri` y tu `client_secret`.

## Configuración

1. **Configurar Keycloak**:
   - Asegúrate de tener un cliente Keycloak configurado con los siguientes parámetros:
     - `client_id`
     - `client_secret`

2. **Actualizar el archivo de configuración de variables**:
   - Asegúrate de reemplazar las siguientes variables en el archivo `config.js`:
     - `HOST`
     - `CLIENT_ID`
     - `CLIENT_SECRET`

## Como correr el proyecto: 

- `npm install`
- `npm start`
- Dirígete a `127.0.0.1:3000/login.html`
- Si quieres hostear la pagina en tu red local: 
 `npm hosting`

## Archivos del Proyecto

**index.html**: Página principal que muestra la información del usuario después de iniciar sesión.

 **login.html**: Página de inicio de sesión donde el usuario es redirigido para autenticarse.

 **main.js**: Importa y ejecuta las funciones necesarias para la autenticación y cierre de sesión.

 **config.js**: Configuración que contiene las constantes necesarias para la integración con Keycloak.

 **auth.js**: Maneja la autenticación con Keycloak.

 **user.js**: Archivo que maneja la visualización de la información del usuario.

 **logout.js**: Archivo que maneja el cierre de sesión con Keycloak.


# Documentación de Endpoints implementados en la solución:

`URL_BASE_KEYCLOAK = http://dicmxmkeycloakdev.mendoza.gov.ar/realms/mendoza_x_mi/protocol/openid-connect`

## login.js

### GET auth

- **URL:** `${URL_BASE_KEYCLOAK}/auth`
- **Query params:**
  - `response_type=code`
  - `client_id=${CLIENT_ID}`
  - `redirect_uri=${encodeURIComponent(REDIRECTION_URL)}`
  - `login=true`
  - `scope=openid`
- **Descripción:**
  Genera la URL de autenticación para Keycloak y la asigna al botón de inicio de sesión. Cuando se hace clic en el botón de inicio de sesión, el usuario es redirigido a la página de inicio de sesión de Keycloak.

## auth.js

### POST token

- **URL:** `${URL_BASE_KEYCLOAK}/token`
- **Method:** POST
- **Headers:**
  - `Content-Type: application/x-www-form-urlencoded`
- **Body:**
  - `client_id`: El ID del cliente de tu configuración de Keycloak.
  - `client_secret`: El secreto del cliente de tu configuración de Keycloak.
  - `code`: El código de autorización obtenido de la URL.
  - `redirect_uri`: La URI a la que redirigir después del inicio de sesión.
  - `grant_type`: Establecido en `authorization_code`.
- **Descripción:**
  Intercambia el código de autorización por un token de acceso, token de ID y token de actualización. Los tokens se almacenan en `localStorage` para su uso posterior.

#### Curl:
```curl
curl -X POST "${URL_BASE_KEYCLOAK}/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=${CLIENT_ID}" \
  -d "client_secret=${CLIENT_SECRET}" \
  -d "code=${CODE}" \
  -d "redirect_uri=${REDIRECTION_URL}" \
  -d "grant_type=authorization_code"
  ```

#### Response:
```json
  {
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIya2t4bjBUM1lOQUVVYWNtaVcybWJROGp5NV9BMnlxUHZrT09mc2NETnlrIn0.",
    "expires_in": 60,
    "refresh_expires_in": 0,
    "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIya2t4bjBUM1lOQUVVYWNtaVcybWJROGp5NV9BMnlxUHZrT09mc2NETnlrIn0.",
    "token_type": "Bearer",
    "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIya2t4bjBUM1lOQUVVYWNtaVcybWJROGp5NV9BMnlxUHZrT09mc2NETnlrIn0.",
    "not-before-policy": 1720202482,
    "session_state": "f3d9bf58-5a39-4f95-abfa-7a2a61910df7",
    "scope": "openid email profile offline_access"
}
```

### POST userinfo

- **URL:** `${URL_BASE_KEYCLOAK}/userinfo`
- **Method:** POST
- **Headers:**
  - `Authorization: Bearer ${access_token}`
  - `Content-Type: application/json`
- **Descripción:**
  Obtiene la información del usuario utilizando el token de acceso. La información del usuario se almacena en `localStorage` y se muestra utilizando la función `displayUserInfo`.

#### Curl:
```curl
curl -X POST "${URL_BASE_KEYCLOAK}/userinfo" \
  -H "Authorization: Bearer ${access_token}" \
  -H "Content-Type: application/json"
  ```

#### Response:
```json
  {
      "sub": "59643650-b65b-4954-83ec-ec1cbe9317c8",
      "country": "Argentina",
      "birthdate": "2000-12-15",
      "gender": "M",
      "created_at": 1716382574487,
      "number_floor": "",
      "preferred_username": "20-xxxxxxxx-x",
      "number_dpto": "",
      "province": "Mendoza",
      "realm_access": {
          "roles": [
              "offline_access",
              "nivel_1",
              "user",
              "nivel_3",
              "default-roles-mendoza_x_mi"
          ]
      },
      "street": "CALLE XX",
      "alias": "",
      "department": "Guaymallén",
      "email": "lucasdavidmiranda8@gmail.com",
      "document_type": "CUIL",
      "email_verified": true,
      "document_number": "20-xxxxxxxx-x",
      "given_name": "Lucas David",
      "phone": "54 261xxxxxxx",
      "name": "Lucas David Miranda",
      "death_at": "",
      "location": "Capilla del Rosario",
      "number_street": "0000",
      "postal_code": "5525",
      "family_name": "Miranda"
  }
```
## Logout.js
### POST logout

- **URL:** `${URL_BASE_KEYCLOAK}/logout`
- **Method:** POST
- **Headers:**
  - `Content-Type: application/x-www-form-urlencoded`
- **Body:**
  - `client_id`: El ID del cliente de tu configuración de Keycloak.
  - `client_secret`: El secreto del cliente de tu configuración de Keycloak.
  - `refresh_token`: El token de actualización.
- **Descripción:**
  Cierra la sesión del usuario en Keycloak.

#### Curl:
```curl
curl -X POST "${URL_BASE_KEYCLOAK}/logout" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=${CLIENT_ID}" \
  -d "refresh_token=${REFRESH_TOKEN}" \
  -d "client_secret=${CLIENT_SECRET}"
```
