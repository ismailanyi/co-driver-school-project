const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');
const jwt = require('../utils/jwtGenerator');
const jwtGenerator = require('../utils/jwtGenerator');
const crypto = require('crypto')
const nodemailer = require('nodemailer')

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
        if(emailExist.rows.length === 0) {
            return res.status(401).json({message: 'Email does not exist'})
        };

        const expireDate = new Date()
        expireDate.setHours(expireDate.getHours() + 1);
        const resetToken = crypto.randomBytes(20).toString('hex');

        await pool.query(
            'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3', [resetToken, expireDate, email]
        )
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
        const resetUrl = `http://localhost:8081/reset-password?token=${resetToken}`;
        const info = await transporter.sendMail({
            from: '"Co-Driver support" <support@codriver.com>',
            to: email,
            subject: 'Co-Driver reset link',
            text: `Reset your password using this link ${resetUrl}`,
            html: `<p>Reset your password using this link</p><p>Click <a href="${resetUrl}">here</a> to reset your password</p>`
        })

        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))



        res.json({message: 'Login Url sent.' })

    }catch (error){
        console.error('Error ocurred sending messge', error)
    }
})

router.post('/reset', async(req,res) => {
    try {
        const { token, password } = req.body;
        
        const userResult = await pool.query(
            'SELECT * from users WHERE reset_token = $1 AND reset_token_expires > NOW()', [token]
        )
        if (userResult.rows.length === 0) {
            return res.status(400).json({message: 'Invalid or expired token'})
        }
        const password_hash = await bcrypt.hash(password, 10)

        await pool.query(
            `UPDATE users 
            SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL
            WHERE reset_token = $2
            `, [password_hash, token]
        )
        res.json({message: 'reset password successful'})

    } catch (error) {
        console.log('Error resetting password', error)
    }
})

module.exports = router;