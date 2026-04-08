const Farm = require('../models/Farm');

const getAllFarms = async (req, res) => {
  try {
    const farms = await Farm.findAllByUser(req.user.id);
    res.json({ success: true, data: farms, count: farms.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFarmById = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id, req.user.id);
    if (!farm) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    res.json({ success: true, data: farm });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createFarm = async (req, res) => {
  try {
    const farm = await Farm.create({ ...req.body, user_id: req.user.id });
    res.status(201).json({ success: true, message: 'Tạo thành công', data: farm });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateFarm = async (req, res) => {
  try {
    const farm = await Farm.update(req.params.id, req.user.id, req.body);
    if (!farm) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    res.json({ success: true, message: 'Cập nhật thành công', data: farm });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.delete(req.params.id, req.user.id);
    if (!farm) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    res.json({ success: true, message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllFarms, getFarmById, createFarm, updateFarm, deleteFarm };