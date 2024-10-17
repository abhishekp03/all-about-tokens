const config = require('./config/config'); 
const express = require('express');
const bodyParser = require('body-parser');
const { ConfidentialClientApplication } = require('@azure/msal-node');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const backendConfig = {
    auth: {
        clientId: config.middletierAppClientID,
        authority: `https://login.microsoftonline.com/${config.tenantID}`, 
        clientSecret: config.middletierAppClientSecret,
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

const pca = new ConfidentialClientApplication(backendConfig);

// Backend endpoint to exchange token using OBO flow
app.post('/exchange-token', async (req, res) => {
    const userToken = req.body.token;

    try {
        // Token exchange using OBO flow
        const oboResponse = await pca.acquireTokenOnBehalfOf({
            oboAssertion: userToken,
            scopes: ['https://graph.microsoft.com/.default'],
        });

        console.log(oboResponse)

        // Use the OBO token to call the Microsoft Graph API
        const graphResponse = await axios.get('https://graph.microsoft.com/v1.0/me', {
            headers: {
                Authorization: `Bearer ${oboResponse.accessToken}`,
            },
        });

        res.json(graphResponse.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to exchange token or call downstream API', details: error.message });
    }
});

app.listen(4000, () => {
    console.log('Middle-tier App running on http://localhost:4000');
});
