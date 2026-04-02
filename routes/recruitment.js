const express = require('express');
const router = express.Router();
const db = require('../config/db');
const requireAuth = require('../middleware/auth');

// Get all recruitments
router.get('/', requireAuth, (req, res) => {
  const query = `
    SELECT r.*, CONCAT(s.FirstName, ' ', s.LastName) AS EmployeeName, s.Email
    FROM recruitment r
    LEFT JOIN staff s ON r.EmployeeID = s.EmployeeID
    ORDER BY r.HireDate DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching recruitments.' });
    res.json(results);
  });
});

// Get one
router.get('/:id', requireAuth, (req, res) => {
  db.query('SELECT * FROM recruitment WHERE RecID = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error.' });
    if (results.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(results[0]);
  });
});

// Create
router.post('/', requireAuth, (req, res) => {
  const { EmployeeID, HireDate, Salary, Status } = req.body;
  if (!EmployeeID || !HireDate || !Salary)
    return res.status(400).json({ message: 'Required fields missing.' });

  db.query(
    'INSERT INTO recruitment (EmployeeID, HireDate, Salary, Status) VALUES (?,?,?,?)',
    [EmployeeID, HireDate, Salary, Status || 'Active'],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Error creating recruitment.' });
      res.status(201).json({ message: 'Recruitment record created.', id: result.insertId });
    }
  );
});

// Update
router.put('/:id', requireAuth, (req, res) => {
  const { EmployeeID, HireDate, Salary, Status } = req.body;
  db.query(
    'UPDATE recruitment SET EmployeeID=?, HireDate=?, Salary=?, Status=? WHERE RecID=?',
    [EmployeeID, HireDate, Salary, Status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Error updating.' });
      res.json({ message: 'Recruitment updated.' });
    }
  );
});

// Delete
router.delete('/:id', requireAuth, (req, res) => {
  db.query('DELETE FROM recruitment WHERE RecID = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Error deleting.' });
    res.json({ message: 'Recruitment record deleted.' });
  });
});

module.exports = router;
