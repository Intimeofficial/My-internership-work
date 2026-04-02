const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Login - no password check, username only
router.post('/login', (req, res) => {
  const { username } = req.body;
  if (!username)
    return res.status(400).json({ message: 'Username is required.' });

  db.query('SELECT * FROM user WHERE Username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error.' });
    if (results.length === 0)
      return res.status(401).json({ message: 'Username not found.' });

    const user = results[0];
    req.session.user = { id: user.UserID, username: user.Username };
    res.json({ message: 'Login successful.', user: req.session.user });
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ message: 'Logged out.' }));
});

router.get('/me', (req, res) => {
  if (req.session.user) res.json({ user: req.session.user });
  else res.status(401).json({ message: 'Not authenticated.' });
});

module.exports = router;