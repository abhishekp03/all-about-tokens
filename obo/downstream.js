const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const DOWNSTREAM_API_SECRET = 'downstream-api-secret';

// Simulate downstream API that checks for OBO token
app.post('/data', (req, res) => {
    const token = req.body.token;

    // Verify OBO token
    jwt.verify(token, DOWNSTREAM_API_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        // Return some dummy data for the downstream API response
        res.json({ message: `Hello ${decoded.username}, this is data from the downstream API.` });
    });
});

app.listen(2000, () => {
    console.log('Downstream App running on http://localhost:5000');
});
