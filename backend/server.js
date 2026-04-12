const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
const zoneRoutes = require('./src/routes/zoneRoutes');
const farmRoutes = require('./src/routes/farmRoutes');
const journalRoutes = require('./src/routes/journalRoutes');
const materialRoutes = require('./src/routes/materialRoutes');



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/materials', materialRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Không tìm thấy API'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Lỗi server nội bộ'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📝 API docs:`);
  console.log(`   POST   /api/auth/register  - Đăng ký`);
  console.log(`   POST   /api/auth/login     - Đăng nhập`);
  console.log(`   GET    /api/auth/me        - Thông tin user (cần token)`);
});