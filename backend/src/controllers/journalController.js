const Journal = require('../models/Journal');
const Zone = require('../models/Zone');

// Lấy danh sách nhật ký theo zone
const getJournalByZone = async (req, res) => {
  try {
    const { zoneId } = req.params;
    const userId = req.user.id;
    const { limit } = req.query;
    
    // Kiểm tra zone có thuộc user không
    const zone = await Zone.findById(zoneId, userId);
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khu vực'
      });
    }
    
    const journals = await Journal.findByZone(zoneId, userId, limit || 50);
    
    res.json({
      success: true,
      data: journals,
      count: journals.length
    });
  } catch (error) {
    console.error('Get journal by zone error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách nhật ký',
      error: error.message
    });
  }
};

// Lấy chi tiết nhật ký
const getJournalById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const journal = await Journal.findById(id, userId);
    
    if (!journal) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhật ký'
      });
    }
    
    res.json({
      success: true,
      data: journal
    });
  } catch (error) {
    console.error('Get journal by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy chi tiết nhật ký',
      error: error.message
    });
  }
};

// Tạo nhật ký mới
const createJournal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { zone_id, images, materials, ...journalData } = req.body;
    
    // Kiểm tra zone có thuộc user không
    const zone = await Zone.findById(zone_id, userId);
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: 'Khu vực không tồn tại hoặc không thuộc quyền quản lý của bạn'
      });
    }
    
    // Tạo nhật ký
    const newJournal = await Journal.create({
      ...journalData,
      zone_id,
      user_id: userId
    });
    
    // Thêm hình ảnh nếu có
    if (images && images.length > 0) {
      await Journal.addImages(newJournal.id, images);
    }
    
    // Thêm vật tư nếu có
    if (materials && materials.length > 0) {
      await Journal.addMaterials(newJournal.id, materials);
    }
    
    // Lấy lại nhật ký với đầy đủ images và materials
    const completeJournal = await Journal.findById(newJournal.id, userId);
    
    res.status(201).json({
      success: true,
      message: 'Tạo nhật ký thành công',
      data: completeJournal
    });
  } catch (error) {
    console.error('Create journal error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo nhật ký',
      error: error.message
    });
  }
};

// Cập nhật nhật ký
const updateJournal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const existingJournal = await Journal.findById(id, userId);
    if (!existingJournal) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhật ký'
      });
    }
    
    const updatedJournal = await Journal.update(id, userId, req.body);
    
    res.json({
      success: true,
      message: 'Cập nhật nhật ký thành công',
      data: updatedJournal
    });
  } catch (error) {
    console.error('Update journal error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật nhật ký',
      error: error.message
    });
  }
};

// Xóa nhật ký
const deleteJournal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const deletedJournal = await Journal.delete(id, userId);
    
    if (!deletedJournal) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhật ký'
      });
    }
    
    res.json({
      success: true,
      message: 'Xóa nhật ký thành công'
    });
  } catch (error) {
    console.error('Delete journal error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa nhật ký',
      error: error.message
    });
  }
};

// Lấy thống kê nhật ký theo zone
const getJournalStats = async (req, res) => {
  try {
    const { zoneId } = req.params;
    const userId = req.user.id;
    
    const stats = await Journal.getStatsByZone(zoneId, userId);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get journal stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê nhật ký',
      error: error.message
    });
  }
};

module.exports = {
  getJournalByZone,
  getJournalById,
  createJournal,
  updateJournal,
  deleteJournal,
  getJournalStats
};