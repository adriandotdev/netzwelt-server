const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const app = express();

require('dotenv').config();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser())

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

            return res.json({ message: 'Succesfully logged in!' });
        }
    }
    catch (err) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
});

app.listen(3001, () => {
    console.log("LISTEN TO SERVER: 3001")
})