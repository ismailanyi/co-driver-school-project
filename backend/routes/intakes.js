const router = require("express").Router();
const pool = require("../db");

// GET all intake periods
router.get("/", async (req, res) => {
  try {
    const intakes = await pool.query("SELECT * FROM intake_periods ORDER BY created_at ASC");
    res.json(intakes.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST add new intake (admin only - assuming protected by verifyToken middleware if needed, but for now just straightforward)
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Intake name is required" });

    const newIntake = await pool.query(
      "INSERT INTO intake_periods (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.json(newIntake.rows[0]);
  } catch (err) {
    if (err.code === "23505") { // unique violation
      return res.status(400).json({ message: "Intake period already exists" });
    }
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT update intake name and cascade to users
router.put("/:id", async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Intake name is required" });

    await client.query("BEGIN");

    // Get old name
    const oldIntake = await client.query("SELECT name FROM intake_periods WHERE id = $1", [id]);
    if (oldIntake.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Intake not found" });
    }
    const oldName = oldIntake.rows[0].name;

    // Update the intake
    const updatedIntake = await client.query(
      "UPDATE intake_periods SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );

    // Update all users who had the old intake
    await client.query(
      "UPDATE users SET intake = $1 WHERE intake = $2",
      [name, oldName]
    );

    await client.query("COMMIT");
    res.json(updatedIntake.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    if (err.code === "23505") {
      return res.status(400).json({ message: "Intake period with this name already exists" });
    }
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  } finally {
    client.release();
  }
});

// DELETE intake
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await pool.query("DELETE FROM intake_periods WHERE id = $1 RETURNING *", [id]);
    if (deleted.rows.length === 0) {
      return res.status(404).json({ message: "Intake not found" });
    }
    res.json({ message: "Intake deleted", intake: deleted.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
