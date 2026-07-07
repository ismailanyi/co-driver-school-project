const pool = require('./backend/db');
(async () => {
  try {
    const res = await pool.query("SELECT id, first_name, last_name, email, phone_number, role, school_code, total_xp, streak_count, hearts, last_heart_refill, last_login, course_progress, profile_picture FROM users LIMIT 1");
    console.log("DB Query successful");
    process.exit(0);
  } catch (err) {
    console.error("DB Error:", err.message);
    process.exit(1);
  }
})();
