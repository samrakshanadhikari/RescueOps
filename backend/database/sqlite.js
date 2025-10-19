const Database = require('better-sqlite3');
const path = require('path');

// Create or open SQLite database
const dbPath = path.join(__dirname, '../../disaid.db');
const db = new Database(dbPath, { verbose: console.log });

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create Users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create Help Requests table
db.exec(`
  CREATE TABLE IF NOT EXISTS help_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    situation TEXT NOT NULL,
    word_count INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    classification_category TEXT,
    classification_urgency TEXT,
    classification_keywords TEXT,
    classification_summary TEXT,
    classification_confidence REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

console.log('✅ SQLite Database initialized at:', dbPath);
console.log('✅ Tables created: users, help_requests');

module.exports = db;


