const db = require('../config/db');

class Farm {
  static async findAllByUser(userId) {
    const result = await db.query(
      'SELECT * FROM farms WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  static async findById(id, userId) {
    const result = await db.query(
      'SELECT * FROM farms WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0];
  }

  static async create(data) {
    const { user_id, name, address, total_area, area_unit = 'ha' } = data;
    const result = await db.query(
      `INSERT INTO farms (user_id, name, address, total_area, area_unit) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [user_id, name, address, total_area, area_unit]
    );
    return result.rows[0];
  }

  static async update(id, userId, data) {
    const { name, address, total_area, area_unit } = data;
    const result = await db.query(
      `UPDATE farms 
       SET name = COALESCE($1, name),
           address = COALESCE($2, address),
           total_area = COALESCE($3, total_area),
           area_unit = COALESCE($4, area_unit),
           updated_at = NOW()
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [name, address, total_area, area_unit, id, userId]
    );
    return result.rows[0];
  }

  static async delete(id, userId) {
    const result = await db.query(
      'DELETE FROM farms WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    return result.rows[0];
  }
}

module.exports = Farm;