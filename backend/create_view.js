const pool = require("./db");

async function createView() {
    try {
        await pool.query(`
            CREATE OR REPLACE VIEW leaderboard_view AS 
            SELECT id, first_name, last_name, profile_picture, total_xp 
            FROM users 
            WHERE role = 'student' 
            ORDER BY total_xp DESC;
        `);
        console.log("View created successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Error creating view:", err);
        process.exit(1);
    }
}

createView();
