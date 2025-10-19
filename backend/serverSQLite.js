const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize SQLite Database
const db = require('./database/sqlite');
console.log('✅ SQLite Database Connected Successfully');

// Routes
app.use('/api/auth', require('./routes/authSQLite'));
app.use('/api/help-request', require('./routes/helpRequestSQLite'));
app.use('/api/gemini', require('./routes/geminiRoutes'));
app.use('/api/map', require('./routes/mapRoutes'));

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'DisAID API is running with SQLite!',
    database: 'SQLite',
    status: 'operational'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`💾 Database: SQLite (disaid.db)`);
});


