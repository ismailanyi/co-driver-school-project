const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
})

app.get('/', (req,res) => {
    res.json({
        message: 'Welcome to the Co-Driver Backend API'
    })
})

app.post('/register', async(req, res) => {
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

        req.status(500).send("Server Error");
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})