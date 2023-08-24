const jwt = require('jsonwebtoken');

module.exports = function VerificationMiddleware(req, res, next) {

    const token = req.cookies['auth-token'];

    try {

        const isValid = jwt.verify(token, process.env.SECRET_KEY);

        if (isValid) {
            next();
        }
    }
    catch (err) {

        return res.status(401).json({ message: 'Unauthorized' })
    }
}