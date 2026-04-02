const express = require('express');
const router = express.Router();
const db = require('../config/db');
const requireAuth = require('../middleware/auth');

// Get all
router.get('/', requireAuth, (req, res) => {
  db.query('SELECT * FROM department ORDER BY DepName', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching departments.' });
    res.json(results);
  });
});

// Get one
router.get('/:id', requireAuth, (req, res) => {
  db.query('SELECT * FROM department WHERE DepID = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error.' });
    if (results.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(results[0]);
  });
});

// Create
router.post('/', requireAuth, (req, res) => {
  const { DepName } = req.body;
  if (!DepName) return res.status(400).json({ message: 'Department name required.' });
  db.query('INSERT INTO department (DepName) VALUES (?)', [DepName], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error creating department.' });
    res.status(201).json({ message: 'Department created.', id: result.insertId });
  });
});

// Update
router.put('/:id', requireAuth, (req, res) => {
  const { DepName } = req.body;
  db.query('UPDATE department SET DepName = ? WHERE DepID = ?', [DepName, req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Error updating.' });
    res.json({ message: 'Department updated.' });
  });
});

// Delete
router.delete('/:id', requireAuth, (req, res) => {
  db.query('DELETE FROM department WHERE DepID = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Error deleting.' });
    res.json({ message: 'Department deleted.' });
  });
});

module.exports = router;
