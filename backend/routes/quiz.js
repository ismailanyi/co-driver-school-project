const express = require('express');
const router = express.Router();
const pool = require('../db');
require('dotenv').config();

    router.get('/sign', async(req, res) => {
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
        res.status(200).json(signsWithURLs)
    }catch (error) {
        console.error('Error occurred fetching quesitons', error)
    }
})

router.get('/theory', async(req, res) => {
    try {
        const questions = await pool.query(
            'SELECT * FROM theory ORDER BY RANDOM() LIMIT 4'
        )
        const theoryQuestions = questions.rows.map((theory) => {
            return {
                id: theory.id,
                category: theory.category,
                question: theory.question,
                correct_ans: theory.correct_ans,
                wrong_ans: theory.wrong_ans,
                hint: theory.hint,
            }
        })
        res.status(200).json(theoryQuestions)

    } catch (error) {
        console.log('Error: ', error)
        res.status(500).json({message: 'Server Error'})
    }
})

module.exports = router;