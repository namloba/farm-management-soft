/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type Screen = 'login' | 'register' | 'dashboard' | 'areas' | 'logs' | 'profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      <AnimatePresence mode="wait">
        {currentScreen === 'login' && (
          <LoginScreen key="login" onLogin={() => navigateTo('dashboard')} onRegister={() => navigateTo('register')} />
        )}
        {currentScreen === 'register' && (
          <RegisterScreen key="register" onBack={() => navigateTo('login')} onRegister={() => navigateTo('dashboard')} />
        )}
        {['dashboard', 'areas', 'logs', 'profile'].includes(currentScreen) && (
          <MainLayout key="main" currentScreen={currentScreen} onNavigate={navigateTo}>
            {currentScreen === 'dashboard' && <DashboardScreen />}
            {currentScreen === 'areas' && <AreasScreen />}
            {currentScreen === 'logs' && <LogsScreen />}
            {currentScreen === 'profile' && <ProfileScreen onLogout={() => navigateTo('login')} />}
          </MainLayout>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Components ---

function LoginScreen({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void; key?: string }) {
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
              <label className="block text-sm font-semibold text-on-surface-variant px-1" htmlFor="identity">Email hoặc Số điện thoại</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors">person</span>
                </div>
                <input className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface font-medium transition-all" id="identity" placeholder="username@email.com" type="text" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="block text-sm font-semibold text-on-surface-variant" htmlFor="password">Mật khẩu</label>
                <a className="text-xs font-bold text-primary hover:underline transition-all" href="#">Quên mật khẩu?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors">lock</span>
                </div>
                <input className="w-full pl-12 pr-12 py-4 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface font-medium transition-all" id="password" placeholder="••••••••" type="password" />
                <button className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant hover:text-primary transition-colors" type="button">
                  <span className="material-symbols-outlined">visibility</span>
                </button>
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
            <p className="text-on-surface-variant text-sm font-medium">Hoặc tiếp tục với</p>
            <div className="grid grid-cols-2 gap-4 w-full">
              <button className="flex items-center justify-center gap-2 py-3 bg-secondary-container text-on-secondary-container rounded-xl font-bold text-sm hover:bg-surface-container-highest transition-colors active:scale-95">
                <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCboVi4yZEFA0s7JuiTSKzJCWNFmiDeUe_n8o0G6lcSy5mOa0g3V0h-8qghm4cdXvz7spnlXXcMV4Lyxhx5CkCxbxciAvVJ7aElo_2x5CiIsoks2U30LGixqMNGyCEjiiY7FJPyS6gJXPRtgfA_3gpantYLDvP95pLAvqTRs_TiB_xEnczeulkxGEZgQcTPEOBAFUWhO4abUcPdSKJzHo_8l5vj0xffh6wFyMuuSmjPC4O46k7VqkFKVgFGokvJAmiIrgDWhz7OFSk" />
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-secondary-container text-on-secondary-container rounded-xl font-bold text-sm hover:bg-surface-container-highest transition-colors active:scale-95">
                <span className="material-symbols-outlined text-blue-600 fill-icon">social_leaderboard</span>
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

function RegisterScreen({ onBack, onRegister }: { onBack: () => void; onRegister: () => void; key?: string }) {
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
            Hệ thống quản lý nông trại thông minh AgroFlow. Kết nối dữ liệu, tối ưu hóa quy trình canh tác và nâng cao năng suất mỗi ngày.
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
            <p className="text-on-surface-variant text-lg">Bắt đầu hành trình số hóa nông trại của bạn ngay hôm nay.</p>
          </header>
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onRegister(); }}>
            <div className="space-y-1">
              <label className="font-label text-sm font-semibold text-on-surface-variant px-1" htmlFor="fullname">Họ và tên</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">person</span>
                <input className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all placeholder:text-outline" id="fullname" placeholder="Nguyễn Văn A" type="text" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-label text-sm font-semibold text-on-surface-variant px-1" htmlFor="phone">Số điện thoại</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">call</span>
                <input className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all placeholder:text-outline" id="phone" placeholder="09xx xxx xxx" type="tel" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-label text-sm font-semibold text-on-surface-variant px-1" htmlFor="email">Email <span className="text-xs font-normal opacity-60">(Tùy chọn)</span></label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">mail</span>
                <input className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all placeholder:text-outline" id="email" placeholder="email@vi-du.com" type="email" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-label text-sm font-semibold text-on-surface-variant px-1" htmlFor="password">Mật khẩu</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">lock</span>
                  <input className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all placeholder:text-outline" id="password" placeholder="••••••••" type="password" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-label text-sm font-semibold text-on-surface-variant px-1" htmlFor="confirm-password">Xác nhận</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">lock_reset</span>
                  <input className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all placeholder:text-outline" id="confirm-password" placeholder="••••••••" type="password" />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 py-2">
              <div className="mt-1">
                <input className="w-5 h-5 rounded-md border-outline-variant text-primary focus:ring-primary bg-surface-container-lowest" id="terms" type="checkbox" />
              </div>
              <label className="text-sm text-on-surface-variant leading-relaxed" htmlFor="terms">
                Tôi đồng ý với các <a className="text-primary font-semibold hover:underline" href="#">Điều khoản sử dụng</a> và <a className="text-primary font-semibold hover:underline" href="#">Chính sách bảo mật</a> của AgroFlow Modern.
              </label>
            </div>
            <button className="w-full py-4 px-6 bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-lg rounded-2xl shadow-[0_8px_20px_-4px_rgba(0,110,28,0.3)] hover:shadow-[0_12px_24px_-4px_rgba(0,110,28,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group" type="submit">
              Đăng ký ngay
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
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
              <button onClick={onBack} className="text-primary font-bold ml-1 hover:underline decoration-2 underline-offset-4">Đăng nhập</button>
            </p>
          </footer>
        </div>
      </main>
    </motion.div>
  );
}

function MainLayout({ children, currentScreen, onNavigate }: { children: React.ReactNode; currentScreen: Screen; onNavigate: (screen: Screen) => void; key?: string }) {
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
          <button className="text-primary p-2 hover:bg-surface-container transition-colors rounded-full active:scale-95 duration-200">
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

      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 bg-surface-container/80 backdrop-blur-xl rounded-t-[2rem] z-50 pb-safe shadow-[0_-4px_24px_rgba(24,29,26,0.06)]">
        <button 
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center justify-center px-6 py-2 transition-all duration-300 ease-out ${currentScreen === 'dashboard' ? 'bg-primary-container text-white rounded-2xl scale-105 shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
        >
          <span className={`material-symbols-outlined ${currentScreen === 'dashboard' ? 'fill-icon' : ''}`}>dashboard</span>
          <span className="font-label text-[10px] font-semibold uppercase tracking-widest mt-1">Bảng điều khiển</span>
        </button>
        <button 
          onClick={() => onNavigate('areas')}
          className={`flex flex-col items-center justify-center px-6 py-2 transition-all duration-300 ease-out ${currentScreen === 'areas' ? 'bg-primary-container text-white rounded-2xl scale-105 shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
        >
          <span className={`material-symbols-outlined ${currentScreen === 'areas' ? 'fill-icon' : ''}`}>potted_plant</span>
          <span className="font-label text-[10px] font-semibold uppercase tracking-widest mt-1">Khu vực</span>
        </button>
        <button 
          onClick={() => onNavigate('logs')}
          className={`flex flex-col items-center justify-center px-6 py-2 transition-all duration-300 ease-out ${currentScreen === 'logs' ? 'bg-primary-container text-white rounded-2xl scale-105 shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
        >
          <span className={`material-symbols-outlined ${currentScreen === 'logs' ? 'fill-icon' : ''}`}>history</span>
          <span className="font-label text-[10px] font-semibold uppercase tracking-widest mt-1">Nhật ký</span>
        </button>
        <button 
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center px-6 py-2 transition-all duration-300 ease-out ${currentScreen === 'profile' ? 'bg-primary-container text-white rounded-2xl scale-105 shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
        >
          <span className={`material-symbols-outlined ${currentScreen === 'profile' ? 'fill-icon' : ''}`}>account_circle</span>
          <span className="font-label text-[10px] font-semibold uppercase tracking-widest mt-1">Hồ sơ</span>
        </button>
      </nav>
    </div>
  );
}

function DashboardScreen() {
  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        <div className="md:col-span-8 space-y-2">
          <p className="font-headline font-bold text-on-surface-variant tracking-tight">Chào mừng trở lại, Người canh tác</p>
          <h2 className="font-headline font-extrabold text-4xl text-on-surface tracking-tighter leading-none">Nông trại của bạn đang <span className="text-primary">phát triển tốt</span>.</h2>
        </div>
        <div className="md:col-span-4 bg-primary-container rounded-3xl p-6 text-on-primary-container shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-headline font-extrabold">28°</span>
              <span className="font-medium opacity-80 text-sm">C</span>
            </div>
            <p className="font-semibold text-sm">Có mây rải rác</p>
            <div className="flex gap-3 mt-2 text-[10px] font-bold uppercase tracking-wider opacity-90">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">water_drop</span> 64%</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">air</span> 12km/h</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-7xl opacity-20 absolute -right-2 top-2 fill-icon">sunny</span>
        </div>
      </section>

      <section className="bg-tertiary-container/10 border-l-4 border-tertiary p-4 rounded-xl flex items-center gap-4">
        <div className="bg-tertiary text-on-tertiary p-2 rounded-lg">
          <span className="material-symbols-outlined">warning</span>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-sm text-on-surface">Cảnh báo kho hàng</h4>
          <p className="text-xs text-on-surface-variant font-medium">Thức ăn cho gà sắp hết (Dự kiến còn 2 ngày)</p>
        </div>
        <button className="bg-tertiary text-on-tertiary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest active:scale-95 transition-transform">Nhập hàng</button>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="font-headline font-extrabold text-xl tracking-tight">Khu vực quản lý</h3>
          <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AreaCard title="Vùng A - Lúa" subtitle="Cánh đồng lúa • 2.4 ha" progress={85} progressLabel="Giai đoạn: 85%" status="Tối ưu" icon="grass" />
          <AreaCard title="Chuồng B - Gà" subtitle="Nhà nuôi gia cầm • 450 con" status="Cần chú ý" icon="house" alert="Thức ăn thấp" temp="31°C" />
          <AreaCard title="Vườn C - Cam" subtitle="Vườn cam • 1.2 ha" progress={40} progressLabel="Độ ẩm: 40%" status="Đang tưới" icon="water_drop" />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-headline font-extrabold text-xl tracking-tight">Hoạt động gần đây</h3>
        <div className="bg-surface-container-low rounded-3xl overflow-hidden">
          <ActivityItem title="Bón phân cho lúa" subtitle="Vùng A - Lúa • Hệ thống tự động" time="2 giờ trước" icon="vaccines" />
          <ActivityItem title="Hoàn tất hiệu chuẩn cảm biến" subtitle="Chuồng B - Gà • Bảo trì" time="5 giờ trước" icon="sensors" />
        </div>
      </section>

      <button className="fixed bottom-24 right-6 bg-primary text-white w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center active:scale-95 transition-transform z-40 bg-gradient-to-br from-primary to-primary-container">
        <span className="material-symbols-outlined font-bold">add</span>
      </button>
    </div>
  );
}

function AreaCard({ title, subtitle, progress, progressLabel, status, icon, alert, temp }: any) {
  return (
    <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] group hover:translate-y-[-4px] transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-primary/10 text-primary p-3 rounded-xl">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${status === 'Cần chú ý' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-primary-fixed text-on-primary-fixed'}`}>{status}</span>
      </div>
      <h4 className="font-headline font-bold text-on-surface">{title}</h4>
      <p className="text-on-surface-variant text-sm mb-4">{subtitle}</p>
      {progress !== undefined && (
        <>
          <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-[10px] font-bold text-on-surface-variant mt-2 uppercase tracking-widest">{progressLabel}</p>
        </>
      )}
      {(alert || temp) && (
        <div className="flex items-center gap-4 text-xs font-semibold">
          {temp && <div className="flex items-center gap-1 text-on-surface-variant"><span className="material-symbols-outlined text-sm">thermometer</span> {temp}</div>}
          {alert && <div className="flex items-center gap-1 text-tertiary font-bold"><span className="material-symbols-outlined text-sm">warning</span> {alert}</div>}
        </div>
      )}
    </div>
  );
}

function ActivityItem({ title, subtitle, time, icon }: any) {
  return (
    <div className="p-4 flex items-center gap-4 hover:bg-surface-container-high transition-colors">
      <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-xs text-on-surface-variant">{subtitle}</p>
      </div>
      <span className="text-xs font-medium text-on-surface-variant">{time}</span>
    </div>
  );
}

function AreasScreen() {
  return (
    <div className="space-y-8">
      <header className="mb-10 relative">
        <div className="absolute -left-4 top-0 w-1 h-12 bg-primary rounded-full"></div>
        <h2 className="font-headline font-bold text-3xl tracking-tight text-on-surface ml-2">Khu vực canh tác</h2>
        <p className="font-body text-on-surface-variant mt-2 ml-2">Quản lý và theo dõi các phân đoạn cây trồng đang hoạt động</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AreaDetailCard 
          title="Vùng A - Lúa" 
          size="2.5 ha" 
          date="15/03/2026" 
          cycle={65} 
          status="Hoạt động" 
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuC_FUMINkeRw_HVQBKt3WZNPQBrdoyKGqCsEszNFyWrS4FbYkRSjZyAwNE44TS9v7AqwdAD7fAopl8IVS6Hy_ocMyTRohOUwwbgryqzxCvvkd4eZCZWRJbFXLf8H4vkNx4hpyN8VkfLdIdeJm4lm0LAZF1G4ft4Lymr05oKA6DMloBEhgctsIHDxWgHkJjBZaXTmGy5BK4u7VQTbOD72Qjx_lPdZ2RtvFvkJS3m0-soWVtsa2bSTPD7tUZaBN_T2Yeg-1pgtTfJGz0" 
          icon="agriculture"
        />
        <AreaDetailCard 
          title="Vùng B - Ngô" 
          size="1.8 ha" 
          date="02/04/2026" 
          cycle={32} 
          status="Cảnh báo" 
          statusColor="bg-tertiary-fixed text-on-tertiary-fixed-variant"
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuB4ifjJSg1Gcv-_vETsSgzsm-gy9mzB8vPm817sH1ZEU49mapKoYJNUlhdyRUepIE06jgsZbucT3NmfKXp4F2sYng94MCb2YvS2eizQP1v0yudkSykRr8g3Ne6bbgj67Lgz4-8YzfdCmer8mYFgRu2CYmiSV5I3RlYxILWjLP6FXaYw4IuX-H5ze8OUIovcNjZ1V2SUjM0ExayOfJ6P6Wk_gOOtpW0HxX19BW2smn5dAt1WwlPS1spVSlk8oCTfA6rQ20BYkgHi3hg" 
          icon="grass"
        />
        <AreaDetailCard 
          title="Vùng C - Lúa Mì" 
          size="3.2 ha" 
          date="10/01/2026" 
          cycle={98} 
          status="Sẵn sàng thu hoạch" 
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuBpOi1QJKAWWMBPPpLRNqCui-U7y6wkbnsfFUyQkJ0a70pruQQZa4y62YgIS5JHPZkGF1YJBZLNo7Yj3R2aB1hpYpfwrIz4yUapsxHLDkNk9qwKh_Jc5-JnS6TvNJdRs23oyReyTWio-iwyoWNbWiWhIARmNMDnilciokO3EJpJGrDjejslh_K2PXUg3dvsKJVpTOQxnA6AKeZKBwbC3fYNUL61md2-du7JosCHAtQrUgn0_hSI0rawwqI6mV_8DpIzYN7klwgBbqg" 
          icon="eco"
        />

        <div className="lg:col-span-2 bg-primary-container/10 border-outline-variant/10 border rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <h4 className="font-headline font-bold text-2xl text-on-primary-container mb-2">Tóm tắt canh tác</h4>
            <p className="font-body text-on-surface-variant mb-6 leading-relaxed">Nông trại của bạn đang đạt hiệu suất 84% trong mùa vụ này. Sức khỏe đất ở tất cả các khu vực vẫn ở mức tối ưu.</p>
            <div className="flex gap-4">
              <div className="bg-surface-container-lowest px-4 py-3 rounded-xl shadow-sm">
                <div className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">Tổng diện tích</div>
                <div className="text-xl font-headline font-extrabold text-primary">7.5 ha</div>
              </div>
              <div className="bg-surface-container-lowest px-4 py-3 rounded-xl shadow-sm">
                <div className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">Cây trồng hoạt động</div>
                <div className="text-xl font-headline font-extrabold text-primary">12</div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-48 aspect-square relative flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="stroke-primary-fixed fill-none stroke-[12]" cx="50%" cy="50%" r="40%"></circle>
              <circle className="stroke-primary fill-none stroke-[12]" cx="50%" cy="50%" r="40%" strokeDasharray="251.2" strokeDashoffset="40"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline font-extrabold text-3xl text-on-primary-container">84%</span>
              <span className="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant">Điểm số</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-high rounded-2xl p-8 flex flex-col justify-center items-center text-center">
          <div className="bg-primary text-on-primary w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined">analytics</span>
          </div>
          <h4 className="font-headline font-bold text-lg text-on-surface mb-2">Dự báo thời tiết</h4>
          <p className="text-sm text-on-surface-variant mb-4">Điều kiện tối ưu cho việc tưới tiêu được dự báo trong 48 giờ tới.</p>
          <button className="bg-secondary-container text-on-secondary-container font-label text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full hover:bg-surface-container-highest transition-colors">Xem dự báo</button>
        </div>
      </div>

      <button className="fixed bottom-28 right-6 md:bottom-10 md:right-10 bg-gradient-to-br from-[#006e1c] to-[#4caf50] text-[#ffffff] p-4 rounded-2xl shadow-xl flex items-center gap-3 active:scale-95 transition-all duration-200 group z-[60]">
        <span className="material-symbols-outlined fill-icon">add</span>
        <span className="font-headline font-bold pr-2 hidden group-hover:inline-block transition-all duration-300">Thêm khu vực mới</span>
      </button>
    </div>
  );
}

function AreaDetailCard({ title, size, date, cycle, status, statusColor, image, icon }: any) {
  return (
    <div className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_-4px_24px_rgba(24,29,26,0.06)] transition-all duration-300 hover:shadow-lg flex flex-col">
      <div className="relative h-48 w-full overflow-hidden">
        <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={image} referrerPolicy="no-referrer" />
        <div className={`absolute top-4 right-4 backdrop-blur-md px-3 py-1 rounded-full ${statusColor || 'bg-surface-container-highest/80'}`}>
          <span className="text-[10px] font-bold uppercase tracking-widest font-label">{status}</span>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-headline font-bold text-xl text-on-surface">{title}</h3>
            <div className="flex items-center gap-2 text-on-surface-variant mt-1">
              <span className="material-symbols-outlined text-sm">filter_hdr</span>
              <span className="text-sm font-semibold">{size}</span>
            </div>
          </div>
          <div className="bg-secondary-container p-2 rounded-lg">
            <span className="material-symbols-outlined text-on-secondary-container">{icon}</span>
          </div>
        </div>
        <div className="space-y-4 mt-auto">
          <div className="flex justify-between text-xs font-label text-on-surface-variant uppercase tracking-wider">
            <span>Ngày trồng</span>
            <span className="font-bold text-on-surface">{date}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold text-primary">Chu kỳ vụ mùa</span>
              <span className="text-xs font-bold text-on-surface">{cycle}%</span>
            </div>
            <div className="h-3 w-full bg-primary-fixed rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${cycle}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogsScreen() {
  return (
    <div className="space-y-8">
      <section className="mb-10">
        <div className="flex items-center gap-2 text-on-surface-variant mb-2">
          <span className="material-symbols-outlined text-sm">potted_plant</span>
          <span className="font-label font-semibold uppercase tracking-widest text-[10px]">Khu vực / Vùng A</span>
        </div>
        <h2 className="font-headline font-extrabold text-4xl text-on-surface tracking-tight leading-tight">Vùng A - Lúa</h2>
        <p className="text-on-surface-variant mt-2 font-medium">Nhật ký canh tác chi tiết</p>
      </section>

      <div className="relative space-y-12">
        <div className="timeline-line"></div>
        <TimelineEntry 
          date="Hôm nay, 24 Tháng 5" 
          status="Hoàn tất" 
          title="Thu hoạch vụ Hè Thu" 
          description="Tiến hành thu hoạch diện tích 2ha. Độ ẩm hạt đạt tiêu chuẩn 14%. Sản lượng ước tính đạt 7 tấn/ha." 
          images={[
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAWBmxFuSkQn83vSPK0ZpWsTN4AkYcJ2URubUzfmieXQbj-pjhaFqVkq18dXd4huQ_2zXaLBmlWDdPXMFJmv-GslMjkQ1_tK7_6r28cm23no23dSx0NLmACFALtGZfVHWLejqlScgNP2pjTCYZMNkmup9cDhWsBxVBtJwCZ3RnVSSBkIQU0soGETJwm7kHn1dqiaxZT-XUsYSDF9BUqEvKs5aR4YmQVusahWLww1ffN3BThayzbv7nDICGay7ItnzOKKvmkYpsk31s",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCKgH3GXQyH_1GzMF8hqR8WKrhpZ7XqAfs8b8vcz7ZoiNHPFO4MRVar-nfL5FJX1Q62p3GAC3-ksysAPRrz78PLTJ-BiyCecpqjw1JVIkAcAWoWIFTCDclISO3X3yhPTZUlEPRKey2lfVSNLVw3KwVKkFiSJWDlIKKCCBrr-JI5lgI3omEVqgiW9MB8U73OsMdO5_7CWkQNJeZr9J1Z16y_FFQeymrkbVEShkPUWwqRLSfDRPa6v8yoxeHtcjYRiFuP_FBqXFLiZH4"
          ]}
          icon="water_lux"
          iconBg="bg-primary"
          iconColor="text-on-primary"
        />
        <TimelineEntry 
          date="18 Tháng 5" 
          title="Bón phân đợt 3" 
          description="Bón 50kg phân NPK (20-20-15) cho toàn bộ diện tích. Bổ sung thêm vi lượng hỗ trợ chắc hạt." 
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuC4f0gx5SqbleEz_FVz2Bwpv8X0itw8B5rhqkyJE9yhfUvQEh4o6GC_5FHfjG6bO50DbPOP_kc1oMETTjWtjBWVU4Z54wswv2aLt617S8A74Zt4skFPXy9Ozg-jrecX-T1tfEIlsL5BhFZH-PAoznkbY5SU8LhHqaj9QcC7iwK-h1ZQE9xrOOUleo5bx1VxX6tp05_eIpsj-3zBjXBP25fcu8mCT0-nL1WtcYJoojXKmB4p_rft4cpxhWHZODAZQE1YBW6Z_FemBlM"
          icon="compost"
          iconBg="bg-tertiary-container"
          iconColor="text-on-tertiary-container"
          containerBg="bg-surface-container"
        />
        <TimelineEntry 
          date="12 Tháng 5" 
          title="Bơm nước vào ruộng" 
          description="Duy trì mực nước 5-7cm để cây lúa vào giai đoạn trổ bông. Kiểm tra hệ thống mương dẫn." 
          icon="opacity"
          iconBg="bg-primary-container"
          iconColor="text-white"
          containerBg="bg-surface-container"
        />
        <TimelineEntry 
          date="05 Tháng 5" 
          title="Kiểm tra định kỳ" 
          description="Không phát hiện sâu bệnh hại. Cây sinh trưởng tốt, đồng đều." 
          icon="visibility"
          iconBg="bg-surface-container-highest"
          iconColor="text-on-surface-variant"
          containerBg="bg-surface-container-low"
          isItalic
        />
      </div>

      <div className="mt-12 flex justify-center">
        <button className="bg-secondary-container text-on-secondary-container px-8 py-3 rounded-full font-bold hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
          Xem thêm lịch sử
        </button>
      </div>

      <button className="fixed bottom-24 right-6 w-16 h-16 bg-primary text-on-primary rounded-2xl shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-50 bg-gradient-to-br from-[#006e1c] to-[#4caf50]">
        <span className="material-symbols-outlined text-3xl font-bold">add</span>
      </button>
    </div>
  );
}

function TimelineEntry({ date, status, title, description, images, image, icon, iconBg, iconColor, containerBg, isItalic }: any) {
  return (
    <article className="relative pl-16 group">
      <div className="absolute left-0 top-0 z-10 flex flex-col items-center">
        <div className={`w-12 h-12 ${iconBg} flex items-center justify-center rounded-2xl shadow-sm ${iconColor}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
      <div className={`${containerBg || 'bg-surface-container-lowest'} p-6 rounded-xl shadow-[0_4px_24px_rgba(24,29,26,0.06)] flex flex-col md:flex-row gap-6 transition-transform group-hover:scale-[1.01] ${isItalic ? 'italic' : ''}`}>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <span className={`${status ? 'text-primary' : 'text-on-surface-variant'} font-bold font-headline text-lg`}>{date}</span>
            {status && <span className="bg-primary-fixed-dim text-on-primary-fixed-variant px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{status}</span>}
          </div>
          <h3 className="font-headline font-bold text-xl text-on-surface mb-2">{title}</h3>
          <p className="text-on-surface-variant leading-relaxed mb-4">{description}</p>
          {images && (
            <div className="flex gap-4">
              {images.map((img: string, i: number) => (
                <img key={i} alt="Harvest" className="w-24 h-24 object-cover rounded-lg bg-surface-container" src={img} referrerPolicy="no-referrer" />
              ))}
            </div>
          )}
        </div>
        {image && (
          <div className="shrink-0">
            <img alt="Activity" className="w-full md:w-32 h-32 object-cover rounded-lg bg-surface-container-high" src={image} referrerPolicy="no-referrer" />
          </div>
        )}
      </div>
    </article>
  );
}

function ProfileScreen({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="max-w-md mx-auto py-8">
      <section className="relative mb-12">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-primary-fixed/20 rounded-full blur-2xl"></div>
            <div className="relative w-32 h-32 rounded-full border-4 border-surface-container-lowest overflow-hidden shadow-2xl">
              <img alt="Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeErnp4eLGYfRM1NYxKKFp5dZqLFPu40CpOVCX4jk2P0Y_kk4jyMFWK3pPj4fldWkZydZbCUnt0NFI07DZSY9JqTIJx6zq7_P1XPpwJqQt0tWHRTl-7dmKMrc_e7B6okBRBIcXPqeBMa76rAOqMZPgRYp80Fq9cjvHWFBL9bU7EwiB4iEmSyyoVA-Ullb_T4JVxtYZlyJPVR0RPnaWIW7KOS3R_uLeGRr1U8tgJRK5-jAyorPgwxHFUJAGDJvX8j_M1LSrghkbGVw" referrerPolicy="no-referrer" />
            </div>
            <button className="absolute bottom-1 right-1 bg-primary text-on-primary p-2 rounded-full shadow-lg hover:scale-105 active:scale-90 transition-transform">
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>
          <div className="mt-6 text-center">
            <h2 className="font-headline font-extrabold text-2xl tracking-tight text-on-surface">Nguyễn Văn An</h2>
            <p className="font-label text-sm uppercase tracking-widest text-on-surface-variant font-semibold mt-1">Chủ trang trại</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/10">
          <span className="material-symbols-outlined text-primary mb-2">potted_plant</span>
          <p className="text-2xl font-headline font-bold text-on-surface">12</p>
          <p className="text-xs font-label text-on-surface-variant">Khu vực quản lý</p>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/10">
          <span className="material-symbols-outlined text-tertiary mb-2">history</span>
          <p className="text-2xl font-headline font-bold text-on-surface">158</p>
          <p className="text-xs font-label text-on-surface-variant">Nhật ký hoạt động</p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-headline font-bold text-on-surface mb-4 px-2">Cài đặt hệ thống</h3>
        <nav className="space-y-1">
          <ProfileNavItem icon="person" label="Thông tin cá nhân" />
          <ProfileNavItem icon="agriculture" label="Quản lý trang trại" />
          <ProfileNavItem icon="notifications" label="Cài đặt thông báo" />
          <ProfileNavItem icon="language" label="Ngôn ngữ" extra="Tiếng Việt" />
        </nav>
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

function ProfileNavItem({ icon, label, extra }: any) {
  return (
    <button className="w-full flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container transition-colors rounded-xl group">
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
