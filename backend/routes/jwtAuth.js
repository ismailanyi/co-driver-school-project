const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');

router.post('/signup', async(req, res) => {
    try {
        const { phone, email, password, first_name, last_name, provider, provider_id } = req.body;
        const password_hash = await bcrypt.hash(password, 10)
        
        const newUser = await pool.query(
            'INSERT INTO users (phone, email, password_hash, first_name, last_name, provider, provider_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', 
            [phone, email, password_hash, first_name, last_name, provider, provider_id]
        )

        console.log('Saving user:', {email, phone})
        
        
        res.json({
            message: 'User registered successfully',
            user: {phone, email},
        })
    } catch (err) {
        console.error(err);
        
        res.status(500).send("Server Error");
    }
})

router.get('/signin', async(req, res) => {
    try {
        const { identifier, password } = req.body;
        const user = await pool.query(
            'SELECT * FROM users WHERE phone = $1 OR email = $1', [identifier]
        )
        const passAuth = await bcrypt.compare(password, user.rows[0].password_hash)

    } catch (error) {
        console.error('Error occurred: ', error);
    }
})

module.exports = router;