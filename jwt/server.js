const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Secret key for JWT signing and verification
const SECRET_KEY = "my-super-secret";

// Middleware to parse incoming requests
app.use(bodyParser.json());

// Route to generate a token
app.post('/login', (req, res) => {
    const { username } = req.body;
    
    // In a real-world application, you'd validate the user credentials here
    if (username) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(400).json({ message: "Username is required" });
    }
});

// Middleware to verify the Bearer token
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401); // No token provided

    const token = authHeader.split(' ')[1]; // Bearer <token>
    
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token
        req.user = user; // Attach the user payload to the request
        next();
    });
}

// Protected route, only accessible with a valid token
app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: `Hello ${req.user.username}, you are authorized!` });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
