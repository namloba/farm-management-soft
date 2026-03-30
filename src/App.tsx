/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageUploader } from './components/ImageUploader';
import { WeatherWidget } from './components/WetherWidget';

type Screen = 'login' | 'register' | 'dashboard' | 'areas' | 'logs' | 'profile' | 'addJournal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [selectedZone, setSelectedZone] = useState<any>(null);

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
        {['dashboard', 'areas', 'logs', 'profile'].includes(currentScreen) && (
          <MainLayout currentScreen={currentScreen} onNavigate={navigateTo}>
            {currentScreen === 'dashboard' && <DashboardScreen onAddJournal={() => navigateTo('addJournal')} />}
            {currentScreen === 'areas' && <AreasScreen onSelectZone={(zone) => navigateTo('logs', zone)} />}
            {currentScreen === 'logs' && <LogsScreen zone={selectedZone} onAddJournal={() => navigateTo('addJournal')} />}
            {currentScreen === 'profile' && <ProfileScreen onLogout={() => navigateTo('login')} />}
          </MainLayout>
        )}
        {currentScreen === 'addJournal' && (
          <AddJournalScreen onBack={() => navigateTo('logs', selectedZone)} zone={selectedZone} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== LOGIN SCREEN ====================
function LoginScreen({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
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
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-primary-fixed/20 rounded-full blur-3xl"></div>
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
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface-variant px-1">Email hoặc Số điện thoại</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors">person</span>
                </div>
                <input className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface font-medium transition-all" placeholder="username@email.com" type="text" />
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
                <input className="w-full pl-12 pr-12 py-4 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface font-medium transition-all" placeholder="••••••••" type="password" />
              </div>
            </div>
            <div className="flex items-center gap-3 px-1">
              <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary bg-surface-container" id="remember" type="checkbox" />
              <label className="text-sm font-medium text-on-surface-variant cursor-pointer select-none" htmlFor="remember">Duy trì đăng nhập</label>
            </div>
            <button className="w-full py-4 bg-primary text-on-primary font-headline font-bold text-lg rounded-xl shadow-lg hover:shadow-primary/20 active:scale-95 transition-all duration-200 mt-4 flex items-center justify-center gap-2" type="submit">
              Đăng nhập
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>
          <div className="mt-10 pt-10 border-t border-outline-variant/30 flex flex-col items-center gap-6">
            <p className="text-on-surface-variant font-medium">Đăng nhập bằng</p>
            <div className="grid grid-cols-2 gap-4 w-full">
              <button className="flex items-center justify-center gap-2 py-3 bg-secondary-container text-on-secondary-container rounded-xl font-bold text-sm hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined">google</span>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-secondary-container text-on-secondary-container rounded-xl font-bold text-sm hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined">facebook</span>
                Facebook
              </button>
            </div>
            <p className="text-on-surface-variant font-medium mt-4">
              Chưa có tài khoản? 
              <button onClick={onRegister} className="text-primary font-bold hover:underline ml-1">Đăng ký ngay</button>
            </p>
          </div>
          <footer className="mt-auto pt-12 flex justify-center gap-6 text-[10px] font-label font-bold uppercase tracking-[0.2em] text-on-surface-variant/50">
            <a className="hover:text-primary transition-colors" href="#">Điều khoản</a>
            <a className="hover:text-primary transition-colors" href="#">Bảo mật</a>
            <a className="hover:text-primary transition-colors" href="#">Hỗ trợ</a>
          </footer>
        </section>
      </main>
      <div className="fixed top-8 right-8 z-50">
        <div className="bio-membrane px-4 py-2 rounded-full border border-outline-variant/20 shadow-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <span className="text-[10px] font-label font-extrabold uppercase tracking-widest text-on-surface-variant">Đồng bộ đám mây đang hoạt động</span>
        </div>
      </div>
    </motion.div>
  );
}

// ==================== REGISTER SCREEN ====================
function RegisterScreen({ onBack, onRegister }: { onBack: () => void; onRegister: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col md:flex-row bg-organic-mesh"
    >
      <aside className="hidden md:flex md:w-5/12 lg:w-1/2 relative overflow-hidden bg-primary items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCh50zfM8h10GyCPPQNCGAMy2ljFFi85L_BBgMIjixvoOjc1DSZY2-84tVYfxm4-8K_l3ONSs6zXQiIoHreTqCLwBb3Uw_jN1k4qMm1yhfzI4IRFcNFIm1eyOviz8t3B3Km1yz5XC_c6cI93rQ1K7BPNTuS_7caiPHmgk4oN1NlazkTEnGewy6FndY9G1WefuxtnyigeubcBgWrsf4wy5RRPlov7-A5M5qrjggF-27gne5Zpz8UBuP681PAGZnKSb1HqDz5cxA9QXM" referrerPolicy="no-referrer" />
        </div>
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
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onRegister(); }}>
            <div className="space-y-1">
              <label className="font-label text-sm font-semibold text-on-surface-variant px-1">Họ và tên</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">person</span>
                <input className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all" placeholder="Nguyễn Văn A" type="text" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-label text-sm font-semibold text-on-surface-variant px-1">Số điện thoại</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">call</span>
                <input className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all" placeholder="09xx xxx xxx" type="tel" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-label text-sm font-semibold text-on-surface-variant px-1">Email <span className="text-xs font-normal opacity-60">(Tùy chọn)</span></label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">mail</span>
                <input className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all" placeholder="email@example.com" type="email" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-label text-sm font-semibold text-on-surface-variant px-1">Mật khẩu</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">lock</span>
                  <input className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all" placeholder="••••••••" type="password" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-label text-sm font-semibold text-on-surface-variant px-1">Xác nhận</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">lock_reset</span>
                  <input className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all" placeholder="••••••••" type="password" />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 py-2">
              <input className="w-5 h-5 rounded-md border-outline-variant text-primary focus:ring-primary bg-surface-container-lowest" id="terms" type="checkbox" />
              <label className="text-sm text-on-surface-variant leading-relaxed" htmlFor="terms">
                Tôi đồng ý với <a className="text-primary font-semibold" href="#">Điều khoản</a> và <a className="text-primary font-semibold" href="#">Chính sách bảo mật</a>.
              </label>
            </div>
            <button className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-lg rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2" type="submit">
              Đăng ký ngay
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-outline-variant/30"></div>
            <span className="text-outline text-xs uppercase tracking-widest font-bold">Hoặc tiếp tục với</span>
            <div className="flex-1 h-px bg-outline-variant/30"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-lowest border border-outline-variant/20 rounded-xl hover:bg-surface-container transition-colors">
              <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW1pvPIqU7UTDhsNfas41jfZZy91wAaPV4IMYlMYXbzV3OMWBeJE8fCNgCIDq3Th4ZLjyABDYLh37Dwg9cpnjRnU942F8kuG_PyzyPS_QwP8YLu0IjZsk2ShK3l9HhlDPi5Wv4rWCASUgjjWk92-XTTY5QNY06b5WHyFdGNyj8QsByHts7b5WaL9olClomc0btIJyoTlV1eGq9bUKIE2xL-dl_7aVuKZLnxTlXt_2UfmWlXSAyborwt6b0TiM-DWjt2igHga29Bew" />
              <span className="text-sm font-semibold">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-lowest border border-outline-variant/20 rounded-xl hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[#1877F2] fill-icon">social_leaderboard</span>
              <span className="text-sm font-semibold">Facebook</span>
            </button>
          </div>
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

      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 bg-surface-container/80 backdrop-blur-xl rounded-t-[2rem] z-50 shadow-[0_-4px_24px_rgba(24,29,26,0.06)]">
        {['dashboard', 'areas', 'logs', 'profile'].map((screen) => (
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
            </span>
            <span className="font-label text-[10px] font-semibold uppercase tracking-widest mt-1">
              {screen === 'dashboard' && 'Bảng điều khiển'}
              {screen === 'areas' && 'Khu vực'}
              {screen === 'logs' && 'Nhật ký'}
              {screen === 'profile' && 'Hồ sơ'}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// ==================== DASHBOARD SCREEN ====================
function DashboardScreen({ onAddJournal }: { onAddJournal: () => void }) {
  // DỮ LIỆU MẪU - BẠN CÓ THỂ XÓA VÀ THAY BẰNG API SAU
  const [areas] = useState([
    { id: 1, name: 'Vùng A', type: 'Lúa', size: '2.4 ha', progress: 85, status: 'Tối ưu', icon: 'grass' },
    { id: 2, name: 'Chuồng B', type: 'Gà', size: '450 con', status: 'Cần chú ý', icon: 'house', alert: 'Thức ăn thấp' },
    { id: 3, name: 'Vườn C', type: 'Cam', size: '1.2 ha', progress: 40, status: 'Đang tưới', icon: 'water_drop' },
  ]);

  const [activities] = useState([
    { title: 'Bón phân', zone: 'Vùng A', time: '2 giờ trước', icon: 'vaccines' },
    { title: 'Cho ăn', zone: 'Chuồng B', time: '4 giờ trước', icon: 'pets' },
    { title: 'Tưới nước', zone: 'Vườn C', time: '6 giờ trước', icon: 'water_drop' },
  ]);

  return (
    <div className="space-y-8">
      {/* Weather Card */}
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

      {/* Alert Card */}
      <section className="bg-tertiary-container/10 border-l-4 border-tertiary p-4 rounded-xl flex items-center gap-4">
        <div className="bg-tertiary text-on-tertiary p-2 rounded-lg">
          <span className="material-symbols-outlined">warning</span>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-sm text-on-surface">Cảnh báo kho hàng</h4>
          <p className="text-xs text-on-surface-variant font-medium">Thức ăn cho gà sắp hết (dự kiến còn 2 ngày)</p>
        </div>
        <button className="bg-tertiary text-on-tertiary px-4 py-1.5 rounded-full text-xs font-bold uppercase active:scale-95 transition-transform">
          Nhập hàng
        </button>
      </section>

      {/* Areas Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="font-headline font-extrabold text-xl">Khu vực quản lý</h3>
          <button className="text-primary font-bold text-sm flex items-center gap-1">Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {areas.map((area, idx) => (
            <AreaCard key={idx} {...area} />
          ))}
        </div>
      </section>

      {/* Recent Activities */}
      <section className="space-y-4">
        <h3 className="font-headline font-extrabold text-xl">Hoạt động gần đây</h3>
        <div className="bg-surface-container-low rounded-3xl overflow-hidden">
          {activities.map((activity, idx) => (
            <ActivityItem key={idx} {...activity} />
          ))}
        </div>
      </section>

      {/* FAB Button */}
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
function AreasScreen({ onSelectZone }: { onSelectZone: (zone: any) => void }) {
  const [areas] = useState([
    { id: 1, title: 'Vùng A', crop: 'Lúa', size: '2.5 ha', date: '15/03/2026', cycle: 65, status: 'Hoạt động', icon: 'agriculture' },
    { id: 2, title: 'Vùng B', crop: 'Ngô', size: '1.8 ha', date: '02/04/2026', cycle: 32, status: 'Cảnh báo', icon: 'grass' },
    { id: 3, title: 'Vùng C', crop: 'Lúa Mì', size: '3.2 ha', date: '10/01/2026', cycle: 98, status: 'Sẵn sàng', icon: 'eco' },
  ]);

  return (
    <div className="space-y-8">
      <header className="mb-10 relative">
        <div className="absolute -left-4 top-0 w-1 h-12 bg-primary rounded-full"></div>
        <h2 className="font-headline font-bold text-3xl tracking-tight text-on-surface ml-2">Khu vực canh tác</h2>
        <p className="font-body text-on-surface-variant mt-2 ml-2">Quản lý và theo dõi các phân đoạn cây trồng</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas.map((area) => (
          <AreaDetailCard key={area.id} {...area} onClick={() => onSelectZone(area)} />
        ))}
      </div>

      <button className="fixed bottom-28 right-6 md:bottom-10 md:right-10 bg-gradient-to-br from-primary to-primary-container text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 active:scale-95 transition-all group z-[60]">
        <span className="material-symbols-outlined">add</span>
        <span className="font-headline font-bold pr-2 hidden group-hover:inline-block">Thêm khu vực mới</span>
      </button>
    </div>
  );
}

// ==================== LOGS SCREEN ====================
function LogsScreen({ zone, onAddJournal }: { zone: any; onAddJournal: () => void }) {
  const [journalEntries] = useState([
    { date: 'Hôm nay', title: 'Thu hoạch', description: 'Hoàn thành thu hoạch diện tích 2ha.', icon: 'water_lux', iconBg: 'bg-primary', iconColor: 'text-white' },
    { date: '18/05', title: 'Bón phân', description: 'Bón 50kg phân NPK cho toàn bộ diện tích.', icon: 'compost', iconBg: 'bg-tertiary-container', iconColor: 'text-on-tertiary-container' },
    { date: '12/05', title: 'Tưới nước', description: 'Duy trì mực nước 5-7cm cho giai đoạn trổ bông.', icon: 'opacity', iconBg: 'bg-primary-container', iconColor: 'text-white' },
  ]);

  return (
    <div className="space-y-8">
      <section className="mb-10">
        <div className="flex items-center gap-2 text-on-surface-variant mb-2">
          <span className="material-symbols-outlined text-sm">potted_plant</span>
          <span className="font-label font-semibold uppercase tracking-widest text-[10px]">Khu vực / {zone?.title || 'Vùng A'}</span>
        </div>
        <h2 className="font-headline font-extrabold text-4xl text-on-surface tracking-tight">{zone?.title || 'Vùng A'} - {zone?.crop || 'Lúa'}</h2>
        <p className="text-on-surface-variant mt-2 font-medium">Nhật ký canh tác chi tiết</p>
      </section>

      <div className="relative space-y-12">
        <div className="timeline-line"></div>
        {journalEntries.map((entry, idx) => (
          <TimelineEntry key={idx} {...entry} />
        ))}
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

  const activityTypes = [
    { value: 'planting', label: 'Gieo trồng', icon: 'grass' },
    { value: 'watering', label: 'Tưới nước', icon: 'water_drop' },
    { value: 'fertilizing', label: 'Bón phân', icon: 'compost' },
    { value: 'spraying', label: 'Phun thuốc', icon: 'spray' },
    { value: 'harvesting', label: 'Thu hoạch', icon: 'agriculture' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ zone, activityType, title, description, images });
    alert(`✅ Đã thêm nhật ký thành công!\n\n📝 ${title}\n📸 ${images.length} ảnh đính kèm`);
    onBack();
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
        {/* Zone Info */}
        <div>
          <label className="block text-sm font-semibold text-on-surface-variant mb-2">Khu vực</label>
          <div className="bg-surface-container-low rounded-xl p-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">potted_plant</span>
              <span className="font-medium text-on-surface">{zone?.title || 'Vùng A'} - {zone?.crop || 'Lúa'}</span>
            </div>
          </div>
        </div>

        {/* Activity Type */}
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

        {/* Title */}
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

        {/* Description */}
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

        {/* Images Upload */}
        <div>
          <label className="block text-sm font-semibold text-on-surface-variant mb-2">Hình ảnh</label>
          <ImageUploader onImagesUploaded={setImages} existingImages={images} maxImages={5} />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button type="button" onClick={onBack} className="flex-1 py-4 bg-surface-container-high text-on-surface-variant font-bold rounded-xl active:scale-95 transition-all">
            Hủy
          </button>
          <button type="submit" className="flex-1 py-4 bg-primary text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg">
            Lưu nhật ký
          </button>
        </div>
      </form>
    </motion.div>
  );
}

// ==================== PROFILE SCREEN ====================
function ProfileScreen({ onLogout }: { onLogout: () => void }) {
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
          <h2 className="font-headline font-extrabold text-2xl text-on-surface">Người canh tác</h2>
          <p className="font-label text-sm uppercase tracking-widest text-on-surface-variant font-semibold mt-1">Chủ trang trại</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm">
          <span className="material-symbols-outlined text-primary mb-2">potted_plant</span>
          <p className="text-2xl font-headline font-bold text-on-surface">0</p>
          <p className="text-xs font-label text-on-surface-variant">Khu vực quản lý</p>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm">
          <span className="material-symbols-outlined text-tertiary mb-2">history</span>
          <p className="text-2xl font-headline font-bold text-on-surface">0</p>
          <p className="text-xs font-label text-on-surface-variant">Nhật ký hoạt động</p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-headline font-bold text-on-surface mb-4 px-2">Cài đặt</h3>
        <ProfileNavItem icon="person" label="Thông tin cá nhân" />
        <ProfileNavItem icon="agriculture" label="Quản lý trang trại" />
        <ProfileNavItem icon="notifications" label="Thông báo" />
        <ProfileNavItem icon="language" label="Ngôn ngữ" extra="Tiếng Việt" />
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

// ==================== HELPER COMPONENTS ====================
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

function AreaDetailCard({ title, crop, size, date, cycle, status, icon, onClick }: any) {
  return (
    <div onClick={onClick} className="cursor-pointer group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
      <div className="relative h-48 w-full bg-gradient-to-br from-primary/20 to-primary-container/20 flex items-center justify-center">
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
          <div className="bg-secondary-container p-2 rounded-lg">
            <span className="material-symbols-outlined text-on-secondary-container">{icon}</span>
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

function TimelineEntry({ date, title, description, icon, iconBg, iconColor, containerBg }: any) {
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
        </div>
        <h3 className="font-headline font-bold text-xl text-on-surface mb-2">{title}</h3>
        <p className="text-on-surface-variant leading-relaxed">{description}</p>
      </div>
    </article>
  );
}

function ProfileNavItem({ icon, label, extra }: any) {
  return (
    <button className="w-full flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container transition-colors rounded-xl">
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
