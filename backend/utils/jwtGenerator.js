require('dotenv').config();

const jwt = require('jsonwebtoken');

const jwtGenerator = (user_id) => {
    const payload = {
        user: user_id
    };
    const expiry = {
        expiresIn: '1h'
    }
    return jwt.sign(payload, process.env.jwtSecret, expiry);
}

module.exports = jwtGenerator;