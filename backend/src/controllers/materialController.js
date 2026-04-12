const Material = require('../models/Material');

// Lấy danh sách vật tư
const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.findAllByUser(req.user.id);
    res.json({ success: true, data: materials });
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách vật tư' });
  }
};

// Lấy chi tiết vật tư
const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id, req.user.id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy vật tư' });
    }
    res.json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy chi tiết vật tư' });
  }
};

// Tạo vật tư mới
const createMaterial = async (req, res) => {
  try {
    const material = await Material.create({
      ...req.body,
      user_id: req.user.id
    });
    res.status(201).json({ success: true, message: 'Thêm vật tư thành công', data: material });
  } catch (error) {
    console.error('Create material error:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi thêm vật tư' });
  }
};

// Cập nhật vật tư
const updateMaterial = async (req, res) => {
  try {
    const material = await Material.update(req.params.id, req.user.id, req.body);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy vật tư' });
    }
    res.json({ success: true, message: 'Cập nhật thành công', data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật vật tư' });
  }
};

// Xóa vật tư
const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.delete(req.params.id, req.user.id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy vật tư' });
    }
    res.json({ success: true, message: 'Xóa vật tư thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa vật tư' });
  }
};

module.exports = {
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial
};