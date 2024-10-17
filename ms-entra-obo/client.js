const config = require('./config/config'); 
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { PublicClientApplication } = require('@azure/msal-node');

const app = express();
app.use(bodyParser.json());

const clientConfig = {
    auth: {
        clientId: config.clientAppClientID,
        authority: `https://login.microsoftonline.com/${config.tenantID}`,
        clientSecret: config.clientAppClientSecret,
        redirectUri: 'http://localhost:3000/redirect',
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: 'Verbose',
        }
    }
};

const pca = new PublicClientApplication(clientConfig);

// Login and get access token for the user
app.get('/login', async (req, res) => {
    try {
        // Use async/await to handle the promise
        const authUrl = await pca.getAuthCodeUrl({
            scopes: [`api://${config.middletierAppClientID}/access_as_user`],
            redirectUri: 'http://localhost:3000/redirect',
        });
        res.redirect(authUrl); // Redirect to the Microsoft login page
    } catch (error) {
        console.error('Error generating auth code URL', error);
        res.status(500).send('Error generating auth code URL');
    }
});

app.get('/redirect', async (req, res) => {
    try {
        const tokenResponse = await pca.acquireTokenByCode({
            code: req.query.code,
            scopes: [`api://${config.middletierAppClientID}/access_as_user`],
            redirectUri: 'http://localhost:3000/redirect',
        });

        const accessToken = tokenResponse.accessToken;
        res.json({ token: accessToken });
    } catch (error) {
        console.error('Error acquiring token by code', error);
        res.status(500).send('Error acquiring token by code');
    }
});

// Simulate call to middle-tier  with access token
app.post('/on-behalf-of', async (req, res) => {
    const accessToken = req.body.token;

    // Make a request to middle-tier  API, passing the user token
    try {
        const backendResponse = await axios.post('http://localhost:4000/exchange-token', {
            token: accessToken,
        });

        res.json(backendResponse.data); // This contains the downstream API response
    } catch (error) {
        console.error('Error calling middle-tier API', error);
        res.status(500).send('Error calling middle-tier API');
    }
});

app.listen(3000, () => {
    console.log('Client App running on http://localhost:3000');
});