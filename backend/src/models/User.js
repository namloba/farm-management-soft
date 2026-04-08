const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  // Tìm user theo email
  static async findByEmail(email) {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  // Tìm user theo ID
  static async findById(id) {
    const result = await db.query(
      'SELECT id, email, full_name, phone, avatar_url, address, role, is_active, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Tạo user mới
  static async create(userData) {
    const { email, password, full_name, phone } = userData;
    
    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    const result = await db.query(
      `INSERT INTO users (email, password_hash, full_name, phone) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, full_name, phone, role, created_at`,
      [email, password_hash, full_name, phone]
    );
    
    return result.rows[0];
  }

  // Kiểm tra mật khẩu
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Cập nhật last_login
  static async updateLastLogin(id) {
    await db.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [id]
    );
  }
}

module.exports = User;