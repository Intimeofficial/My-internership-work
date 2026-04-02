const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const requireAuth = require('../middleware/auth');

// Get all users
router.get('/', requireAuth, (req, res) => {
  const query = `
    SELECT u.UserID, u.Username, u.EmployeeID, CONCAT(s.FirstName,' ',s.LastName) AS EmployeeName
    FROM user u
    LEFT JOIN staff s ON u.EmployeeID = s.EmployeeID
    ORDER BY u.Username
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching users.' });
    res.json(results);
  });
});

// Get one
router.get('/:id', requireAuth, (req, res) => {
  db.query('SELECT UserID, Username, EmployeeID FROM user WHERE UserID = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error.' });
    if (results.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(results[0]);
  });
});

// Create user
router.post('/', requireAuth, async (req, res) => {
  const { EmployeeID, Username, Password } = req.body;
  if (!Username || !Password) return res.status(400).json({ message: 'Username and password required.' });

  try {
    const hashed = await bcrypt.hash(Password, 10);
    db.query(
      'INSERT INTO user (EmployeeID, Username, Password) VALUES (?,?,?)',
      [EmployeeID || null, Username, hashed],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Error creating user. Username may exist.' });
        res.status(201).json({ message: 'User created.', id: result.insertId });
      }
    );
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update user
router.put('/:id', requireAuth, async (req, res) => {
  const { EmployeeID, Username, Password } = req.body;
  try {
    if (Password && Password.trim() !== '') {
      const hashed = await bcrypt.hash(Password, 10);
      db.query(
        'UPDATE user SET EmployeeID=?, Username=?, Password=? WHERE UserID=?',
        [EmployeeID || null, Username, hashed, req.params.id],
        (err) => {
          if (err) return res.status(500).json({ message: 'Error updating user.' });
          res.json({ message: 'User updated.' });
        }
      );
    } else {
      db.query(
        'UPDATE user SET EmployeeID=?, Username=? WHERE UserID=?',
        [EmployeeID || null, Username, req.params.id],
        (err) => {
          if (err) return res.status(500).json({ message: 'Error updating user.' });
          res.json({ message: 'User updated.' });
        }
      );
    }
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete
router.delete('/:id', requireAuth, (req, res) => {
  db.query('DELETE FROM user WHERE UserID = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Error deleting user.' });
    res.json({ message: 'User deleted.' });
  });
});

module.exports = router;
