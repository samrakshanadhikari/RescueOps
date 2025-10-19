const db = require('../database/sqlite');

class HelpRequest {
  // Create a new help request
  static create({ userId = null, situation, wordCount }) {
    const stmt = db.prepare(`
      INSERT INTO help_requests (user_id, situation, word_count, status)
      VALUES (?, ?, ?, 'pending')
    `);
    
    const result = stmt.run(userId, situation, wordCount);
    
    return {
      id: result.lastInsertRowid,
      user_id: userId,
      situation,
      word_count: wordCount,
      status: 'pending'
    };
  }

  // Find help request by ID
  static findById(id) {
    const stmt = db.prepare('SELECT * FROM help_requests WHERE id = ?');
    return stmt.get(id);
  }

  // Find all pending help requests
  static findPending(limit = 50) {
    const stmt = db.prepare(`
      SELECT * FROM help_requests 
      WHERE status = 'pending' 
      ORDER BY created_at ASC 
      LIMIT ?
    `);
    return stmt.all(limit);
  }

  // Update help request with classification
  static updateClassification(id, classification) {
    const stmt = db.prepare(`
      UPDATE help_requests 
      SET classification_category = ?,
          classification_urgency = ?,
          classification_keywords = ?,
          classification_summary = ?,
          classification_confidence = ?,
          status = 'classified',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    const result = stmt.run(
      classification.category,
      classification.urgency,
      JSON.stringify(classification.keywords || []),
      classification.aiSummary,
      classification.confidence,
      id
    );
    
    return result.changes > 0;
  }

  // Get all help requests with filters
  static findAll({ status, category, urgency } = {}, limit = 100) {
    let query = 'SELECT * FROM help_requests WHERE 1=1';
    const params = [];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (category) {
      query += ' AND classification_category = ?';
      params.push(category);
    }
    if (urgency) {
      query += ' AND classification_urgency = ?';
      params.push(urgency);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);
    
    const stmt = db.prepare(query);
    return stmt.all(...params);
  }
}

module.exports = HelpRequest;


