const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: 'luke-hospital-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 8 // 8 hours
  }
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/recruitment', require('./routes/recruitment'));
app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => res.send('Luke Hospital API is running.'));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
