/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUploader from './components/ImageUploader';
import WeatherWidget from './components/WetherWidget';
import authService from './services/authService';            // ← SỬA IMPORT
import farmService from './services/farmService';            // ← SỬA IMPORT
import zoneService from './services/zoneService';            // ← SỬA IMPORT
import journalService from './services/journalService';      // ← SỬA IMPORT
import materialService from './services/materialService';  // ← SỬA IMPORT
import { on } from 'events';

type Screen = 'login' | 'register' | 'dashboard' | 'areas' | 'logs' | 'profile' | 'addJournal' | 'addZone' | 'addFarm' | 'manageFarms'
| 'editZone' | 'materials';

// ==================== MANAGE FARMS SCREEN ====================
function ManageFarmsScreen({ onBack }: { onBack: () => void }) {
  const [farms, setFarms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFarms = async () => {
    try {
      const result = await farmService.getAll();
      setFarms(result.data || []);
    } catch (error) {
      console.error("Error fetching farms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleDeleteFarm = async (farmId: string, farmName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa trang trại "${farmName}"?`)) {
      try {
        const result = await farmService.delete(farmId);
        if (result.success) {
          alert("✅ Xóa trang trại thành công!");
          fetchFarms();
        } else {
          alert("❌ Lỗi: " + result.message);
        }
      } catch (error: any) {
        alert("❌ Lỗi: " + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      className="min-h-screen bg-surface pb-24"
    >
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-surface-container rounded-full">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline font-extrabold text-xl text-on-surface">Quản lý trang trại</h1>
      </header>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : farms.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-6xl mb-4">agriculture</span>
            <p>Chưa có trang trại nào</p>
          </div>
        ) : (
          <div className="space-y-3">
            {farms.map((farm) => (
              <div key={farm.id} className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-on-surface">{farm.name}</h3>
                  <p className="text-sm text-on-surface-variant">
                    {farm.address || 'Chưa có địa chỉ'} • {farm.total_area || 0} {farm.area_unit || 'ha'}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteFarm(farm.id, farm.name)}
                  className="p-2 text-error hover:bg-error-container/20 rounded-lg"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ==================== ADD FARM SCREEN ====================
function AddFarmScreen({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    total_area: '',
    area_unit: 'ha',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Gọi API đã có sẵn để tạo farm
      const result = await farmService.create({
        ...formData,
        total_area: parseFloat(formData.total_area) || 0,
      });
      
      if (result.success) {
        alert('✅ Tạo trang trại thành công!');
        onSuccess(); // Quay lại màn hình trước (ví dụ: khu vực)
      } else {
        alert('❌ Lỗi: ' + result.message);
      }
    } catch (error: any) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      className="min-h-screen bg-surface pb-24"
    >
      {/* Header với nút quay lại */}
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-surface-container rounded-full">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline font-extrabold text-xl text-on-surface">Thêm trang trại mới</h1>
      </header>

      {/* Form thông tin */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6 max-w-2xl mx-auto">
        {/* Tên trang trại */}
        <div>
          <label className="block text-sm font-semibold text-on-surface-variant mb-2">Tên trang trại</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="VD: Trang trại nhà tôi"
            className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Địa chỉ */}
        <div>
          <label className="block text-sm font-semibold text-on-surface-variant mb-2">Địa chỉ</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="VD: Xã Đông Xuân, Huyện Sóc Sơn, Hà Nội"
            className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Diện tích và đơn vị */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">Tổng diện tích</label>
            <input
              type="number"
              step="0.1"
              value={formData.total_area}
              onChange={(e) => setFormData({ ...formData, total_area: e.target.value })}
              placeholder="0.0"
              className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">Đơn vị</label>
            <select
              value={formData.area_unit}
              onChange={(e) => setFormData({ ...formData, area_unit: e.target.value })}
              className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary"
            >
              <option value="ha">ha (Hecta)</option>
              <option value="m2">m² (Mét vuông)</option>
              <option value="sào">Sào (Bắc Bộ)</option>
              <option value="mẫu">Mẫu</option>
            </select>
          </div>
        </div>

        {/* Nút Hủy và Tạo */}
        <div className="flex gap-4 pt-4">
          <button type="button" onClick={onBack} className="flex-1 py-4 bg-surface-container-high text-on-surface-variant font-bold rounded-xl active:scale-95 transition-all">
            Hủy
          </button>
          <button type="submit" disabled={loading} className="flex-1 py-4 bg-primary text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg">
            {loading ? 'Đang tạo...' : 'Tạo trang trại'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

// ==================== ADD ZONE SCREEN ====================
function AddZoneScreen({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'crop',
    crop_type: '',
    area: '',
    area_unit: 'ha',
    start_date: '',
    estimated_harvest_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [farms, setFarms] = useState<any[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [fetchingFarms, setFetchingFarms] = useState(true);

  useEffect(() => {
    fetchFarms();
  }, []);
    // Lấy danh sách farms
    const fetchFarms = async () => {
      try {
        const result = await farmService.getAll();
        console.log('Farms đã tải:', result.data);
        setFarms(result.data || []);
        if (result.data && result.data.length > 0) {
          setSelectedFarmId(result.data[0].id);
        } else {
          alert('Không tìm thấy trang trại nào');
          onBack();
        }
      } catch (error) {
        console.error('Lỗi tải farms:', error);
        alert('Không thể tải danh sách trang trại');
        onBack();
      } finally {
        setFetchingFarms(false);
      }
    };

    //hiển thị loading
    if (fetchingFarms) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
            <p className="mt-2 text-lg text-on-surface-variant">Đang tải danh sách trang trại...</p>
        </div>
        </div>
      );
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await zoneService.create({
        ...formData,
        farm_id: selectedFarmId,
        area: parseFloat(formData.area),
        start_date: formData.start_date,
        estimated_harvest_date: formData.estimated_harvest_date || null
      });
      
      if (result.success) {
        alert('✅ Tạo khu vực thành công!');
        onSuccess();
      } else {
        alert('❌ Lỗi: ' + result.message);
      }
    } catch (error: any) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      className="min-h-screen bg-surface pb-24"
    >
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-surface-container rounded-full">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline font-extrabold text-xl text-on-surface">Thêm khu vực mới</h1>
      </header>

      <form onSubmit={handleSubmit} className="p-6 space-y-6 max-w-2xl mx-auto">
        {/* Chọn trang trại */}
        <div>
          <label className="block text-sm font-semibold text-on-surface-variant mb-2">Trang trại</label>
          <select
            value={selectedFarmId}
            onChange={(e) => setSelectedFarmId(e.target.value)}
            className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary"
            required
          >
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>{farm.name}</option>
            ))}
          </select>
        </div>

        {/* Tên khu vực */}
        <div>
          <label className="block text-sm font-semibold text-on-surface-variant mb-2">Tên khu vực</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="VD: Vùng A - Lúa"
            className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Loại */}
        <div>
          <label className="block text-sm font-semibold text-on-surface-variant mb-2">Loại hình</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary"
          >
            <option value="crop">🌾 Cây trồng</option>
            <option value="livestock">🐓 Vật nuôi</option>
            <option value="aquaculture">🐟 Thủy sản</option>
          </select>
        </div>

        {/* Loại cây trồng/vật nuôi */}
        <div>
          <label className="block text-sm font-semibold text-on-surface-variant mb-2">Loại cây trồng/vật nuôi</label>
          <input
            type="text"
            value={formData.crop_type}
            onChange={(e) => setFormData({ ...formData, crop_type: e.target.value })}
            placeholder="VD: Lúa, Gà, Cá chép..."
            className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Diện tích */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">Diện tích/Số lượng</label>
            <input
              type="number"
              step="0.1"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              placeholder="0.0"
              className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">Đơn vị</label>
            <select
              value={formData.area_unit}
              onChange={(e) => setFormData({ ...formData, area_unit: e.target.value })}
              className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary"
            >
              <option value="ha">ha (hecta)</option>
              <option value="m2">m² (mét vuông)</option>
            </select>
          </div>
        </div>

        {/* Ngày tháng */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">Ngày bắt đầu</label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">Ngày dự kiến thu hoạch</label>
            <input
              type="date"
              value={formData.estimated_harvest_date}
              onChange={(e) => setFormData({ ...formData, estimated_harvest_date: e.target.value })}
              className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button type="button" onClick={onBack} className="flex-1 py-4 bg-surface-container-high text-on-surface-variant font-bold rounded-xl active:scale-95 transition-all">
            Hủy
          </button>
          <button type="submit" disabled={loading} className="flex-1 py-4 bg-primary text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg">
            {loading ? 'Đang tạo...' : 'Tạo khu vực'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

// ==================== EDIT ZONE SCREEN ====================
function EditZoneScreen({ onBack, zone, onSuccess }: { onBack: () => void; zone: any; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'crop',
    crop_type: '',
    area: '',
    area_unit: 'ha',
    start_date: '',
    estimated_harvest_date: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (zone) {
      setFormData({
        name: zone.name || '',
        type: zone.type || 'crop',
        crop_type: zone.crop_type || '',
        area: zone.area || '',
        area_unit: zone.area_unit || 'ha',
        start_date: zone.start_date ? new Date(zone.start_date).toISOString().split('T')[0] : '',
        estimated_harvest_date: zone.estimated_harvest_date ? new Date(zone.estimated_harvest_date).toISOString().split('T')[0] : ''
      });
    }
  }, [zone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await zoneService.update(zone.id, {
        ...formData,
        area: parseFloat(formData.area),
        start_date: formData.start_date,
        estimated_harvest_date: formData.estimated_harvest_date || null
      });
      
      if (result.success) {
        alert('✅ Cập nhật khu vực thành công!');
        onSuccess();
      } else {
        alert('❌ Lỗi: ' + result.message);
      }
    } catch (error: any) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      className="min-h-screen bg-surface pb-24"
    >
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-surface-container rounded-full">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline font-extrabold text-xl text-on-surface">Sửa khu vực</h1>
      </header>

      <form onSubmit={handleSubmit} className="p-6 space-y-6 max-w-2xl mx-auto">
        <div>
          <label className="block text-sm font-semibold text-on-surface-variant mb-2">Tên khu vực</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-on-surface-variant mb-2">Loại hình</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary"
          >
            <option value="crop">🌾 Cây trồng</option>
            <option value="livestock">🐓 Vật nuôi</option>
            <option value="aquaculture">🐟 Thủy sản</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-on-surface-variant mb-2">Loại cây trồng/vật nuôi</label>
          <input
            type="text"
            value={formData.crop_type}
            onChange={(e) => setFormData({ ...formData, crop_type: e.target.value })}
            className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">Diện tích</label>
            <input
              type="number"
              step="0.1"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">Đơn vị</label>
            <select
              value={formData.area_unit}
              onChange={(e) => setFormData({ ...formData, area_unit: e.target.value })}
              className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary"
            >
              <option value="ha">ha (hecta)</option>
              <option value="m2">m² (mét vuông)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">Ngày bắt đầu</label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">Ngày dự kiến thu hoạch</label>
            <input
              type="date"
              value={formData.estimated_harvest_date}
              onChange={(e) => setFormData({ ...formData, estimated_harvest_date: e.target.value })}
              className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={onBack} className="flex-1 py-4 bg-surface-container-high text-on-surface-variant font-bold rounded-xl">
            Hủy
          </button>
          <button type="submit" disabled={loading} className="flex-1 py-4 bg-primary text-white font-bold rounded-xl shadow-lg">
            {loading ? 'Đang lưu...' : 'Cập nhật'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
// ==================== MATERIALS SCREEN ====================
function MaterialsScreen({ onBack }: { onBack: () => void }) {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'fertilizer',
    unit: 'kg',
    current_quantity: '',
    min_threshold: '',
    expiry_date: ''
  });

  const fetchMaterials = async () => {
    try {
      const result = await materialService.getAll();
      setMaterials(result.data || []);
    } catch (error) {
      console.error('Lỗi tải vật tư:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await materialService.create({
        ...formData,
        current_quantity: parseFloat(formData.current_quantity) || 0,
        min_threshold: parseFloat(formData.min_threshold) || 0
      });
      if (result.success) {
        alert('✅ Thêm vật tư thành công!');
        setShowAddForm(false);
        fetchMaterials();
        setFormData({ name: '', category: 'fertilizer', unit: 'kg', current_quantity: '', min_threshold: '', expiry_date: '' });
      } else {
        alert('❌ Lỗi: ' + result.message);
      }
    } catch (error: any) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteMaterial = async (id: string, name: string) => {
    if (window.confirm(`Xóa vật tư "${name}"?`)) {
      try {
        const result = await materialService.delete(id);
        if (result.success) {
          alert('✅ Xóa thành công!');
          fetchMaterials();
        } else {
          alert('❌ Lỗi: ' + result.message);
        }
      } catch (error: any) {
        alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'fertilizer': '🌱 Phân bón',
      'pesticide': '🧪 Thuốc BVTV',
      'feed': '🌾 Thức ăn',
      'seed': '🌿 Hạt giống',
      'tool': '🔧 Dụng cụ'
    };
    return labels[category] || category;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      className="min-h-screen bg-surface pb-24"
    >
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-surface-container rounded-full">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline font-extrabold text-xl text-on-surface">Quản lý vật tư</h1>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary text-white p-2 rounded-full"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </header>

      <div className="p-6">
        {showAddForm && (
          <div className="bg-surface-container-low rounded-xl p-6 mb-6">
            <h3 className="font-headline font-bold text-lg mb-4">Thêm vật tư mới</h3>
            <form onSubmit={handleAddMaterial} className="space-y-4">
              <input
                type="text"
                placeholder="Tên vật tư"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 bg-surface-container-lowest rounded-lg"
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 bg-surface-container-lowest rounded-lg"
              >
                <option value="fertilizer">🌱 Phân bón</option>
                <option value="pesticide">🧪 Thuốc BVTV</option>
                <option value="feed">🌾 Thức ăn</option>
                <option value="seed">🌿 Hạt giống</option>
                <option value="tool">🔧 Dụng cụ</option>
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Đơn vị (kg, lít, bao...)"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="p-3 bg-surface-container-lowest rounded-lg"
                  required
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Số lượng tồn"
                  value={formData.current_quantity}
                  onChange={(e) => setFormData({ ...formData, current_quantity: e.target.value })}
                  className="p-3 bg-surface-container-lowest rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ngưỡng cảnh báo"
                  value={formData.min_threshold}
                  onChange={(e) => setFormData({ ...formData, min_threshold: e.target.value })}
                  className="p-3 bg-surface-container-lowest rounded-lg"
                />
                <input
                  type="date"
                  placeholder="Hạn sử dụng"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  className="p-3 bg-surface-container-lowest rounded-lg"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg">Lưu</button>
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 bg-surface-container-high py-2 rounded-lg">Hủy</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : materials.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-6xl mb-4">inventory</span>
            <p>Chưa có vật tư nào</p>
          </div>
        ) : (
          <div className="space-y-3">
            {materials.map((material) => (
              <div key={material.id} className="bg-surface-container-lowest p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-on-surface">{material.name}</h3>
                    <p className="text-sm text-on-surface-variant">{getCategoryLabel(material.category)}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span>Tồn: <strong>{material.current_quantity} {material.unit}</strong></span>
                      <span>Ngưỡng: {material.min_threshold} {material.unit}</span>
                      {material.expiry_date && (
                        <span>HSD: {new Date(material.expiry_date).toLocaleDateString('vi-VN')}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteMaterial(material.id, material.name)}
                    className="p-2 text-error hover:bg-error-container/20 rounded-lg"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [selectedZone, setSelectedZone] = useState<any>(null);

  // Kiểm tra token khi khởi động
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && currentScreen === 'login') {
      setCurrentScreen('dashboard');
    }
  }, []);

  const navigateTo = (screen: Screen, zoneData?: any) => {
    if (zoneData) setSelectedZone(zoneData);
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      <AnimatePresence mode="wait">
        {currentScreen === 'login' && (
          <LoginScreen onLogin={() => navigateTo('dashboard')} onRegister={() => navigateTo('register')} />
        )}
        {currentScreen === 'register' && (
          <RegisterScreen onBack={() => navigateTo('login')} onRegister={() => navigateTo('dashboard')} />
        )}
        
        {/* Các màn hình có MainLayout */}
        {['dashboard', 'areas', 'logs', 'profile', 'materials'].includes(currentScreen) && (
          <MainLayout currentScreen={currentScreen} onNavigate={navigateTo}>
              {currentScreen === 'dashboard' && <DashboardScreen onAddJournal={() => navigateTo('addJournal')} />}
              {currentScreen === 'areas' && (
                <AreasScreen 
                  onSelectZone={(zone) => navigateTo('logs', zone)} 
                  onAddZone={() => navigateTo('addZone')}
                  onAddFarm={() => navigateTo('addFarm')}
                  onEditZone={(zone) => navigateTo('editZone', zone)}
                  onDeleteZone={async (zoneId, zoneName) => {
                    if (window.confirm(`Xóa khu vực "${zoneName}"?`)) {
                      try {
                        const result = await zoneService.delete(zoneId);
                        if (result.success) {
                          alert('✅ Xóa khu vực thành công!');
                          window.location.reload();
                        } else {
                          alert('❌ Lỗi: ' + result.message);
                        }
                      } catch (error: any) {
                        alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
                      }
                    }
                  }}
                />
              )}
              {currentScreen === 'logs' && <LogsScreen zone={selectedZone} onAddJournal={() => navigateTo('addJournal')} />}
              {currentScreen === 'profile' && <ProfileScreen onLogout={() => navigateTo('login')} onNavigate={navigateTo} />}
              {currentScreen === 'materials' && <MaterialsScreen onBack={() => navigateTo('dashboard')} />}
            </MainLayout>
          )}  
        
        {/* Màn hình thêm nhật ký (không có MainLayout) */}
        {currentScreen === 'addJournal' && (
          <AddJournalScreen onBack={() => navigateTo('logs', selectedZone)} zone={selectedZone} />
        )}
        

        {/*Màn hình thêm trang trại */}
        {currentScreen === 'addFarm' && (
          <AddFarmScreen onBack={() => navigateTo('areas')} onSuccess={() => navigateTo('areas')} />
        )}

        {/* Màn hình thêm khu vực (không có MainLayout) - ĐẶT RIÊNG, KHÔNG TRONG MAINLAYOUT */}
        {currentScreen === 'addZone' && (
          <AddZoneScreen onBack={() => navigateTo('areas')} onSuccess={() => navigateTo('areas')} />
        )}

        {/* Màn hình quản lý trang trại (không có MainLayout) */}
        {currentScreen === 'manageFarms' && <ManageFarmsScreen onBack={() => navigateTo('profile')} />}
        {/* sửa và xóa khu vực */}
        {currentScreen === 'editZone' && selectedZone && ( 
          <EditZoneScreen 
            zone={selectedZone} 
            onBack={() => navigateTo('areas')} 
            onSuccess={() => navigateTo('areas')} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== LOGIN SCREEN ====================
function LoginScreen({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.login({ email, password });
      if (result.success) {
        onLogin();
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
    >
      <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-surface-container-lowest rounded-[2.5rem] overflow-hidden shadow-[0_24px_48px_rgba(24,29,26,0.08)]">
        <section className="hidden md:flex flex-col justify-between p-12 hero-gradient relative overflow-hidden text-on-primary">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <span className="material-symbols-outlined text-4xl fill-icon">eco</span>
              <span className="font-headline font-extrabold text-2xl tracking-tighter">Người canh tác số</span>
            </div>
            <h1 className="font-headline font-extrabold text-5xl leading-tight mb-6 tracking-tight">
              Nuôi dưỡng tương lai xanh với AgroFlow.
            </h1>
            <p className="text-primary-fixed font-medium text-lg max-w-md opacity-90 leading-relaxed">
              Hệ thống quản lý nông trại thông minh, giúp bạn tối ưu hóa năng suất bằng dữ liệu thời gian thực.
            </p>
          </div>
          <div className="relative z-10 bio-membrane p-6 rounded-2xl border border-white/10 shadow-xl self-start max-w-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-primary fill-icon">analytics</span>
              </div>
              <div>
                <p className="font-bold text-on-primary-container leading-none">Hiệu suất 98%</p>
                <p className="text-xs text-on-primary-container/70 uppercase tracking-widest mt-1">Chỉ số sức khỏe cây trồng</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col justify-center p-8 md:p-16 lg:p-24 bg-surface-container-lowest">
          <div className="md:hidden flex items-center gap-2 mb-8">
            <span className="material-symbols-outlined text-primary text-3xl fill-icon">eco</span>
            <span className="font-headline font-extrabold text-xl tracking-tighter text-primary">AgroFlow</span>
          </div>
          <div className="mb-10">
            <h2 className="font-headline font-extrabold text-3xl text-on-surface tracking-tight mb-2">Chào mừng trở lại</h2>
            <p className="text-on-surface-variant font-medium">Đăng nhập vào bảng điều khiển nông trại của bạn.</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface-variant px-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors">person</span>
                </div>
                <input 
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface font-medium transition-all" 
                  placeholder="nongdan@email.com" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="block text-sm font-semibold text-on-surface-variant">Mật khẩu</label>
                <a className="text-xs font-bold text-primary hover:underline transition-all" href="#">Quên mật khẩu?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors">lock</span>
                </div>
                <input 
                  className="w-full pl-12 pr-12 py-4 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface font-medium transition-all" 
                  placeholder="••••••••" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {error && (
              <div className="bg-error-container/20 border-l-4 border-error p-3 rounded-lg">
                <p className="text-error text-sm font-medium">{error}</p>
              </div>
            )}
            
            <button 
              className="w-full py-4 bg-primary text-on-primary font-headline font-bold text-lg rounded-xl shadow-lg hover:shadow-primary/20 active:scale-95 transition-all duration-200 mt-4 flex items-center justify-center gap-2" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">sync</span>
                  Đang xử lý...
                </>
              ) : (
                <>
                  Đăng nhập
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </form>
          
          <div className="mt-10 pt-10 border-t border-outline-variant/30 flex flex-col items-center gap-6">
            <p className="text-on-surface-variant font-medium mt-4">
              Chưa có tài khoản? 
              <button onClick={onRegister} className="text-primary font-bold hover:underline ml-1">Đăng ký ngay</button>
            </p>
          </div>
        </section>
      </main>
    </motion.div>
  );
}

// ==================== REGISTER SCREEN ====================
function RegisterScreen({ onBack, onRegister }: { onBack: () => void; onRegister: () => void }) {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.register({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone: formData.phone
      });
      
      if (result.success) {
        onRegister();
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col md:flex-row bg-organic-mesh"
    >
      <aside className="hidden md:flex md:w-5/12 lg:w-1/2 relative overflow-hidden bg-primary items-center justify-center p-12">
        <div className="relative z-10 max-w-md">
          <div className="mb-8">
            <span className="inline-block p-4 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20">
              <span className="material-symbols-outlined text-white text-5xl fill-icon">eco</span>
            </span>
          </div>
          <h1 className="font-headline font-extrabold text-5xl text-white tracking-tighter leading-tight mb-6">
            Người canh tác <br />số
          </h1>
          <p className="text-primary-fixed text-xl leading-relaxed font-light">
            Hệ thống quản lý nông trại thông minh AgroFlow. Kết nối dữ liệu, tối ưu hóa quy trình canh tác.
          </p>
        </div>
      </aside>
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-20">
        <div className="w-full max-w-md space-y-8">
          <header className="text-left space-y-2">
            <div className="md:hidden flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary text-3xl fill-icon">eco</span>
              <span className="font-headline font-extrabold text-xl text-primary tracking-tighter">AgroFlow</span>
            </div>
            <h2 className="font-headline font-bold text-3xl text-on-surface tracking-tight">Tạo tài khoản mới</h2>
            <p className="text-on-surface-variant text-lg">Bắt đầu hành trình số hóa nông trại của bạn.</p>
          </header>
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="font-label text-sm font-semibold text-on-surface-variant px-1">Họ và tên</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">person</span>
                <input 
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all" 
                  id="full_name"
                  placeholder="Nguyễn Văn A" 
                  type="text"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="font-label text-sm font-semibold text-on-surface-variant px-1">Số điện thoại</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">call</span>
                <input 
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all" 
                  id="phone"
                  placeholder="09xx xxx xxx" 
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="font-label text-sm font-semibold text-on-surface-variant px-1">Email</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">mail</span>
                <input 
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all" 
                  id="email"
                  placeholder="email@example.com" 
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-label text-sm font-semibold text-on-surface-variant px-1">Mật khẩu</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">lock</span>
                  <input 
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all" 
                    id="password"
                    placeholder="••••••••" 
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-label text-sm font-semibold text-on-surface-variant px-1">Xác nhận</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">lock_reset</span>
                  <input 
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all" 
                    id="confirmPassword"
                    placeholder="••••••••" 
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            {error && (
              <div className="bg-error-container/20 border-l-4 border-error p-3 rounded-lg">
                <p className="text-error text-sm font-medium">{error}</p>
              </div>
            )}
            
            <div className="flex items-start gap-3 py-2">
              <input className="w-5 h-5 rounded-md border-outline-variant text-primary focus:ring-primary bg-surface-container-lowest" id="terms" type="checkbox" required />
              <label className="text-sm text-on-surface-variant leading-relaxed" htmlFor="terms">
                Tôi đồng ý với <a className="text-primary font-semibold" href="#">Điều khoản</a> và <a className="text-primary font-semibold" href="#">Chính sách bảo mật</a>.
              </label>
            </div>
            
            <button 
              className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-lg rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">sync</span>
                  Đang xử lý...
                </>
              ) : (
                <>
                  Đăng ký ngay
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </form>
          
          <footer className="pt-6 text-center">
            <p className="text-on-surface-variant font-medium">
              Đã có tài khoản? 
              <button onClick={onBack} className="text-primary font-bold ml-1 hover:underline">Đăng nhập</button>
            </p>
          </footer>
        </div>
      </main>
    </motion.div>
  );
}

// ==================== MAIN LAYOUT ====================
function MainLayout({ children, currentScreen, onNavigate }: { children: React.ReactNode; currentScreen: Screen; onNavigate: (screen: Screen) => void }) {
  return (
    <div className="min-h-screen pb-24">
      <header className="w-full sticky top-0 z-50 bg-surface/80 backdrop-blur-md flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button className="text-primary active:scale-95 duration-200">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="font-headline font-extrabold text-primary tracking-tighter text-lg">Người canh tác số</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-primary p-2 hover:bg-surface-container transition-colors rounded-full">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      <motion.main 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: -10 }}
        className="px-6 py-4 max-w-5xl mx-auto"
      >
        {children}
      </motion.main>

      {/* Bottom Navigation - ĐÃ SỬA: THÊM 'materials' VÀO MẢNG */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 bg-surface-container/80 backdrop-blur-xl rounded-t-[2rem] z-50 shadow-[0_-4px_24px_rgba(24,29,26,0.06)]">
        {['dashboard', 'areas', 'logs', 'profile', 'materials'].map((screen) => (
          <button 
            key={screen}
            onClick={() => onNavigate(screen as Screen)}
            className={`flex flex-col items-center justify-center px-6 py-2 transition-all duration-300 ease-out ${currentScreen === screen ? 'bg-primary-container text-white rounded-2xl scale-105 shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
          >
            <span className="material-symbols-outlined">
              {screen === 'dashboard' && 'dashboard'}
              {screen === 'areas' && 'potted_plant'}
              {screen === 'logs' && 'history'}
              {screen === 'profile' && 'account_circle'}
              {screen === 'materials' && 'inventory'}
            </span>
            <span className="font-label text-[10px] font-semibold uppercase tracking-widest mt-1">
              {screen === 'dashboard' && 'Bảng điều khiển'}
              {screen === 'areas' && 'Khu vực'}
              {screen === 'logs' && 'Nhật ký'}
              {screen === 'profile' && 'Hồ sơ'}
              {screen === 'materials' && 'Vật tư'}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// ==================== DASHBOARD SCREEN ====================
function DashboardScreen({ onAddJournal }: { onAddJournal: () => void }) {
  const [zones, setZones] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const zonesResult = await zoneService.getAll({ status: 'active' });
      setZones(zonesResult.data || []);
      
      if (zonesResult.data && zonesResult.data.length > 0) {
        const journalResult = await journalService.getByZone(zonesResult.data[0].id, 5);
        setActivities(journalResult.data || []);
      }
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
          <p className="mt-2 text-on-surface-variant">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        <div className="md:col-span-8 space-y-2">
          <p className="font-headline font-bold text-on-surface-variant">Chào mừng trở lại</p>
          <h2 className="font-headline font-extrabold text-4xl text-on-surface tracking-tighter">
            Nông trại của bạn đang <span className="text-primary">phát triển tốt</span>.
          </h2>
        </div>
        <div className="md:col-span-4">
          <WeatherWidget unit="celsius" />
        </div>
      </section>

      <section className="bg-tertiary-container/10 border-l-4 border-tertiary p-4 rounded-xl flex items-center gap-4">
        <div className="bg-tertiary text-on-tertiary p-2 rounded-lg">
          <span className="material-symbols-outlined">warning</span>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-sm text-on-surface">Cảnh báo kho hàng</h4>
          <p className="text-xs text-on-surface-variant font-medium">Kiểm tra kho vật tư để đảm bảo đủ cho vụ mùa</p>
        </div>
        <button className="bg-tertiary text-on-tertiary px-4 py-1.5 rounded-full text-xs font-bold uppercase active:scale-95 transition-transform">
          Kiểm tra
        </button>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="font-headline font-extrabold text-xl">Khu vực quản lý</h3>
          <button className="text-primary font-bold text-sm flex items-center gap-1">Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {zones.length > 0 ? (
            zones.slice(0, 3).map((area, idx) => (
              <AreaCard 
                key={idx}
                name={area.name}
                type={area.crop_type || 'Cây trồng'}
                size={`${area.area} ${area.area_unit}`}
                progress={area.progress_percentage}
                status={area.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                icon={area.type === 'crop' ? 'grass' : 'pets'}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-on-surface-variant">
              Chưa có khu vực nào. Hãy thêm khu vực đầu tiên!
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-headline font-extrabold text-xl">Hoạt động gần đây</h3>
        <div className="bg-surface-container-low rounded-3xl overflow-hidden">
          {activities.length > 0 ? (
            activities.slice(0, 3).map((activity, idx) => (
              <ActivityItem 
                key={idx}
                title={activity.title || activity.activity_type}
                zone={activity.zone_name || 'Khu vực'}
                time={new Date(activity.activity_date).toLocaleDateString('vi-VN')}
                icon={getActivityIcon(activity.activity_type)}
              />
            ))
          ) : (
            <div className="p-8 text-center text-on-surface-variant">
              Chưa có hoạt động nào gần đây
            </div>
          )}
        </div>
      </section>

      <button
        onClick={onAddJournal}
        className="fixed bottom-24 right-6 bg-primary text-white w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center active:scale-95 transition-transform z-40 bg-gradient-to-br from-primary to-primary-container"
      >
        <span className="material-symbols-outlined font-bold">add</span>
      </button>
    </div>
  );
}

// ==================== AREAS SCREEN ====================
function AreasScreen({ onSelectZone, onAddZone, onEditZone, onDeleteZone, onAddFarm }: { 
  onSelectZone: (zone: any) => void; 
  onAddZone: () => void;
  onEditZone: (zone: any) => void;
  onDeleteZone: (zoneId: string, zoneName: string) => Promise<void>;
  onAddFarm: () => void;
}) {
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const result = await zoneService.getAll();
      setAreas(result.data || []);
    } catch (error) {
      console.error('Lỗi tải khu vực:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

const handleDelete = async (zoneId: string, zoneName: string) => {
  if (window.confirm(`Bạn có chắc chắn muốn xóa khu vực "${zoneName}"?\n\nLưu ý: Tất cả nhật ký trong khu vực này cũng sẽ bị xóa!`)) {
    try {
      await onDeleteZone(zoneId, zoneName);
      // Đợi 500ms rồi mới fetch lại
      setTimeout(() => {
        fetchZones();
      }, 500);
    } catch (error) {
      console.error('Lỗi xóa:', error);
    }
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
          <p className="mt-2 text-on-surface-variant">Đang tải khu vực...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="mb-10 relative">
        <div className="absolute -left-4 top-0 w-1 h-12 bg-primary rounded-full"></div>
        <h2 className="font-headline font-bold text-3xl tracking-tight text-on-surface ml-2">Khu vực canh tác</h2>
        <p className="font-body text-on-surface-variant mt-2 ml-2">Quản lý và theo dõi các phân đoạn cây trồng</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas.map((area) => {
          const startDate = new Date(area.start_date);
          const formattedDate = `${startDate.getDate()}/${startDate.getMonth() + 1}/${startDate.getFullYear()}`;
          
          return (
            <AreaDetailCard 
              key={area.id}
              id={area.id}
              title={area.name}
              crop={area.crop_type || 'Cây trồng'}
              size={`${area.area} ${area.area_unit}`}
              date={formattedDate}
              cycle={area.progress_percentage || 0}
              status={area.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
              icon={area.type === 'crop' ? 'agriculture' : 'pets'}
              onClick={() => onSelectZone(area)}
              onEdit={() => onEditZone(area)}
              onDelete={() => handleDelete(area.id, area.name)}
            />
          );
        })}
      </div>

      {areas.length === 0 && (
        <div className="text-center py-12 text-on-surface-variant">
          <span className="material-symbols-outlined text-6xl mb-4">agriculture</span>
          <p>Chưa có khu vực canh tác nào</p>
          <div className="flex gap-3 justify-center mt-4">
            <button 
              onClick={onAddZone}
              className="bg-primary text-white px-6 py-2 rounded-xl"
            >
              + Thêm khu vực mới
            </button>
            <button
              onClick={onAddFarm}
              className="bg-primary text-white px-6 py-2 rounded-xl"
            >
              + Tạo trang trại mới
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={onAddZone}
        className="fixed bottom-28 right-6 md:bottom-10 md:right-10 bg-gradient-to-br from-primary to-primary-container text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 active:scale-95 transition-all duration-200 group z-[60]"
      >
        <span className="material-symbols-outlined">add</span>
        <span className="font-headline font-bold pr-2 hidden group-hover:inline-block transition-all duration-300">Thêm khu vực mới</span>
      </button>
    </div>
  );
}

// ==================== LOGS SCREEN ====================
function LogsScreen({ zone, onAddJournal }: { zone: any; onAddJournal: () => void }) {
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const handleDeleteJournal = async (journalId: string, journalTitle: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhật ký "${journalTitle}"?`)) {
      try {
        await journalService.delete(journalId);
        // Đợi 500ms rồi mới fetch lại
        setTimeout(() => {
          fetchJournals();
        }, 500);
      } catch (error) {
        console.error('Lỗi xóa nhật ký:', error);
      }
    }
  };

  

  useEffect(() => {
    if (zone?.id) {
      fetchJournals();
    }
  }, [zone]);

  const fetchJournals = async () => {
    try {
      setLoading(true);
      const result = await journalService.getByZone(zone.id);
      setJournalEntries(result.data || []);
    } catch (error) {
      console.error('Lỗi tải nhật ký:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return `Hôm nay, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
          <p className="mt-2 text-on-surface-variant">Đang tải nhật ký...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="mb-10">
        <div className="flex items-center gap-2 text-on-surface-variant mb-2">
          <span className="material-symbols-outlined text-sm">potted_plant</span>
          <span className="font-label font-semibold uppercase tracking-widest text-[10px]">Khu vực / {zone?.name || 'Vùng A'}</span>
        </div>
        <h2 className="font-headline font-extrabold text-4xl text-on-surface tracking-tight">{zone?.name || 'Vùng A'} - {zone?.crop_type || 'Lúa'}</h2>
        <p className="text-on-surface-variant mt-2 font-medium">Nhật ký canh tác chi tiết</p>
      </section>

      <div className="relative space-y-12">
        <div className="timeline-line"></div>
        {journalEntries.length > 0 ? (
          journalEntries.map((entry, idx) => (
            <TimelineEntry 
              key={idx}
              date={formatDate(entry.activity_date)}
              title={entry.title || getActivityName(entry.activity_type)}
              description={entry.description || `Hoạt động: ${getActivityName(entry.activity_type)}`}
              icon={getActivityIcon(entry.activity_type)}
              iconBg="bg-primary"
              iconColor="text-white"
              onDelete={() => handleDeleteJournal(entry.id, entry.title || getActivityName(entry.activity_type))}
            />
          ))
        ) : (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-6xl mb-4">history</span>
            <p>Chưa có nhật ký canh tác nào</p>
            <button 
              onClick={onAddJournal}
              className="mt-4 bg-primary text-white px-6 py-2 rounded-xl"
            >
              Thêm nhật ký đầu tiên
            </button>
          </div>
        )}
      </div>

      <button
        onClick={onAddJournal}
        className="fixed bottom-24 right-6 w-16 h-16 bg-primary text-white rounded-2xl shadow-lg flex items-center justify-center active:scale-95 z-50 bg-gradient-to-br from-primary to-primary-container"
      >
        <span className="material-symbols-outlined text-3xl font-bold">add</span>
      </button>
    </div>
  );
}

// ==================== ADD JOURNAL SCREEN ====================
function AddJournalScreen({ onBack, zone }: { onBack: () => void; zone: any }) {
  const [activityType, setActivityType] = useState('fertilizing');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const activityTypes = [
    { value: 'planting', label: 'Gieo trồng', icon: 'grass' },
    { value: 'watering', label: 'Tưới nước', icon: 'water_drop' },
    { value: 'fertilizing', label: 'Bón phân', icon: 'compost' },
    { value: 'spraying', label: 'Phun thuốc', icon: 'spray' },
    { value: 'harvesting', label: 'Thu hoạch', icon: 'agriculture' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const journalData = {
        zone_id: zone.id,
        activity_type: activityType,
        title: title,
        description: description,
        activity_date: new Date().toISOString(),
        images: images.map(img => ({ url: img }))
      };
      
      const result = await journalService.create(journalData);
      
      if (result.success) {
        alert(`✅ Đã thêm nhật ký thành công!\n\n📝 ${title}\n📸 ${images.length} ảnh đính kèm`);
        onBack();
      } else {
        alert('❌ Lỗi: ' + result.message);
      }
    } catch (error: any) {
      alert('❌ Lỗi khi thêm nhật ký: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      className="min-h-screen bg-surface pb-24"
    >
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-surface-container rounded-full">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline font-extrabold text-xl text-on-surface">Thêm nhật ký mới</h1>
      </header>

      <form onSubmit={handleSubmit} className="p-6 space-y-6 max-w-2xl mx-auto">
        <div>
          <label className="block text-sm font-semibold text-on-surface-variant mb-2">Khu vực</label>
          <div className="bg-surface-container-low rounded-xl p-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">potted_plant</span>
              <span className="font-medium text-on-surface">{zone?.name || 'Vùng A'} - {zone?.crop_type || 'Lúa'}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-on-surface-variant mb-2">Loại hoạt động</label>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {activityTypes.map(type => (
              <button
                key={type.value}
                type="button"
                onClick={() => setActivityType(type.value)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                  activityType === type.value
                    ? 'bg-primary text-white'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined">{type.icon}</span>
                <span className="text-[10px] font-bold">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-on-surface-variant mb-2">Tiêu đề</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="VD: Bón phân đợt 1, Tưới nước buổi sáng..."
            className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface font-medium transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-on-surface-variant mb-2">Mô tả chi tiết</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả chi tiết hoạt động canh tác..."
            rows={4}
            className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface font-medium transition-all resize-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-on-surface-variant mb-2">Hình ảnh</label>
          <ImageUploader onImagesUploaded={setImages} existingImages={images} maxImages={5} />
        </div>
        
        <div className="flex gap-4 pt-4">
          <button type="button" onClick={onBack} className="flex-1 py-4 bg-surface-container-high text-on-surface-variant font-bold rounded-xl active:scale-95 transition-all">
            Hủy
          </button>
          <button type="submit" disabled={loading} className="flex-1 py-4 bg-primary text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg">
            {loading ? 'Đang lưu...' : 'Lưu nhật ký'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

// ==================== PROFILE SCREEN ====================
function ProfileScreen({ onLogout, onNavigate }: { onLogout: () => void, onNavigate: (screen: Screen) => void }) {
  const [user, setUser] = useState<any>(null);
  const [farms, setFarms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Khai báo fetchFarms trước khi dùng
  const fetchFarms = async () => {
    try {
      const result = await farmService.getAll();
      setFarms(result.data || []);
    } catch (error) {
      console.error("Error fetching farms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userData = authService.getCurrentUser();
    setUser(userData);
    fetchFarms();
  }, []);

  const handleDeleteFarm = async (farmId: string, farmName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa trang trại "${farmName}"?\n\nLưu ý: Tất cả khu vực và nhật ký trong trang trại này cũng sẽ bị xóa!`)) {
      try {
        const result = await farmService.delete(farmId);
        if (result.success) {
          alert("✅ Đã xóa trang trại thành công!");
          fetchFarms(); // Tải lại danh sách
        } else {
          alert("❌ Lỗi: " + result.message);
        }
      } catch (error: any) {
        alert("❌ Lỗi: " + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="flex flex-col items-center mb-12">
        <div className="relative">
          <div className="absolute -inset-4 bg-primary-fixed/20 rounded-full blur-2xl"></div>
          <div className="relative w-32 h-32 rounded-full border-4 border-surface-container-lowest overflow-hidden shadow-2xl bg-gradient-to-br from-primary/20 to-primary-container/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-primary">person</span>
          </div>
          <button className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
        </div>
        <div className="mt-6 text-center">
          <h2 className="font-headline font-extrabold text-2xl text-on-surface">{user?.full_name || 'Người canh tác'}</h2>
          <p className="font-label text-sm uppercase tracking-widest text-on-surface-variant font-semibold mt-1">{user?.email || 'Chủ trang trại'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm">
          <span className="material-symbols-outlined text-primary mb-2">potted_plant</span>
          <p className="text-2xl font-headline font-bold text-on-surface">{farms.length}</p>
          <p className="text-xs font-label text-on-surface-variant">Trang trại</p>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm">
          <span className="material-symbols-outlined text-tertiary mb-2">history</span>
          <p className="text-2xl font-headline font-bold text-on-surface">0</p>
          <p className="text-xs font-label text-on-surface-variant">Nhật ký hoạt động</p>
        </div>
      </div>

      {/* Danh sách trang trại */}
      <div className="mb-8">
        <h3 className="font-headline font-bold text-on-surface mb-4 px-2">Danh sách trang trại</h3>
        {loading ? (
          <div className="text-center py-4">
            <span className="material-symbols-outlined animate-spin text-primary">sync</span>
            <p className="text-sm text-on-surface-variant mt-2">Đang tải...</p>
          </div>
        ) : farms.length === 0 ? (
          <div className="text-center py-8 bg-surface-container-low rounded-xl">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant">agriculture</span>
            <p className="text-on-surface-variant mt-2">Chưa có trang trại nào</p>
          </div>
        ) : (
          <div className="space-y-3">
            {farms.map((farm) => (
              <div key={farm.id} className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-on-surface">{farm.name}</h4>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {farm.address || 'Chưa có địa chỉ'} • {farm.total_area || 0} {farm.area_unit || 'ha'}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteFarm(farm.id, farm.name)}
                  className="p-2 text-error hover:bg-error-container/20 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-headline font-bold text-on-surface mb-4 px-2">Cài đặt</h3>
        <ProfileNavItem 
          icon="person" 
          label="Thông tin cá nhân" 
          onClick={() => onNavigate('profile')}  // ← SỬA: navigateTo → onNavigate
        />
        <ProfileNavItem 
          icon="agriculture" 
          label="Quản lý trang trại" 
          onClick={() => onNavigate('manageFarms')}  // ← SỬA: navigateTo → onNavigate
        />
        <ProfileNavItem 
          icon="notifications" 
          label="Thông báo" 
          onClick={() => {}} 
        />
        <ProfileNavItem 
          icon="language" 
          label="Ngôn ngữ" 
          extra="Tiếng Việt" 
          onClick={() => {}} 
        />
        <div className="pt-8">
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 p-4 bg-secondary-container text-secondary font-bold rounded-xl hover:bg-error-container hover:text-error transition-all active:scale-95">
            <span className="material-symbols-outlined">logout</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== HELPER COMPONENTS & FUNCTIONS ====================
function getActivityIcon(type: string): string {
  const icons: Record<string, string> = {
    'planting': 'grass',
    'watering': 'water_drop',
    'fertilizing': 'compost',
    'spraying': 'spray',
    'harvesting': 'agriculture',
    'feeding': 'pets',
    'vaccination': 'vaccines'
  };
  return icons[type] || 'event_note';
}

function getActivityName(type: string): string {
  const names: Record<string, string> = {
    'planting': 'Gieo trồng',
    'watering': 'Tưới nước',
    'fertilizing': 'Bón phân',
    'spraying': 'Phun thuốc',
    'harvesting': 'Thu hoạch',
    'feeding': 'Cho ăn',
    'vaccination': 'Tiêm phòng'
  };
  return names[type] || 'Hoạt động khác';
}

function AreaCard({ name, type, size, progress, status, icon, alert }: any) {
  return (
    <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm hover:translate-y-[-4px] transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-primary/10 text-primary p-3 rounded-xl">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${status === 'Cần chú ý' ? 'bg-tertiary-fixed' : 'bg-primary-fixed'}`}>{status}</span>
      </div>
      <h4 className="font-headline font-bold text-on-surface">{name}</h4>
      <p className="text-on-surface-variant text-sm mb-4">{type} • {size}</p>
      {progress !== undefined && (
        <>
          <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-[10px] font-bold text-on-surface-variant mt-2 uppercase">Tiến độ: {progress}%</p>
        </>
      )}
      {alert && (
        <div className="flex items-center gap-1 text-tertiary font-bold text-xs mt-2">
          <span className="material-symbols-outlined text-sm">warning</span> {alert}
        </div>
      )}
    </div>
  );
}

function ActivityItem({ title, zone, time, icon }: any) {
  return (
    <div className="p-4 flex items-center gap-4 hover:bg-surface-container-high transition-colors">
      <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-xs text-on-surface-variant">{zone}</p>
      </div>
      <span className="text-xs font-medium text-on-surface-variant">{time}</span>
    </div>
  );
}

function AreaDetailCard({ title, crop, size, date, cycle, status, icon, onClick, onEdit, onDelete }: any) {
  return (
    <div className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
      <div 
        className="relative h-48 w-full bg-gradient-to-br from-primary/20 to-primary-container/20 flex items-center justify-center cursor-pointer"
        onClick={onClick}
      >
        <span className="material-symbols-outlined text-6xl text-primary/40">{icon}</span>
        <div className="absolute top-4 right-4 backdrop-blur-md px-3 py-1 rounded-full bg-surface-container-highest/80">
          <span className="text-[10px] font-bold uppercase">{status}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-headline font-bold text-xl text-on-surface">{title}</h3>
            <p className="text-sm text-on-surface-variant mt-1">{crop} • {size}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onEdit}
              className="bg-secondary-container p-2 rounded-lg hover:bg-primary/20 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
            <button 
              onClick={onDelete}
              className="bg-secondary-container p-2 rounded-lg hover:bg-error-container/50 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between text-xs font-label text-on-surface-variant uppercase">
            <span>Ngày trồng</span>
            <span className="font-bold text-on-surface">{date}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs font-bold text-primary">Chu kỳ</span>
              <span className="text-xs font-bold text-on-surface">{cycle}%</span>
            </div>
            <div className="h-2 w-full bg-primary-fixed rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${cycle}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineEntry({ date, title, description, icon, iconBg, iconColor, containerBg, onDelete }: any) {
  return (
    <article className="relative pl-16 group">
      <div className="absolute left-0 top-0 z-10">
        <div className={`w-12 h-12 ${iconBg} flex items-center justify-center rounded-2xl shadow-sm ${iconColor}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
      <div className={`${containerBg || 'bg-surface-container-lowest'} p-6 rounded-xl shadow-sm transition-transform group-hover:scale-[1.01]`}>
        <div className="flex justify-between items-start mb-2">
          <span className="font-bold font-headline text-lg text-primary">{date}</span>
          {onDelete && (
            <button 
              onClick={onDelete}
              className="p-2 text-error hover:bg-error-container/20 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
          )}
        </div>
        <h3 className="font-headline font-bold text-xl text-on-surface mb-2">{title}</h3>
        <p className="text-on-surface-variant leading-relaxed">{description}</p>
      </div>
    </article>
  );
}

function ProfileNavItem({ icon, label, extra, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container transition-colors rounded-xl"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center bg-surface-container-lowest rounded-full group-hover:bg-primary/10 transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">{icon}</span>
        </div>
        <span className="font-medium text-on-surface">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {extra && <span className="text-sm text-on-surface-variant">{extra}</span>}
        <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
      </div>
    </button>
  );
}
