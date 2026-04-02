const express = require('express');
const router = express.Router();
const db = require('../config/db');
const requireAuth = require('../middleware/auth');

// Get all staff with filters
router.get('/', requireAuth, (req, res) => {
  const { depId, postId, hireFrom, hireTo } = req.query;

  let query = `
    SELECT s.*, d.DepName, p.PostTitle, r.HireDate, r.Salary, r.Status, r.RecID
    FROM staff s
    LEFT JOIN department d ON s.DepID = d.DepID
    LEFT JOIN post p ON s.PostID = p.PostID
    LEFT JOIN recruitment r ON s.EmployeeID = r.EmployeeID
    WHERE 1=1
  `;
  const params = [];

  if (depId) { query += ' AND s.DepID = ?'; params.push(depId); }
  if (postId) { query += ' AND s.PostID = ?'; params.push(postId); }
  if (hireFrom) { query += ' AND r.HireDate >= ?'; params.push(hireFrom); }
  if (hireTo) { query += ' AND r.HireDate <= ?'; params.push(hireTo); }

  query += ' ORDER BY s.FirstName';

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching staff.' });
    res.json(results);
  });
});

// Get one
router.get('/:id', requireAuth, (req, res) => {
  const query = `
    SELECT s.*, d.DepName, p.PostTitle, r.HireDate, r.Salary, r.Status, r.RecID
    FROM staff s
    LEFT JOIN department d ON s.DepID = d.DepID
    LEFT JOIN post p ON s.PostID = p.PostID
    LEFT JOIN recruitment r ON s.EmployeeID = r.EmployeeID
    WHERE s.EmployeeID = ?
  `;
  db.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error.' });
    if (results.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(results[0]);
  });
});

// Create staff
router.post('/', requireAuth, (req, res) => {
  const { PostID, DepID, FirstName, LastName, Gender, DOB, Email, Phone, Address } = req.body;
  if (!FirstName || !LastName || !Email || !Gender || !DOB)
    return res.status(400).json({ message: 'Required fields missing.' });

  db.query(
    'INSERT INTO staff (PostID, DepID, FirstName, LastName, Gender, DOB, Email, Phone, Address) VALUES (?,?,?,?,?,?,?,?,?)',
    [PostID || null, DepID || null, FirstName, LastName, Gender, DOB, Email, Phone, Address],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Error creating staff. Email may already exist.' });
      res.status(201).json({ message: 'Staff created.', id: result.insertId });
    }
  );
});

// Update staff
router.put('/:id', requireAuth, (req, res) => {
  const { PostID, DepID, FirstName, LastName, Gender, DOB, Email, Phone, Address } = req.body;
  db.query(
    'UPDATE staff SET PostID=?, DepID=?, FirstName=?, LastName=?, Gender=?, DOB=?, Email=?, Phone=?, Address=? WHERE EmployeeID=?',
    [PostID || null, DepID || null, FirstName, LastName, Gender, DOB, Email, Phone, Address, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Error updating staff.' });
      res.json({ message: 'Staff updated.' });
    }
  );
});

// Delete staff
router.delete('/:id', requireAuth, (req, res) => {
  db.query('DELETE FROM staff WHERE EmployeeID = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Error deleting staff.' });
    res.json({ message: 'Staff deleted.' });
  });
});

module.exports = router;
