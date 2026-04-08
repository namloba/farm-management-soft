const Zone = require('../models/Zone');

// Lấy danh sách zones
const getAllZones = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, type } = req.query;
    
    const zones = await Zone.findAllByUser(userId, { status, type });
    
    // Tính progress cho mỗi zone
    const zonesWithProgress = await Promise.all(
      zones.map(async (zone) => {
        const progress = await Zone.calculateProgress(zone.id);
        return {
          ...zone,
          progress_percentage: progress?.progress_percentage || 0,
          days_remaining: progress?.days_remaining || 0
        };
      })
    );
    
    res.json({
      success: true,
      data: zonesWithProgress,
      count: zonesWithProgress.length
    });
  } catch (error) {
    console.error('Get all zones error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách khu vực',
      error: error.message
    });
  }
};

// Lấy chi tiết zone
const getZoneById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const zone = await Zone.findById(id, userId);
    
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khu vực'
      });
    }
    
    const progress = await Zone.calculateProgress(id);
    
    res.json({
      success: true,
      data: {
        ...zone,
        progress_percentage: progress?.progress_percentage || 0,
        days_remaining: progress?.days_remaining || 0
      }
    });
  } catch (error) {
    console.error('Get zone by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy chi tiết khu vực',
      error: error.message
    });
  }
};

// Tạo zone mới
const createZone = async (req, res) => {
  try {
    const userId = req.user.id;
    const zoneData = {
      ...req.body,
      user_id: userId
    };
    
    // Kiểm tra farm có thuộc user không
    const farmCheck = await require('../models/Farm').findById(zoneData.farm_id, userId);
    if (!farmCheck) {
      return res.status(400).json({
        success: false,
        message: 'Trang trại không tồn tại hoặc không thuộc quyền quản lý của bạn'
      });
    }
    
    const newZone = await Zone.create(zoneData);
    
    res.status(201).json({
      success: true,
      message: 'Tạo khu vực thành công',
      data: newZone
    });
  } catch (error) {
    console.error('Create zone error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo khu vực mới',
      error: error.message
    });
  }
};

// Cập nhật zone
const updateZone = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const existingZone = await Zone.findById(id, userId);
    if (!existingZone) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khu vực'
      });
    }
    
    const updatedZone = await Zone.update(id, userId, req.body);
    
    res.json({
      success: true,
      message: 'Cập nhật khu vực thành công',
      data: updatedZone
    });
  } catch (error) {
    console.error('Update zone error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật khu vực',
      error: error.message
    });
  }
};

// Xóa zone
const deleteZone = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const deletedZone = await Zone.delete(id, userId);
    
    if (!deletedZone) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khu vực'
      });
    }
    
    res.json({
      success: true,
      message: 'Xóa khu vực thành công'
    });
  } catch (error) {
    console.error('Delete zone error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa khu vực',
      error: error.message
    });
  }
};

module.exports = {
  getAllZones,
  getZoneById,
  createZone,
  updateZone,
  deleteZone
};