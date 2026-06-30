const express = require("express");
const router = express.Router();
const pool = require("../db");
const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();

// ── Ensure suggestion table exists ───────────────────────────────────────────
pool.query(`
  CREATE TABLE IF NOT EXISTS question_suggestions (
    id SERIAL PRIMARY KEY,
    suggested_by UUID REFERENCES users(id) ON DELETE SET NULL,
    question_type VARCHAR(20) NOT NULL,
    action VARCHAR(10) NOT NULL,
    category VARCHAR(255) NOT NULL,
    question_text TEXT,
    correct_ans TEXT,
    wrong_ans_1 TEXT,
    wrong_ans_2 TEXT,
    wrong_ans_3 TEXT,
    hint TEXT,
    existing_question_id INTEGER,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL
  )
`).catch(err => console.error('question_suggestions table error:', err.message));

// ── Helper: decode token ──────────────────────────────────────────────────────
const verifyToken = (req) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) throw Object.assign(new Error("Not Authorized"), { statusCode: 403 });
  return jsonwebtoken.verify(token, process.env.jwtSecret);
};

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

// Save a completed quiz result
router.post("/results", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(403).json({ message: "Not Authorized" });
    }

    const jsonwebtoken = require("jsonwebtoken");
    let userId;
    try {
      const payload = jsonwebtoken.verify(token, process.env.jwtSecret);
      userId = payload.user;
    } catch (jwtError) {
      console.error("JWT Error:", jwtError.message);
      return res.status(401).json({ message: "Token expired or invalid. Please sign in again." });
    }

    const { quiz_type, category, correct_count, total_questions, time_seconds, attempts } = req.body;

    if (!quiz_type || !category || correct_count == null || total_questions == null) {
      return res.status(400).json({ message: "Missing required fields: quiz_type, category, correct_count, total_questions" });
    }

    // Begin a transaction
    await pool.query("BEGIN");

    let xp_earned = 0;

    // If there are specific question attempts, save them and calculate diminishing XP
    if (attempts && Array.isArray(attempts)) {
      for (const attempt of attempts) {
        if (attempt.is_correct) {
          const pastCorrects = await pool.query(
            "SELECT COUNT(*) FROM question_attempts WHERE user_id = $1 AND question_id = $2 AND is_correct = true",
            [userId, attempt.question_id]
          );
          const count = parseInt(pastCorrects.rows[0].count) || 0;
          let questionXp = 10;
          if (count === 1) questionXp = 5;
          else if (count === 2) questionXp = 3;
          else if (count >= 3) questionXp = 1;
          
          xp_earned += questionXp;
        }

        await pool.query(
          `INSERT INTO question_attempts (user_id, question_id, quiz_type, is_correct, time_taken_seconds)
           VALUES ($1, $2, $3, $4, $5)`,
          [userId, attempt.question_id, quiz_type, attempt.is_correct, attempt.time_taken_seconds]
        );
      }
    } else {
      xp_earned = correct_count * 10;
    }

    const result = await pool.query(
      `INSERT INTO quiz_results (user_id, quiz_type, category, correct_count, total_questions, time_seconds, xp_earned)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [userId, quiz_type, category, correct_count, total_questions, time_seconds || null, xp_earned]
    );

    // Streak logic update
    const userRow = await pool.query("SELECT streak_count, last_lesson_date FROM users WHERE id = $1", [userId]);
    let newStreak = userRow.rows[0].streak_count || 0;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (userRow.rows[0].last_lesson_date) {
      const lastLessonDate = new Date(userRow.rows[0].last_lesson_date);
      const lastLessonDay = new Date(lastLessonDate.getFullYear(), lastLessonDate.getMonth(), lastLessonDate.getDate());
      
      const diffTime = Math.abs(today - lastLessonDay);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    await pool.query(
      `UPDATE users SET total_xp = total_xp + $1, streak_count = $2, last_lesson_date = $3 WHERE id = $4`,
      [xp_earned, newStreak, now, userId]
    );

    const updatedUser = await pool.query(
      `SELECT total_xp, streak_count FROM users WHERE id = $1`,
      [userId]
    );

    await pool.query("COMMIT");

    res.status(201).json({
      message: "Quiz result saved",
      xp_earned,
      total_xp: updatedUser.rows[0].total_xp,
      streak_count: updatedUser.rows[0].streak_count,
      result: result.rows[0],
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error saving quiz result:", error.message);
    res.status(500).json({ message: "Server Error", detail: error.message });
  }
});

// Get quiz history for the logged-in user
router.get("/results", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(403).json({ message: "Not Authorized" });
    }

    const jsonwebtoken = require("jsonwebtoken");
    const payload = jsonwebtoken.verify(token, process.env.jwtSecret);
    const userId = payload.user;

    const { quiz_type, category } = req.query;

    let queryStr = `SELECT id, quiz_type, category, correct_count, total_questions, time_seconds, xp_earned, completed_at 
                    FROM quiz_results WHERE user_id = $1`;
    const values = [userId];

    if (quiz_type) {
      values.push(quiz_type);
      queryStr += ` AND quiz_type = $${values.length}`;
    }
    if (category) {
      values.push(category);
      queryStr += ` AND category = $${values.length}`;
    }

    queryStr += ` ORDER BY completed_at DESC`;

    const results = await pool.query(queryStr, values);
    res.status(200).json(results.rows);
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/students-progress", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(403).json({ message: "Not Authorized" });
    }

    const jsonwebtoken = require("jsonwebtoken");
    const payload = jsonwebtoken.verify(token, process.env.jwtSecret);
    const userId = payload.user;

    // 1. Get the current user details
    const userResult = await pool.query(
      "SELECT role, school_code FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUser = userResult.rows[0];

    if (currentUser.role !== 'driving-instructor' && currentUser.role !== 'system-administrator') {
      return res.status(403).json({ message: "Forbidden: Not an instructor or admin." });
    }

    let studentsResult;
    if (currentUser.role === 'driving-instructor') {
      if (!currentUser.school_code) {
        return res.json([]); 
      }
      studentsResult = await pool.query(
        "SELECT id, first_name, last_name, email, phone_number, role, school_code, total_xp, intake, created_at FROM users WHERE role = 'student' AND school_code = $1",
        [currentUser.school_code]
      );
    } else {
      studentsResult = await pool.query(
        "SELECT id, first_name, last_name, email, phone_number, role, school_code, total_xp, intake, created_at FROM users WHERE role = 'student'"
      );
    }

    const students = studentsResult.rows;

    if (students.length === 0) {
      return res.json([]);
    }

    const studentIds = students.map(s => s.id);

    // 2. Fetch all quiz results for these students
    const quizResultsResult = await pool.query(
      `SELECT id, user_id, quiz_type, category, correct_count, total_questions, time_seconds, xp_earned, completed_at 
       FROM quiz_results 
       WHERE user_id = ANY($1) 
       ORDER BY completed_at DESC`,
      [studentIds]
    );

    const quizResults = quizResultsResult.rows;

    // 3. Group quiz results by user_id
    const studentProgress = students.map(student => {
      const results = quizResults.filter(r => r.user_id === student.id);
      return {
        ...student,
        quiz_results: results
      };
    });

    res.status(200).json(studentProgress);
  } catch (error) {
    console.error("Error fetching students progress:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ── Dashboard stats ───────────────────────────────────────────────────────────
router.get("/dashboard-stats", async (req, res) => {
  try {
    const payload = verifyToken(req);
    const userRow = await pool.query("SELECT role, school_code FROM users WHERE id = $1", [payload.user]);
    if (!userRow.rows.length) return res.status(404).json({ message: "User not found" });
    const { role, school_code } = userRow.rows[0];

    let stats = {};

    if (role === 'system-administrator') {
      const [instructors, students, quizMeta, byCategory, byDay, byType, recent] = await Promise.all([
        pool.query("SELECT COUNT(*) FROM users WHERE role = 'driving-instructor'"),
        pool.query("SELECT COUNT(*) FROM users WHERE role = 'student'"),
        pool.query("SELECT COUNT(*) as total, COALESCE(AVG(correct_count::float/NULLIF(total_questions,0)),0) as avg_ratio, SUM(xp_earned) as total_xp FROM quiz_results"),
        pool.query(`SELECT category, COUNT(*) as attempts, ROUND(AVG(correct_count::float/NULLIF(total_questions,0))*100) as avg_score FROM quiz_results GROUP BY category ORDER BY attempts DESC LIMIT 10`),
        pool.query(`SELECT DATE(completed_at) as day, COUNT(*) as attempts FROM quiz_results WHERE completed_at > NOW() - INTERVAL '14 days' GROUP BY day ORDER BY day`),
        pool.query("SELECT quiz_type, COUNT(*) as count FROM quiz_results GROUP BY quiz_type"),
        pool.query(`SELECT u.first_name, u.last_name, qr.category, qr.correct_count, qr.total_questions, qr.completed_at FROM quiz_results qr JOIN users u ON u.id = qr.user_id ORDER BY qr.completed_at DESC LIMIT 5`)
      ]);
      stats = {
        instructorCount: parseInt(instructors.rows[0].count),
        studentCount: parseInt(students.rows[0].count),
        totalQuizzes: parseInt(quizMeta.rows[0].total),
        avgScore: Math.round((parseFloat(quizMeta.rows[0].avg_ratio) || 0) * 100),
        totalXP: parseInt(quizMeta.rows[0].total_xp) || 0,
        byCategory: byCategory.rows,
        activityByDay: byDay.rows.map(r => ({ day: r.day?.toISOString().slice(0,10), attempts: parseInt(r.attempts) })),
        byType: byType.rows.map(r => ({ type: r.quiz_type, count: parseInt(r.count) })),
        recentActivity: recent.rows
      };
    } else if (role === 'driving-instructor') {
      const myStudents = school_code
        ? await pool.query("SELECT id FROM users WHERE role='student' AND school_code=$1", [school_code])
        : { rows: [] };
      const ids = myStudents.rows.map(r => r.id);
      const [quizMeta, byCategory, byDay, xpRows, recent] = ids.length
        ? await Promise.all([
            pool.query("SELECT COUNT(*) as total, COALESCE(AVG(correct_count::float/NULLIF(total_questions,0)),0) as avg_ratio, SUM(xp_earned) as total_xp FROM quiz_results WHERE user_id = ANY($1)", [ids]),
            pool.query(`SELECT category, COUNT(*) as attempts, ROUND(AVG(correct_count::float/NULLIF(total_questions,0))*100) as avg_score FROM quiz_results WHERE user_id=ANY($1) GROUP BY category ORDER BY attempts DESC LIMIT 10`, [ids]),
            pool.query(`SELECT DATE(completed_at) as day, COUNT(*) as attempts FROM quiz_results WHERE user_id=ANY($1) AND completed_at > NOW() - INTERVAL '14 days' GROUP BY day ORDER BY day`, [ids]),
            pool.query("SELECT total_xp FROM users WHERE id=ANY($1)", [ids]),
            pool.query(`SELECT u.first_name, u.last_name, qr.category, qr.correct_count, qr.total_questions, qr.completed_at FROM quiz_results qr JOIN users u ON u.id = qr.user_id WHERE qr.user_id=ANY($1) ORDER BY qr.completed_at DESC LIMIT 5`, [ids]),
          ])
        : [{ rows: [{ total: 0, avg_ratio: 0, total_xp: 0 }] }, { rows: [] }, { rows: [] }, { rows: [] }, { rows: [] }];
      stats = {
        studentCount: ids.length,
        activeStudents: ids.length > 0 ? (await pool.query("SELECT COUNT(DISTINCT user_id) FROM quiz_results WHERE user_id=ANY($1)", [ids])).rows[0].count : 0,
        totalQuizzes: parseInt(quizMeta.rows[0].total) || 0,
        avgScore: Math.round((parseFloat(quizMeta.rows[0].avg_ratio) || 0) * 100),
        totalXP: parseInt(quizMeta.rows[0].total_xp) || 0,
        byCategory: byCategory.rows,
        activityByDay: byDay.rows.map(r => ({ day: r.day?.toISOString().slice(0,10), attempts: parseInt(r.attempts) })),
        xpDistribution: xpRows.rows.map(r => parseInt(r.total_xp) || 0),
        recentActivity: recent.rows
      };
    }

    res.json(stats);
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ message: err.message });
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ── All questions (theory + road signs) ──────────────────────────────────────
router.get("/all-questions", async (req, res) => {
  try {
    const [theory, signs] = await Promise.all([
      pool.query("SELECT id, 'theory' as type, category, question, correct_ans, wrong_ans, hint FROM theory ORDER BY category, id"),
      pool.query("SELECT id, 'sign' as type, category, display_name as question, null as correct_ans, null as wrong_ans, null as hint FROM road_signs ORDER BY category, id"),
    ]);
    res.json({ theory: theory.rows, signs: signs.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ── Submit suggestion ────────────────────────────────────────────────────────
router.post("/suggestions", async (req, res) => {
  try {
    const payload = verifyToken(req);
    const { question_type, action, category, question_text, correct_ans, wrong_ans_1, wrong_ans_2, wrong_ans_3, hint, existing_question_id, notes, image_url } = req.body;
    if (!question_type || !action || !category) return res.status(400).json({ message: "question_type, action and category are required" });
    const result = await pool.query(
      `INSERT INTO question_suggestions (suggested_by, question_type, action, category, question_text, correct_ans, wrong_ans_1, wrong_ans_2, wrong_ans_3, hint, existing_question_id, notes, image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [payload.user, question_type, action, category, question_text, correct_ans, wrong_ans_1, wrong_ans_2, wrong_ans_3, hint, existing_question_id || null, notes, image_url || null]
    );
    res.status(201).json({ message: "Suggestion submitted", suggestion: result.rows[0] });
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ message: err.message });
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ── List suggestions ─────────────────────────────────────────────────────────
router.get("/suggestions", async (req, res) => {
  try {
    const payload = verifyToken(req);
    const userRow = await pool.query("SELECT role FROM users WHERE id=$1", [payload.user]);
    if (!userRow.rows.length) return res.status(404).json({ message: "User not found" });
    const { role } = userRow.rows[0];

    let result;
    if (role === 'system-administrator') {
      result = await pool.query(
        `SELECT qs.*, u.first_name || ' ' || u.last_name as submitter_name, u.email as submitter_email
         FROM question_suggestions qs LEFT JOIN users u ON u.id = qs.suggested_by
         ORDER BY qs.created_at DESC`
      );
    } else {
      result = await pool.query(
        `SELECT qs.*, u.first_name || ' ' || u.last_name as submitter_name
         FROM question_suggestions qs LEFT JOIN users u ON u.id = qs.suggested_by
         WHERE qs.suggested_by = $1 ORDER BY qs.created_at DESC`,
        [payload.user]
      );
    }
    res.json(result.rows);
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ message: err.message });
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ── Review suggestion (admin) ────────────────────────────────────────────────
router.patch("/suggestions/:id", async (req, res) => {
  try {
    const payload = verifyToken(req);
    const userRow = await pool.query("SELECT role FROM users WHERE id=$1", [payload.user]);
    if (userRow.rows[0]?.role !== 'system-administrator') return res.status(403).json({ message: "Forbidden" });
    const { status, admin_notes } = req.body; // status: 'approved' | 'rejected'
    const result = await pool.query(
      `UPDATE question_suggestions SET status=$1, admin_notes=$2, reviewed_at=NOW(), reviewed_by=$3
       WHERE id=$4 RETURNING *`,
      [status, admin_notes || null, payload.user, req.params.id]
    );
    if (!result.rowCount) return res.status(404).json({ message: "Suggestion not found" });
    res.json({ message: `Suggestion ${status}`, suggestion: result.rows[0] });
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ message: err.message });
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/deduct-heart", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(403).json({ message: "Not Authorized" });

    const jsonwebtoken = require("jsonwebtoken");
    const payload = jsonwebtoken.verify(token, process.env.jwtSecret);
    
    // Check user role and school_code
    const userResult = await pool.query("SELECT role, school_code, hearts FROM users WHERE id = $1", [payload.user]);
    if (userResult.rows.length === 0) return res.status(404).json({ message: "User not found" });
    
    const user = userResult.rows[0];
    
    // Only deduct if student and not linked to a school
    if (user.role === 'student' && !user.school_code && user.hearts > 0) {
      const query = Number(user.hearts) === 5 
        ? "UPDATE users SET hearts = hearts - 1, last_heart_refill = CURRENT_TIMESTAMP WHERE id = $1 RETURNING hearts"
        : "UPDATE users SET hearts = hearts - 1 WHERE id = $1 RETURNING hearts";
      const updatedUser = await pool.query(query, [payload.user]);
      return res.json({ hearts: updatedUser.rows[0].hearts });
    }
    
    // Otherwise return current hearts
    res.json({ hearts: user.hearts });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
