const db = require('../database/sqlite');
const bcrypt = require('bcryptjs');

class User {
  // Create a new user
  static async create({ name, email, password, phone = '', role = 'user' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password, phone, role)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(name, email, hashedPassword, phone, role);
    
    return {
      id: result.lastInsertRowid,
      name,
      email,
      phone,
      role
    };
  }

  // Find user by email
  static findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  // Find user by ID
  static findById(id) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = stmt.get(id);
    if (user) {
      delete user.password; // Don't return password
    }
    return user;
  }

  // Check if email exists
  static async emailExists(email) {
    const user = this.findByEmail(email);
    return !!user;
  }

  // Compare password
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;


