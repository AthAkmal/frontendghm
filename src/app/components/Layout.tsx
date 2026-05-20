import { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, BarChart3, Settings, Sprout,
  Bell, Moon, Sun, Menu, X, MessageSquare,
  BookOpen
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

/** * AREA IMPORT LOGO PARTNER
 * Jalur ../../img/ berarti keluar dari components -> keluar dari app -> masuk ke img
 */
// @ts-ignore
import logoAsia from '../../img/logo-asia.png';
// @ts-ignore
import logoSk from '../../img/logo-sk.png';
// @ts-ignore
import logoHima23 from '../../img/logo-himaa23.png';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/reports',   icon: BarChart3,       label: 'Laporan'    },
  { to: '/comments',  icon: MessageSquare,   label: 'Komentar'   },
  { to: '/tutorial',  icon: BookOpen,        label: 'Tutorial'   },
  { to: '/settings',  icon: Settings,        label: 'Pengaturan' },
];

function useRealTimeClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode, toggleDarkMode, unreadCount } = useApp();
  const time = useRealTimeClock();

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formatDate = (d: Date) =>
    d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const partnerLogos = [
    { id: 1, src: logoAsia,   alt: 'Logo Asia' },
    { id: 2, src: logoSk,     alt: 'Logo SK'   },
    { id: 3, src: logoHima23, alt: 'Logo Hima 23' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
      <aside
        className={`fixed lg:relative z-40 h-full flex flex-col transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} w-64 flex-shrink-0`}
        style={{
          background: darkMode
            ? `linear-gradient(180deg, var(--tp-dd) 0%, var(--tp-d) 50%, var(--tp-dd) 100%)`
            : `linear-gradient(180deg, var(--tp-d) 0%, var(--tp) 50%, var(--tp-d) 100%)`,
        }}>

        {/* Logo GHM Branding */}
        <div className="flex items-center gap-3 px-6 py-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)' }}>
            <Sprout size={22} color="rgba(255,255,255,0.9)" />
          </div>
          <div>
            <p className="text-white font-extrabold text-lg leading-none">GHM</p>
            <p className="text-white/60 text-[10px]">Green House Melon</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-white/60">
            <X size={18} />
          </button>
        </div>

        {/* Menu Navigasi */}
        <nav className="px-4 pt-5 space-y-1 flex-1">
          <p className="px-3 mb-3 text-[10px] font-semibold text-white/40 uppercase tracking-widest">Menu Utama</p>
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to} to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all 
                ${isActive ? 'text-white bg-white/10 shadow-lg font-semibold' : 'text-white/60 hover:bg-white/5'}`
              }
            >
              <Icon size={18} />
              <span className="text-sm">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* ── AREA LOGO KOLABORASI ── */}
        <div className="mt-auto p-6 pt-0">
          <div className="pt-6 border-t border-white/10">
            <p className="mb-4 ml-1 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              Collaborations
            </p>
            
            {/* Menggunakan grid 3 kolom simetris */}
            <div className="grid grid-cols-3 gap-3 items-center justify-items-center px-1">
              {partnerLogos.map((logo) => (
                <motion.div 
                  key={logo.id} 
                  whileHover={{ y: -3, opacity: 1, scale: 1.08 }}
                  className="w-full flex items-center justify-center h-12"
                >
                  <img 
                    src={logo.src} 
                    alt={logo.alt} 
                    className="h-8 w-auto max-w-full object-contain opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" 
                  />
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-20 px-4 lg:px-6 py-3 flex items-center gap-4 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-black/5 dark:border-white/5">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500">
            <Menu size={22} />
          </button>
          
          <div className="hidden sm:flex flex-col">
            <span className="text-xs text-gray-400 leading-tight">{formatDate(time)}</span>
            <span className="font-bold text-lg text-emerald-600 dark:text-emerald-500 leading-none">
              {formatTime(time)}
            </span>
          </div>

          <div className="flex-1" />

          {/* Dark Mode Toggle */}
          <button onClick={toggleDarkMode} className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-white/10 transition-transform hover:scale-105">
            {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-500" />}
          </button>

          {/* Notifikasi Button */}
          <div className="relative">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-white/10 transition-transform hover:scale-105">
              <Bell size={18} className={unreadCount > 0 ? 'text-emerald-500' : 'text-gray-400'} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50 dark:bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}