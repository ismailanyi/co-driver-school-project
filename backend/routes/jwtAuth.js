const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const jwt = require("../utils/jwtGenerator");
const jwtGenerator = require("../utils/jwtGenerator");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { emit } = require("process");

router.post("/signup", async (req, res) => {
  try {
    const {
      phone_number,
      email,
      password,
      first_name,
      last_name,
      provider,
      provider_id,
      role,
      school_code,
      intake,
      age,
    } = req.body;

    // Check if user already exists
    let existingUser = null;
    if (email) {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (result.rows.length > 0) existingUser = result.rows[0];
    }
    if (!existingUser && phone_number) {
      const result = await pool.query("SELECT * FROM users WHERE phone_number = $1", [phone_number]);
      if (result.rows.length > 0) existingUser = result.rows[0];
    }

    if (existingUser) {
      // If a school_code is provided and we are trying to add a student, update them
      if (role === 'student' && school_code) {
        const updatedUser = await pool.query(
          "UPDATE users SET school_code = $1, intake = COALESCE($2, intake) WHERE id = $3 RETURNING *",
          [school_code, intake || null, existingUser.id]
        );
        const user = updatedUser.rows[0];
        return res.json({
          message: "Existing student linked to driving school successfully",
          user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            phone_number: user.phone_number,
            role: user.role,
            email: user.email,
            school_code: user.school_code,
            intake: user.intake,
            created_at: user.created_at,
          },
        });
      }
      return res.status(409).json({ message: "A user with these details already exists." });
    }

    let password_hash = null;
    let temporary_password = null;

    const shortId = crypto.randomBytes(2).toString('hex');
    const generated_username = `${(first_name || 'student').toLowerCase().replace(/[^a-z0-9]/g, '')}${shortId}`;

    if (password) {
      password_hash = await bcrypt.hash(password, 10);
    } else {
      temporary_password = crypto.randomBytes(4).toString("hex");
      password_hash = await bcrypt.hash(temporary_password, 10);
    }

    const newUser = await pool.query(
      "INSERT INTO users (phone_number, email, password_hash, first_name, last_name, provider, provider_id, requires_password_change, role, school_code, intake, age, username) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
      [
        phone_number,
        email,
        password_hash,
        first_name || 'Student',
        last_name || '',
        provider,
        provider_id,
        !!temporary_password,
        role || 'student',
        school_code || null,
        intake || null,
        age || null,
        generated_username,
      ],
    );

    const user = newUser.rows[0];

    console.log("Saving user:", { email, phone_number, role, school_code, intake });

    res.json({
      message: "User registered successfully",
      temporary_password,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        role: user.role,
        email: user.email,
        school_code: user.school_code,
        intake: user.intake,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error(err);

    // PostgreSQL unique violation error code
    if (err.code === '23505') {
      if (err.constraint === 'users_email_key') {
        return res.status(409).json({ message: "A user with this email already exists." });
      }
      if (err.constraint === 'users_phone_number_key') {
        return res.status(409).json({ message: "A user with this phone number already exists." });
      }
      if (err.constraint === 'users_provider_id_key') {
        return res.status(409).json({ message: "This provider account is already linked to another user." });
      }
      return res.status(409).json({ message: "A user with these details already exists." });
    }

    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const allUsers = await pool.query(
      "SELECT id, phone_number, email, first_name, last_name, provider, role, school_code, intake, created_at from users",
    );
    res.json(allUsers.rows);
  } catch (err) {
    res.status(500).send({ message: "Server Error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const userResult = await pool.query(
      "SELECT * FROM users WHERE phone_number = $1 OR email = $1 OR username = $1",
      [identifier],
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const user = userResult.rows[0];

    if (password) {
      const passAuth = await bcrypt.compare(password, user.password_hash);
      
      if (!passAuth) {
        // Allow students to log in using their school_code as a password
        if (user.role === 'student' && user.school_code && password === user.school_code) {
          // OTP login accepted
        } else {
          return res.status(401).json({ message: "Invalid Credentials" });
        }
      }
    }
    const token = jwtGenerator(user.id);
    
    // Streak Reset Logic (no incrementing on login)
    let newStreak = user.streak_count || 0;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (user.last_lesson_date) {
      const lastLessonDate = new Date(user.last_lesson_date);
      const lastLessonDay = new Date(lastLessonDate.getFullYear(), lastLessonDate.getMonth(), lastLessonDate.getDate());
      
      const diffTime = Math.abs(today - lastLessonDay);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      // If diffDays > 1, the user missed yesterday, so streak resets to 0.
      if (diffDays > 1) {
        newStreak = 0;
      }
    }

    await pool.query(
      "UPDATE users SET streak_count = $1, last_login = $2 WHERE id = $3",
      [newStreak, now, user.id]
    );

    res.cookie("token", token, {
      httpOnly: true, // Js cant read
      secure: true, // Https 
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ message: "Successful login", token: token, role: user.role, requires_password_change: user.requires_password_change, streak_count: newStreak });
  } catch (error) {
    console.error("Error occurred: ", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/change-password", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(403).json({ message: "Not Authorized" });

    const jsonwebtoken = require("jsonwebtoken");
    const payload = jsonwebtoken.verify(token, process.env.jwtSecret);
    const { new_password } = req.body;

    if (!new_password) return res.status(400).json({ message: "New password is required" });

    const password_hash = await bcrypt.hash(new_password, 10);

    await pool.query(
      "UPDATE users SET password_hash = $1, requires_password_change = FALSE WHERE id = $2",
      [password_hash, payload.user]
    );

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/forgot", async (req, res) => {
  try {
    const { email } = req.body;
    const emailExist = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    if (emailExist.rows.length === 0) {
      return res.status(401).json({ message: "Email does not exist" });
    }

    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 1);
    const resetToken = crypto.randomBytes(20).toString("hex");

    await pool.query(
      "UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3",
      [resetToken, expireDate, email],
    );
    console.log("My Email is:", process.env.EMAIL_USER);
    console.log("Does my password exist?", !!process.env.EMAIL_PASS);
    
    let transporter;
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }
    const baseResetUrl = req.body.resetUrl || 'http://localhost:8081/reset';
    const resetUrl = `${baseResetUrl}?token=${resetToken}`;
    const info = await transporter.sendMail({
      from: '"Co-Driver support" <support@codriver.com>',
      to: email,
      subject: "Co-Driver reset link",
      text: `Reset your password using this link ${resetUrl}`,
      html: `<p>Reset your password using this link</p><p>Click <a href="${resetUrl}">here</a> to reset your password</p>`,
    });

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    res.json({ message: `${nodemailer.getTestMessageUrl(info)}` });
  } catch (error) {
    console.error("Error ocurred sending messge", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/reset", async (req, res) => {
  try {
    const { token, password } = req.body;

    const userResult = await pool.query(
      "SELECT * from users WHERE reset_token = $1 AND reset_token_expires > NOW()",
      [token],
    );
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const password_hash = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE users 
            SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL
            WHERE reset_token = $2
            `,
      [password_hash, token],
    );
    res.json({ message: "reset password successful" });
  } catch (error) {
    console.log("Error resetting password", error);
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await pool.query(
      `DELETE from users WHERE id = $1 RETURNING *`,
      [id],
    );

    if (deletedUser.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Successfully deleted user",
      deletedUser: deletedUser.rows[0],
    });
  } catch (err) {
    console.error("Error ocurred sending messge", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.patch("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { phone_number, email, first_name, last_name, role, school_code, intake } = req.body;
    const updatedUser = await pool.query(
      `UPDATE users SET phone_number = $1, email = $2, first_name = $3, last_name = $4, role = $5, school_code = $6, intake = $7 WHERE id = $8 RETURNING *`,
      [phone_number, email, first_name, last_name, role, school_code, intake, id],
    );

    if (updatedUser.rowCount === 0) {
      res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Edited User Successfully",
      updatedUser: updatedUser.rows[0],
    });
  } catch (err) {
    res.status(500).json({ message: "Unexpected server error" });
  }
});
router.get("/me", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(403).json({ message: "Not Authorized" });
    }
    const jsonwebtoken = require("jsonwebtoken");
    const payload = jsonwebtoken.verify(token, process.env.jwtSecret);
    const userResult = await pool.query(
      "SELECT id, first_name, last_name, email, phone_number, role, school_code, total_xp, streak_count, hearts, last_heart_refill, last_login, course_progress, profile_picture, username, created_at FROM users WHERE id = $1",
      [payload.user]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = userResult.rows[0];
    const now = new Date();

    // Heart refill logic
    let updatedHearts = user.hearts;
    if (updatedHearts < 5 && user.last_heart_refill) {
      const lastRefill = new Date(user.last_heart_refill);
      const intervalsPassed = Math.floor((now - lastRefill) / (1000 * 60 * 10)); // 10 minutes
      if (intervalsPassed > 0) {
        updatedHearts = Math.min(5, updatedHearts + intervalsPassed);
        const newRefillTime = updatedHearts === 5 ? now : new Date(lastRefill.getTime() + intervalsPassed * 10 * 60 * 1000);
        // Only update DB if it actually changed
        await pool.query(
          "UPDATE users SET hearts = $1, last_heart_refill = $2 WHERE id = $3",
          [updatedHearts, newRefillTime, payload.user]
        );
      }
    }
    user.hearts = user.school_code ? -1 : updatedHearts;

    // Streak logic (just check for reset)
    let newStreak = user.streak_count || 0;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let dbNeedsUpdate = false;
    
    if (user.last_lesson_date) {
      const lastLessonDate = new Date(user.last_lesson_date);
      const lastLessonDay = new Date(lastLessonDate.getFullYear(), lastLessonDate.getMonth(), lastLessonDate.getDate());
      
      const diffTime = Math.abs(today - lastLessonDay);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays > 1) {
        newStreak = 0;
        dbNeedsUpdate = true;
      }
    }

    if (dbNeedsUpdate) {
       await pool.query(
         "UPDATE users SET streak_count = $1 WHERE id = $2",
         [newStreak, payload.user]
       );
    }
    user.streak_count = newStreak;

    res.json(user);
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.patch("/me", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(403).json({ message: "Not Authorized" });

    const jsonwebtoken = require("jsonwebtoken");
    const payload = jsonwebtoken.verify(token, process.env.jwtSecret);
    const { first_name, last_name, email, phone_number, profile_picture, username } = req.body;

    const updated = await pool.query(
      `UPDATE users SET first_name = $1, last_name = $2, email = $3, phone_number = $4, profile_picture = $6, username = $7
       WHERE id = $5
       RETURNING id, first_name, last_name, email, phone_number, role, school_code, total_xp, profile_picture, username`,
      [first_name, last_name, email, phone_number, payload.user, profile_picture, username]
    );

    if (updated.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updated.rows[0] });
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    if (err.code === '23505') {
      if (err.constraint === 'users_email_key') return res.status(409).json({ message: "Email already in use by another account." });
      if (err.constraint === 'users_phone_number_key') return res.status(409).json({ message: "Phone number already in use by another account." });
      if (err.constraint === 'users_username_key') return res.status(409).json({ message: "Username already exists." });
    }
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/verify-school-code", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(403).json({ message: "Not Authorized" });
    }
    const jsonwebtoken = require("jsonwebtoken");
    const payload = jsonwebtoken.verify(token, process.env.jwtSecret);
    
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }

    // Check if an instructor with this code exists. Assuming instructor role is not 'student'.
    const instructorResult = await pool.query(
      "SELECT * FROM users WHERE school_code = $1 AND role != 'student'", 
      [code]
    );

    if (instructorResult.rows.length === 0) {
      return res.status(404).json({ message: "Failed, no such code." });
    }

    // Attach code to the current user
    const updatedUser = await pool.query(
      "UPDATE users SET school_code = $1 WHERE id = $2 RETURNING id, first_name, last_name, email, phone_number, role, school_code",
      [code, payload.user]
    );

    res.json({ message: "Successfully joined driving school.", user: updatedUser.rows[0] });

  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/remove-school-code", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(403).json({ message: "Not Authorized" });

    const jsonwebtoken = require("jsonwebtoken");
    const payload = jsonwebtoken.verify(token, process.env.jwtSecret);
    
    const updatedUser = await pool.query(
      "UPDATE users SET school_code = NULL WHERE id = $1 RETURNING id, first_name, last_name, email, phone_number, role, school_code",
      [payload.user]
    );

    res.json({ message: "Successfully removed driving school.", user: updatedUser.rows[0] });
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.patch("/progress", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(403).json({ message: "Not Authorized" });

    const jsonwebtoken = require("jsonwebtoken");
    const payload = jsonwebtoken.verify(token, process.env.jwtSecret);
    
    const { course_progress } = req.body;
    
    const updatedUser = await pool.query(
      "UPDATE users SET course_progress = $1 WHERE id = $2 RETURNING course_progress",
      [course_progress, payload.user]
    );

    res.json({ message: "Successfully updated course progress.", course_progress: updatedUser.rows[0].course_progress });
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/leaderboard", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(403).json({ message: "Not Authorized" });

    const jsonwebtoken = require("jsonwebtoken");
    jsonwebtoken.verify(token, process.env.jwtSecret);

    const leaderboard = await pool.query(
      `SELECT * FROM leaderboard_view LIMIT 50`
    );

    res.json(leaderboard.rows);
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/xp-history", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(403).json({ message: "Not Authorized" });

    const jsonwebtoken = require("jsonwebtoken");
    const payload = jsonwebtoken.verify(token, process.env.jwtSecret);

    const history = await pool.query(
      `SELECT TO_CHAR(DATE(completed_at), 'YYYY-MM-DD') as date, SUM(xp_earned) as total_xp 
       FROM quiz_results 
       WHERE user_id = $1 AND completed_at >= NOW() - INTERVAL '7 days'
       GROUP BY DATE(completed_at) 
       ORDER BY DATE(completed_at) ASC`,
      [payload.user]
    );

    res.json(history.rows);
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
