const express = require("express");
const router = express.Router();
const pool = require("../db");
require("dotenv").config();

router.get("/count", async (req, res) => {
  try {
    const { type, category } = req.query;
    let queryStr = "";
    let values = [];

    if (category) {
      queryStr =
        "SELECT total_questions FROM category_question_counts WHERE question_type = $1 AND category = $2";
      values = [type, category];
    } else {
      queryStr =
        "SELECT SUM(total_questions) as total_questions FROM category_question_counts WHERE question_type = $1";
      values = [type];
    }

    const result = await pool.query(queryStr, values);
    const count =
      result.rows.length > 0 && result.rows[0].total_questions
        ? parseInt(result.rows[0].total_questions, 10)
        : 0;
    res.status(200).json({ count });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Server Error!" });
  }
});

router.get("/sign", async (req, res) => {
  try {
    const { category } = req.query;
    let queryStr = "SELECT * FROM road_signs ORDER BY id ASC";
    let values = [];

    if (category) {
      queryStr =
        "SELECT * FROM road_signs WHERE category = $1 ORDER BY id ASC";
      values = [category];
    }

    const questions = await pool.query(queryStr, values);
    const signsWithURLs = questions.rows.map((sign) => {
      return {
        id: sign.id,
        question: sign.display_name,
        category: sign.category,
        image_url: `${process.env.EXPO_URL}/assets/images/signs/${sign.file_name}`,
      };
    });
    res.status(200).json(signsWithURLs);
  } catch (error) {
    console.error("Error occurred fetching quesitons", error);
  }
});

router.get("/theory", async (req, res) => {
  try {
    const { category } = req.query;
    let queryStr = "SELECT * FROM theory ORDER BY id ASC";
    let values = [];

    if (category) {
      queryStr =
        "SELECT * FROM theory WHERE category = $1 ORDER BY id ASC";
      values = [category];
    }

    const questions = await pool.query(queryStr, values);
    const theoryQuestions = questions.rows.map((theory) => {
      return {
        id: theory.id,
        category: theory.category,
        question: theory.question,
        correct_ans: theory.correct_ans,
        wrong_ans: theory.wrong_ans,
        hint: theory.hint,
      };
    });
    res.status(200).json(theoryQuestions);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/road_signs_lessons", async (req, res) => {
  try {
    const lessons = await pool.query(`
      SELECT rl.*, COALESCE(c.total_questions, 0) as total_questions
      FROM road_signs_lessons rl
      LEFT JOIN category_question_counts c 
        ON c.category = rl.category AND c.question_type = 'sign'
      ORDER BY rl.id ASC
    `);
    const roadSignsLessons = lessons.rows.map((lesson) => {
      return {
        id: lesson.id,
        category: lesson.category,
        description: lesson.category,
        total_questions: parseInt(lesson.total_questions, 10),
      };
    });
    res.status(200).json(roadSignsLessons);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;

router.get("/theory_lessons", async (req, res) => {
  try {
    const lessons = await pool.query(`
      SELECT tl.*, COALESCE(c.total_questions, 0) as total_questions
      FROM theory_lessons tl
      LEFT JOIN category_question_counts c 
        ON c.category = tl.category AND c.question_type = 'theory'
      ORDER BY tl.id ASC
    `);
    const theoryLessons = lessons.rows.map((lesson) => {
      return {
        id: lesson.id,
        category: lesson.category,
        description: lesson.category,
        total_questions: parseInt(lesson.total_questions, 10),
      };
    });
    res.status(200).json(theoryLessons);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;
