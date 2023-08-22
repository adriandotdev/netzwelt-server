const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const app = express();
const buildHierarchy = require('./helpers/hierarchyBuilder');

const VerificationMiddleware = require('./middleware/VerificationMiddleware');

require('dotenv').config();

app.use(cors({ origin: ['http://localhost:5173', 'https://netzwelt-assessment.vercel.app'], credentials: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser())

const PORT = process.env.PORT || 3001;

app.post('/account/login', async (req, res) => {

    const { username, password } = req.body;

    try {
        const response = await axios.post('https://netzwelt-devtest.azurewebsites.net/Account/SignIn', { username, password });

        if (response.status === 200) {

            const signedJWT = jwt.sign({ username, password }, process.env.SECRET_KEY);

            res.cookie('auth-token', signedJWT, {
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // Expires in 7 days
                httpOnly: true, // Cookie accessible only via HTTP, not JavaScript
                secure: true, // Cookie sent over HTTPS only
            });

            return res.json({ message: 'Succesfully logged in!', token: signedJWT });
        }
    }
    catch (err) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
});

app.post('/api/verify', VerificationMiddleware, (req, res) => {

    res.status(200).json({ message: 'Authorized' });
});

app.get('/home/index', VerificationMiddleware, async (req, res) => {

    try {
        const response = await axios.get('https://netzwelt-devtest.azurewebsites.net/Territories/All');

        const data = response.data.data;

        const modifiedData = buildHierarchy(data);

        res.status(200).json(modifiedData)
    }
    catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
});

app.post('/account/logout', (req, res) => {

    res.clearCookie('auth-token');

    res.status(200).json({ message: 'Logged out successfully' })
});

app.listen(PORT, () => {
    console.log("LISTEN TO SERVER: " + PORT)
})