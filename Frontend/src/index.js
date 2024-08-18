import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';


const domain = process.env.REACT_APP_AUTH0_ISSUER_BASE_URL;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <PrimeReactProvider
        domain={domain}
        clientId={clientId}
        redirectUri={window.location.origin}>
    <App />
    </PrimeReactProvider>
    );
