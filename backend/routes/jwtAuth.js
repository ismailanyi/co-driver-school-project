const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');
const jwt = require('../utils/jwtGenerator');
const jwtGenerator = require('../utils/jwtGenerator');
const crypto = require('crypto')

router.post('/signup', async(req, res) => {
    try {
        const { phone_number, email, password, first_name, last_name, provider, provider_id } = req.body;
        const password_hash = await bcrypt.hash(password, 10)
        
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
        console.error(err);
        
        res.status(500).send("Server Error");
    }
})

router.post('/signin', async(req, res) => {
    try {
        const { identifier, password } = req.body;
        const userResult = await pool.query(
            'SELECT * FROM users WHERE phone_number = $1 OR email = $1', [identifier]
        )

        if(userResult.rows.length === 0) {
            return res.status(401).json({message: 'Invalid Credentials'})
        }
        
        const user = userResult.rows[0];
        
        const passAuth = await bcrypt.compare(password, user.password_hash)
        
        if(!passAuth) {
            return res.status(401).json({message: 'Invalid Credentials'})
        }

        const token = jwtGenerator(user.id)

        res.json({message: 'Successful login', token: token})

    } catch (error) {
        console.error('Error occurred: ', error);
        res.status(500).json({message: "Server Error"})
    }
})

router.post('/forgot', async (req, res) => {
    try {
        const { email } = req.body;
        const emailExist = await pool.query(
            'SELECT * FROM users WHERE email = $1', [email]
        )
        if(userResult.rows.length === 0) {
            return res.status(401).json({message: 'Email does not exist'})
        }
        
        const user = userResult.rows[0];


        res.json({message: 'Successful login', token: token})

    }catch (error){
        console.error('Error ocurred sending messge', Error)
    }
} )

module.exports = router;