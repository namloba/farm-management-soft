const db = require('../config/db');

class Journal {
  // Lấy tất cả nhật ký của một zone
  static async findByZone(zoneId, userId, limit = 50) {
    const query = `
      SELECT 
        je.*,
        json_agg(DISTINCT ji.*) FILTER (WHERE ji.id IS NOT NULL) as images,
        json_agg(DISTINCT jsonb_build_object(
          'id', m.id,
          'name', m.name,
          'quantity', mu.quantity,
          'unit', mu.unit,
          'cost', mu.cost
        )) FILTER (WHERE m.id IS NOT NULL) as materials_used
      FROM journal_entries je
      LEFT JOIN journal_images ji ON ji.journal_entry_id = je.id
      LEFT JOIN material_usage mu ON mu.journal_entry_id = je.id
      LEFT JOIN materials m ON m.id = mu.material_id
      WHERE je.zone_id = $1 AND je.user_id = $2
      GROUP BY je.id
      ORDER BY je.activity_date DESC
      LIMIT $3
    `;
    const result = await db.query(query, [zoneId, userId, limit]);
    return result.rows;
  }

  // Lấy nhật ký theo ID
  static async findById(id, userId) {
    const query = `
      SELECT 
        je.*,
        json_agg(DISTINCT ji.*) FILTER (WHERE ji.id IS NOT NULL) as images,
        json_agg(DISTINCT jsonb_build_object(
          'id', m.id,
          'name', m.name,
          'quantity', mu.quantity,
          'unit', mu.unit,
          'cost', mu.cost
        )) FILTER (WHERE m.id IS NOT NULL) as materials_used
      FROM journal_entries je
      LEFT JOIN journal_images ji ON ji.journal_entry_id = je.id
      LEFT JOIN material_usage mu ON mu.journal_entry_id = je.id
      LEFT JOIN materials m ON m.id = mu.material_id
      WHERE je.id = $1 AND je.user_id = $2
      GROUP BY je.id
    `;
    const result = await db.query(query, [id, userId]);
    return result.rows[0];
  }

  // Tạo nhật ký mới
  static async create(data) {
    const {
      zone_id,
      user_id,
      activity_type,
      activity_date,
      duration,
      title,
      description,
      details,
      weather_temp,
      weather_humidity,
      weather_condition
    } = data;

    const query = `
      INSERT INTO journal_entries (
        zone_id, user_id, activity_type, activity_date, duration,
        title, description, details, weather_temp, weather_humidity,
        weather_condition, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING *
    `;

    const values = [
      zone_id, user_id, activity_type, activity_date || new Date(), duration || null,
      title || null, description || null, details || null,
      weather_temp || null, weather_humidity || null, weather_condition || null
    ];

    const result = await db.query(query, values);
    
    // Cập nhật zone_stats
    await db.query(`
      INSERT INTO zone_stats (zone_id, total_activities, last_activity_date, last_activity_type, updated_at)
      VALUES ($1, 1, NOW(), $2, NOW())
      ON CONFLICT (zone_id) 
      DO UPDATE SET
        total_activities = zone_stats.total_activities + 1,
        last_activity_date = NOW(),
        last_activity_type = $2,
        updated_at = NOW()
    `, [zone_id, activity_type]);

    return result.rows[0];
  }

  // Thêm hình ảnh cho nhật ký
  static async addImages(journalEntryId, images) {
    for (let i = 0; i < images.length; i++) {
      await db.query(
        `INSERT INTO journal_images (journal_entry_id, image_url, thumbnail_url, sort_order)
         VALUES ($1, $2, $3, $4)`,
        [journalEntryId, images[i].url, images[i].thumbnail || null, i]
      );
    }
  }

  // Thêm vật tư sử dụng
  static async addMaterials(journalEntryId, materials) {
    for (const material of materials) {
      await db.query(
        `INSERT INTO material_usage (journal_entry_id, material_id, quantity, unit, cost)
         VALUES ($1, $2, $3, $4, $5)`,
        [journalEntryId, material.material_id, material.quantity, material.unit, material.cost || null]
      );
      
      // Cập nhật số lượng tồn kho
      await db.query(
        `UPDATE materials 
         SET current_quantity = current_quantity - $1, updated_at = NOW()
         WHERE id = $2`,
        [material.quantity, material.material_id]
      );
    }
  }

  // Cập nhật nhật ký
  static async update(id, userId, data) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = ['activity_type', 'activity_date', 'duration', 
                           'title', 'description', 'details'];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = $${paramIndex}`);
        values.push(data[field]);
        paramIndex++;
      }
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = NOW()`);
    values.push(id, userId);

    const query = `
      UPDATE journal_entries 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Xóa nhật ký
  static async delete(id, userId) {
    // Xóa cascade sẽ tự động xóa images và material_usage
    const result = await db.query(
      'DELETE FROM journal_entries WHERE id = $1 AND user_id = $2 RETURNING id, zone_id',
      [id, userId]
    );
    
    if (result.rows[0]) {
      // Cập nhật lại zone_stats (giảm total_activities)
      await db.query(`
        UPDATE zone_stats 
        SET total_activities = total_activities - 1,
            updated_at = NOW()
        WHERE zone_id = $1
      `, [result.rows[0].zone_id]);
    }
    
    return result.rows[0];
  }

  // Lấy thống kê theo zone
  static async getStatsByZone(zoneId, userId) {
    const query = `
      SELECT 
        COUNT(*) as total_entries,
        COUNT(DISTINCT DATE(activity_date)) as active_days,
        MIN(activity_date) as first_activity,
        MAX(activity_date) as last_activity,
        activity_type,
        COUNT(*) as type_count
      FROM journal_entries
      WHERE zone_id = $1 AND user_id = $2
      GROUP BY activity_type
    `;
    const result = await db.query(query, [zoneId, userId]);
    return result.rows;
  }
}

module.exports = Journal;