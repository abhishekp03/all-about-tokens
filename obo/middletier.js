const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const CLIENT_SECRET = 'client-secret-key';
const DOWNSTREAM_API_SECRET = 'downstream-api-secret';
const DOWNSTREAM_API_URL = 'http://localhost:5000/data'; // Downstream API

// Simulate OBO token exchange endpoint
app.post('/exchange-token', (req, res) => {
    const userToken = req.body.token;

    // Verify the incoming user token
    jwt.verify(userToken, CLIENT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        // Simulate generating a new token for the downstream API
        const oboToken = jwt.sign({ username: user.username, scope: 'access-downstream' }, DOWNSTREAM_API_SECRET, { expiresIn: '30m' });

        // Simulate calling the downstream API with OBO token
        axios.post(DOWNSTREAM_API_URL, { token: oboToken })
            .then(response => {
                res.json({ data: response.data });
            })
            .catch(err => {
                res.status(500).json({ error: 'Failed to call downstream API' });
            });
    });
});

app.listen(4000, () => {
    console.log('Middle-tier App running on http://localhost:4000');
});
