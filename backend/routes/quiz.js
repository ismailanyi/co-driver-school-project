const express = require('express');
const router = express.Router();
const pool = require('../db');
require('dotenv').config();

router.get('/', async(req, res) => {
    try {
        const questions = await pool.query(
            'SELECT * FROM road_signs ORDER BY RANDOM() LIMIT 4'
        )
        const signsWithURLs = questions.rows.map((sign) => {
            return {
                id: sign.id,
                name: sign.display_name,
                category: sign.category,
                image_url: `${process.env.EXPO_URL}/assets/images/signs/${sign.file_name}`
            }
        })
        // questions, i saw has row, like questions.row.length
        res.status(200).json(signsWithURLs)
    }catch (error) {
        console.error('Error occurred fetching quesitons', error)
    }
})

module.exports = router;