import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export interface SensorData {
  suhu: number; kelembapan: number; nutrisi: number;
  ph: number; airLevel: number; timestamp: Date;
}
export type AlertType = 'info' | 'warning' | 'critical';
export interface Alert {
  id: string; type: AlertType; message: string;
  sensor: string; value: number; timestamp: Date; read: boolean;
}
export interface PlantData {
  hst: number; hss: number; namaVarietas: string;
  tanggalTanam: string; jumlahTanaman: number; lokasi: string;
}
export interface HistoricalDataPoint {
  hari: number; tanggal: string; suhu: number;
  kelembapan: number; nutrisi: number; air: number; ph: number;
}
export interface GalleryImage {
  id: string; url: string; caption: string; date: string; type: string;
}
export interface User { name: string; email: string; role: string; }

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name: string) => void;
  logout: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
  sensorData: SensorData;
  previousSensorData: SensorData | null;
  alerts: Alert[];
  unreadCount: number;
  markAlertRead: (id: string) => void;
  markAllRead: () => void;
  clearAlerts: () => void;
  plantData: PlantData;
  updatePlantData: (data: Partial<PlantData>) => void;
  historicalData: HistoricalDataPoint[];
  galleryImages: GalleryImage[];
  addGalleryImage: (url: string, caption: string) => void;
  removeGalleryImage: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// ── Derive color variants dari hex ────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function applyTheme(color: string) {
  const [r, g, b] = hexToRgb(color);
  const toH = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
  const dark   = `#${toH(r*.68|0)}${toH(g*.68|0)}${toH(b*.68|0)}`;
  const xdark  = `#${toH(r*.25|0)}${toH(g*.25|0)}${toH(b*.25|0)}`;
  const mid    = `#${toH(r*.85|0)}${toH(g*.85|0)}${toH(b*.85|0)}`;
  const light  = `#${toH((r+(255-r)*.88)|0)}${toH((g+(255-g)*.88)|0)}${toH((b+(255-b)*.88)|0)}`;
  const xlight = `#${toH((r+(255-r)*.93)|0)}${toH((g+(255-g)*.93)|0)}${toH((b+(255-b)*.93)|0)}`;
  const root   = document.documentElement;
  root.style.setProperty('--tp',     color);
  root.style.setProperty('--tp-d',   dark);
  root.style.setProperty('--tp-dd',  xdark);
  root.style.setProperty('--tp-m',   mid);
  root.style.setProperty('--tp-l',   light);
  root.style.setProperty('--tp-xl',  xlight);
  root.style.setProperty('--tp-rgb', `${r},${g},${b}`);
}

// ── Sensor thresholds & helpers ───────────────────────────────────────────────
const THRESHOLDS = {
  suhu:      { min: 23, max: 33, critMin: 20, critMax: 36 },
  kelembapan:{ min: 65, max: 88, critMin: 55, critMax: 95 },
  nutrisi:   { min: 1200, max: 1900, critMin: 1000, critMax: 2200 },
  ph:        { min: 5.8, max: 6.8, critMin: 5.4, critMax: 7.2 },
  airLevel:  { min: 60, max: 95, critMin: 40, critMax: 100 },
};

function generateHistoricalData(): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today); date.setDate(date.getDate() - i);
    const dayNum = 30 - i;
    data.push({
      hari: dayNum,
      tanggal: date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
      suhu: parseFloat((29 + Math.sin(dayNum / 7) * 2 + (Math.random() - 0.5) * 3).toFixed(1)),
      kelembapan: parseFloat((75 - Math.sin(dayNum / 5) * 8 + (Math.random() - 0.5) * 8).toFixed(1)),
      nutrisi: parseFloat((1600 + (Math.random() - 0.5) * 400).toFixed(0)),
      air: parseFloat((82 + (Math.random() - 0.5) * 15).toFixed(1)),
      ph: parseFloat((6.2 + (Math.random() - 0.5) * 0.6).toFixed(2)),
    });
  }
  return data;
}

function generateId() { return Math.random().toString(36).substr(2, 9); }

function checkThresholds(data: SensorData): Omit<Alert, 'id' | 'timestamp' | 'read'>[] {
  const result: Omit<Alert, 'id' | 'timestamp' | 'read'>[] = [];
  if (data.suhu > THRESHOLDS.suhu.critMax)
    result.push({ type: 'critical', message: `Suhu sangat tinggi! ${data.suhu.toFixed(1)}°C`, sensor: 'Suhu', value: data.suhu });
  else if (data.suhu > THRESHOLDS.suhu.max)
    result.push({ type: 'warning', message: `Suhu di atas normal: ${data.suhu.toFixed(1)}°C`, sensor: 'Suhu', value: data.suhu });
  else if (data.suhu < THRESHOLDS.suhu.critMin)
    result.push({ type: 'critical', message: `Suhu sangat rendah! ${data.suhu.toFixed(1)}°C`, sensor: 'Suhu', value: data.suhu });
  else if (data.suhu < THRESHOLDS.suhu.min)
    result.push({ type: 'warning', message: `Suhu di bawah normal: ${data.suhu.toFixed(1)}°C`, sensor: 'Suhu', value: data.suhu });
  if (data.kelembapan < THRESHOLDS.kelembapan.critMin)
    result.push({ type: 'critical', message: `Kelembapan sangat rendah! ${data.kelembapan.toFixed(1)}%`, sensor: 'Kelembapan', value: data.kelembapan });
  else if (data.kelembapan < THRESHOLDS.kelembapan.min)
    result.push({ type: 'warning', message: `Kelembapan di bawah optimal: ${data.kelembapan.toFixed(1)}%`, sensor: 'Kelembapan', value: data.kelembapan });
  if (data.nutrisi < THRESHOLDS.nutrisi.critMin)
    result.push({ type: 'critical', message: `Nutrisi sangat rendah! ${data.nutrisi.toFixed(0)} ppm`, sensor: 'Nutrisi', value: data.nutrisi });
  if (data.ph < THRESHOLDS.ph.critMin)
    result.push({ type: 'critical', message: `pH sangat asam! ${data.ph.toFixed(2)}`, sensor: 'pH', value: data.ph });
  if (data.airLevel < THRESHOLDS.airLevel.critMin)
    result.push({ type: 'critical', message: `Level air sangat rendah! ${data.airLevel.toFixed(0)}%`, sensor: 'Level Air', value: data.airLevel });
  return result;
}

const DEFAULT_PLANT: PlantData = {
  hst: 15, hss: 22, namaVarietas: 'Melon Anvi F1',
  tanggalTanam: '2026-04-13', jumlahTanaman: 120, lokasi: 'Greenhouse A-1',
};
const INITIAL_SENSOR: SensorData = {
  suhu: 29.5, kelembapan: 76.2, nutrisi: 1620,
  ph: 6.2, airLevel: 82, timestamp: new Date(),
};
const INITIAL_GALLERY: GalleryImage[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1595334214118-e16dc3694acc?w=600', caption: 'Kondisi Greenhouse — Hari ke-1', date: '2026-04-13', type: 'Penanaman' },
  { id: '2', url: 'https://images.unsplash.com/photo-1642433689275-5b369f1caf48?w=600', caption: 'Pertumbuhan Bibit — HST 5', date: '2026-04-18', type: 'Vegetatif' },
  { id: '3', url: 'https://images.unsplash.com/photo-1682250134340-0d74e04bec5f?w=600', caption: 'Buah Melon Mulai Terbentuk', date: '2026-04-22', type: 'Generatif' },
  { id: '4', url: 'https://images.unsplash.com/photo-1681313409698-dbe22c68cfce?w=600', caption: 'Fase Pembibitan Semai', date: '2026-04-10', type: 'Semai' },
  { id: '5', url: 'https://images.unsplash.com/photo-1769259047014-83149b3c9ca7?w=600', caption: 'Deretan Tanaman Melon', date: '2026-04-25', type: 'Vegetatif' },
  { id: '6', url: 'https://images.unsplash.com/photo-1697165927010-a966c1456ea7?w=600', caption: 'Sistem Monitoring Aktif', date: '2026-04-28', type: 'Monitoring' },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try { const s = localStorage.getItem('ghm_user'); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('ghm_dark') === 'true');

  // ── Theme color ─────────────────────────────────────────────────────────────
  const [themeColor, setThemeColorState] = useState<string>(() =>
    localStorage.getItem('ghm_theme_color') || '#2E7D32'
  );

  const setThemeColor = useCallback((color: string) => {
    setThemeColorState(color);
    localStorage.setItem('ghm_theme_color', color);
  }, []);

  useEffect(() => { applyTheme(themeColor); }, [themeColor]);
  // apply on first load too
  useEffect(() => { applyTheme(themeColor); }, []); // eslint-disable-line

  const [sensorData, setSensorData] = useState<SensorData>(INITIAL_SENSOR);
  const [previousSensorData, setPreviousSensorData] = useState<SensorData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [plantData, setPlantData] = useState<PlantData>(DEFAULT_PLANT);
  const [historicalData] = useState<HistoricalDataPoint[]>(generateHistoricalData);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(INITIAL_GALLERY);
  const lastAlertTime = useRef<number>(0);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('ghm_dark', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => {
        setPreviousSensorData(prev);
        const fluc = (v: number, r: number, lo: number, hi: number) =>
          Math.max(lo, Math.min(hi, parseFloat((v + (Math.random() - 0.5) * r).toFixed(2))));
        const next: SensorData = {
          suhu: fluc(prev.suhu, 0.7, 18, 42),
          kelembapan: fluc(prev.kelembapan, 2.5, 40, 99),
          nutrisi: fluc(prev.nutrisi, 90, 700, 2600),
          ph: fluc(prev.ph, 0.12, 3.5, 9.0),
          airLevel: fluc(prev.airLevel, 2, 15, 100),
          timestamp: new Date(),
        };
        const now = Date.now();
        if (now - lastAlertTime.current > 12000) {
          lastAlertTime.current = now;
          const newDefs = checkThresholds(next);
          if (newDefs.length > 0) {
            setAlerts(a => [
              ...newDefs.map(d => ({ ...d, id: generateId(), timestamp: new Date(), read: false })),
              ...a,
            ].slice(0, 40));
          }
        }
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const login     = useCallback((email: string, name: string) => {
    const u: User = { name, email, role: 'Petani' };
    setUser(u); localStorage.setItem('ghm_user', JSON.stringify(u));
  }, []);
  const logout    = useCallback(() => { setUser(null); localStorage.removeItem('ghm_user'); }, []);
  const toggleDarkMode  = useCallback(() => setDarkMode(d => !d), []);
  const markAlertRead   = useCallback((id: string) => setAlerts(a => a.map(x => x.id === id ? { ...x, read: true } : x)), []);
  const markAllRead     = useCallback(() => setAlerts(a => a.map(x => ({ ...x, read: true }))), []);
  const clearAlerts     = useCallback(() => setAlerts([]), []);
  const updatePlantData = useCallback((d: Partial<PlantData>) => setPlantData(p => ({ ...p, ...d })), []);
  const addGalleryImage = useCallback((url: string, caption: string) =>
    setGalleryImages(g => [{ id: generateId(), url, caption, date: new Date().toISOString().split('T')[0], type: 'Custom' }, ...g]), []);
  const removeGalleryImage = useCallback((id: string) =>
    setGalleryImages(g => g.filter(x => x.id !== id)), []);

  return (
    <AppContext.Provider value={{
      user, isAuthenticated: !!user, login, logout,
      darkMode, toggleDarkMode,
      themeColor, setThemeColor,
      sensorData, previousSensorData,
      alerts, unreadCount: alerts.filter(a => !a.read).length,
      markAlertRead, markAllRead, clearAlerts,
      plantData, updatePlantData,
      historicalData,
      galleryImages, addGalleryImage, removeGalleryImage,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}