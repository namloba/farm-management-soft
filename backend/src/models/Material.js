const db = require('../config/db');

class Material {
  // Lấy tất cả vật tư của user
  static async findAllByUser(userId) {
    const result = await db.query(
      'SELECT * FROM materials WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  // Lấy vật tư theo ID
  static async findById(id, userId) {
    const result = await db.query(
      'SELECT * FROM materials WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0];
  }

  // Tạo vật tư mới
  static async create(data) {
    const { user_id, name, category, unit, current_quantity, min_threshold, expiry_date } = data;
    const result = await db.query(
      `INSERT INTO materials (user_id, name, category, unit, current_quantity, min_threshold, expiry_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [user_id, name, category, unit, current_quantity || 0, min_threshold || 0, expiry_date || null]
    );
    return result.rows[0];
  }

  // Cập nhật vật tư
  static async update(id, userId, data) {
    const { name, category, unit, current_quantity, min_threshold, expiry_date } = data;
    const result = await db.query(
      `UPDATE materials 
       SET name = COALESCE($1, name),
           category = COALESCE($2, category),
           unit = COALESCE($3, unit),
           current_quantity = COALESCE($4, current_quantity),
           min_threshold = COALESCE($5, min_threshold),
           expiry_date = COALESCE($6, expiry_date),
           updated_at = NOW()
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [name, category, unit, current_quantity, min_threshold, expiry_date, id, userId]
    );
    return result.rows[0];
  }

  // Xóa vật tư
  static async delete(id, userId) {
    const result = await db.query(
      'DELETE FROM materials WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    return result.rows[0];
  }
}

module.exports = Material;