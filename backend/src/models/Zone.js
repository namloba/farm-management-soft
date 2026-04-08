const db = require('../config/db');

class Zone {
  // Lấy tất cả zones của user
  static async findAllByUser(userId, filters = {}) {
    let query = `
      SELECT 
        z.*,
        COALESCE(zs.total_activities, 0) as total_activities,
        COALESCE(zs.growth_percentage, 0) as growth_percentage,
        COALESCE(zs.last_activity_date, z.created_at) as last_activity_date,
        COALESCE(zs.last_activity_type, '') as last_activity_type
      FROM zones z
      LEFT JOIN zone_stats zs ON z.id = zs.zone_id
      WHERE z.user_id = $1
    `;
    const values = [userId];
    let paramIndex = 2;

    if (filters.status) {
      query += ` AND z.status = $${paramIndex}`;
      values.push(filters.status);
      paramIndex++;
    }

    if (filters.type) {
      query += ` AND z.type = $${paramIndex}`;
      values.push(filters.type);
      paramIndex++;
    }

    query += ` ORDER BY z.created_at DESC`;

    const result = await db.query(query, values);
    return result.rows;
  }

  // Lấy zone theo ID
  static async findById(id, userId) {
    const query = `
      SELECT 
        z.*,
        COALESCE(zs.total_activities, 0) as total_activities,
        COALESCE(zs.total_material_cost, 0) as total_material_cost,
        COALESCE(zs.growth_percentage, 0) as growth_percentage,
        COALESCE(zs.last_activity_date, z.created_at) as last_activity_date
      FROM zones z
      LEFT JOIN zone_stats zs ON z.id = zs.zone_id
      WHERE z.id = $1 AND z.user_id = $2
    `;
    const result = await db.query(query, [id, userId]);
    return result.rows[0];
  }

  // Tạo zone mới
  static async create(data) {
    const {
      farm_id,
      user_id,
      name,
      type,
      crop_type,
      variety,
      area,
      area_unit = 'ha',
      start_date,
      estimated_harvest_date,
      cover_image_url
    } = data;

    const query = `
      INSERT INTO zones (
        farm_id, user_id, name, type, crop_type, variety,
        area, area_unit, start_date, estimated_harvest_date,
        cover_image_url, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
      RETURNING *
    `;

    const values = [
      farm_id, user_id, name, type, crop_type, variety,
      area, area_unit, start_date, estimated_harvest_date,
      cover_image_url || null, 'active'
    ];

    const result = await db.query(query, values);
    
    // Tạo zone_stats record
    await db.query(`
      INSERT INTO zone_stats (zone_id, updated_at)
      VALUES ($1, NOW())
      ON CONFLICT (zone_id) DO NOTHING
    `, [result.rows[0].id]);

    return result.rows[0];
  }

  // Cập nhật zone
  static async update(id, userId, data) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = ['name', 'type', 'crop_type', 'variety', 'area', 
                           'area_unit', 'start_date', 'estimated_harvest_date', 
                           'actual_harvest_date', 'status', 'cover_image_url'];

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
      UPDATE zones 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Xóa zone (soft delete)
  static async delete(id, userId) {
    const query = `
      UPDATE zones 
      SET status = 'deleted', updated_at = NOW()
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `;
    const result = await db.query(query, [id, userId]);
    return result.rows[0];
  }

  // Tính % tiến độ
  static async calculateProgress(zoneId) {
  const query = `
    SELECT 
      start_date,
      estimated_harvest_date,
      CASE 
        WHEN estimated_harvest_date IS NOT NULL AND start_date IS NOT NULL
        THEN LEAST(100, GREATEST(0, 
          EXTRACT(DAY FROM (CURRENT_DATE - start_date::timestamp)) * 100.0 /
          EXTRACT(DAY FROM (estimated_harvest_date::timestamp - start_date::timestamp))
        ))
        ELSE 0
      END as progress_percentage,
      CASE 
        WHEN estimated_harvest_date > CURRENT_DATE
        THEN EXTRACT(DAY FROM (estimated_harvest_date::timestamp - CURRENT_DATE::timestamp))
        ELSE 0
      END as days_remaining
    FROM zones
    WHERE id = $1
  `;
  const result = await db.query(query, [zoneId]);
  return result.rows[0];
  }
}

module.exports = Zone;