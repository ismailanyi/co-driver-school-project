const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');

module.exports = router;

router.post('/register', async(req, res) => {
    try {
        const { phone_number, email, password, first_name, last_name, provider, provider_id } = req.body;
        const password_hash = await bcrypt.hash(req.body.password, 10)

        const newUser = await pool.query(
            'INSERT INTO users (phone_number, email, password_hash, first_name, last_name, provider, provider_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', 
            [phone_number, email, password_hash, first_name, last_name, provider, provider_id]
        )
        console.log('Saving user:', {email, phone_number})
        
        
        res.json({
            message: 'User registered successfully',
            user: {phone_number, email},
        })
    } catch (err) {

        res.status(500).send("Server Error");
    }
})