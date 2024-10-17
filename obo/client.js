const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const CLIENT_SECRET = 'client-secret-key';
const OBO_TOKEN_URL = 'http://localhost:4000/exchange-token'; // Middle-tier API for OBO

// Endpoint to get an access token (simulating user login)
app.post('/client/login', (req, res) => {
    const { username } = req.body;
    if (username) {
        // Simulate generating a token for the user
        const userToken = jwt.sign({ username }, CLIENT_SECRET, { expiresIn: '1h' });
        res.json({ access_token: userToken });
    } else {
        res.status(400).json({ message: 'Username is required' });
    }
});

// Client calling middle-tier API with user access token
app.post('/client/on-behalf-of', async (req, res) => {
    const userToken = req.body.token;
    try {
        // Simulate calling middle-tier API to exchange token
        const response = await axios.post(OBO_TOKEN_URL, { token: userToken });
        res.json(response.data); // Returns downstream API data
    } catch (err) {
        res.status(500).json({ error: 'Failed to exchange token' });
    }
});

app.listen(3000, () => {
    console.log('Client running on http://localhost:3000');
});
