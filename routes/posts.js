const express = require('express');
const router = express.Router();
const db = require('../config/db');
const requireAuth = require('../middleware/auth');

router.get('/', requireAuth, (req, res) => {
  db.query('SELECT * FROM post ORDER BY PostTitle', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching posts.' });
    res.json(results);
  });
});

router.get('/:id', requireAuth, (req, res) => {
  db.query('SELECT * FROM post WHERE PostID = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error.' });
    if (results.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(results[0]);
  });
});

router.post('/', requireAuth, (req, res) => {
  const { PostTitle } = req.body;
  if (!PostTitle) return res.status(400).json({ message: 'Post title required.' });
  db.query('INSERT INTO post (PostTitle) VALUES (?)', [PostTitle], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error creating post.' });
    res.status(201).json({ message: 'Post created.', id: result.insertId });
  });
});

router.put('/:id', requireAuth, (req, res) => {
  const { PostTitle } = req.body;
  db.query('UPDATE post SET PostTitle = ? WHERE PostID = ?', [PostTitle, req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Error updating.' });
    res.json({ message: 'Post updated.' });
  });
});

router.delete('/:id', requireAuth, (req, res) => {
  db.query('DELETE FROM post WHERE PostID = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Error deleting.' });
    res.json({ message: 'Post deleted.' });
  });
});

module.exports = router;
