const express = require('express');
const router = express.Router();
const pool = require('../db');
const { verifyToken } = require('../utils/auth');

// GET /feedback - List feedback
router.get('/', async (req, res) => {
  try {
    const payload = verifyToken(req);
    const userRow = await pool.query('SELECT role FROM users WHERE id=$1', [payload.user]);
    if (!userRow.rows.length) return res.status(404).json({ message: 'User not found' });
    const { role } = userRow.rows[0];

    let result;
    if (role === 'system-administrator') {
      result = await pool.query(`
        SELECT f.*, u.first_name || ' ' || u.last_name as submitter_name, u.email as submitter_email
        FROM system_feedback f
        LEFT JOIN users u ON u.id = f.user_id
        ORDER BY f.created_at DESC
      `);
    } else {
      result = await pool.query(`
        SELECT f.*, u.first_name || ' ' || u.last_name as submitter_name
        FROM system_feedback f
        LEFT JOIN users u ON u.id = f.user_id
        WHERE f.user_id = $1
        ORDER BY f.created_at DESC
      `, [payload.user]);
    }
    res.json(result.rows);
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ message: err.message });
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /feedback - Submit new feedback
router.post('/', async (req, res) => {
  try {
    const payload = verifyToken(req);
    const subject = req.body.subject || req.body.title || '';
    const category = req.body.category || req.body.issueType || req.body.type || '';
    const message = req.body.message || req.body.description || req.body.content || '';
    const attachment_url = req.body.attachment_url || req.body.attachmentUrl || null;

    require('fs').appendFileSync('feedback_debug.log', JSON.stringify({ body: req.body, headers: req.headers }) + '\n');

    if (!subject || !category || !message) {
      return res.status(400).json({ message: 'Subject, category, and message are required. Received body: ' + JSON.stringify(req.body) });
    }

    const result = await pool.query(`
      INSERT INTO system_feedback (user_id, subject, category, message, attachment_url, status)
      VALUES ($1, $2, $3, $4, $5, 'Pending')
      RETURNING *
    `, [payload.user, subject, category, message, attachment_url || null]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ message: err.message });
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// PATCH /feedback/:id - Update feedback status (Admin only)
router.patch('/:id', async (req, res) => {
  try {
    const payload = verifyToken(req);
    const userRow = await pool.query('SELECT role FROM users WHERE id=$1', [payload.user]);
    if (!userRow.rows.length) return res.status(404).json({ message: 'User not found' });
    if (userRow.rows[0].role !== 'system-administrator') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { status, admin_notes } = req.body;
    const { id } = req.params;

    const result = await pool.query(`
      UPDATE system_feedback 
      SET status = $1, admin_notes = $2
      WHERE id = $3
      RETURNING *
    `, [status, admin_notes, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ message: err.message });
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
