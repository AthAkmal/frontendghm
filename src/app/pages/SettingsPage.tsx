import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Palette, Save, RefreshCw, Moon, Sun, Check, Pipette } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface NotifSettings {
  email: boolean; push: boolean; critical: boolean;
  warning: boolean; daily: boolean; sound: boolean;
}
interface AppSettings {
  notif: NotifSettings;
}

const DEFAULT_SETTINGS: AppSettings = {
  notif: { email: true, push: true, critical: true, warning: true, daily: false, sound: true },
};
const DEFAULT_THEME = '#2E7D32';
const STORAGE_KEY   = 'ghm_settings';

const PRESET_COLORS = [
  { color: '#2E7D32', label: 'Hijau Hutan'  },
  { color: '#1565C0', label: 'Biru Laut'    },
  { color: '#6A1B9A', label: 'Ungu'         },
  { color: '#BF360C', label: 'Merah Bata'   },
  { color: '#00695C', label: 'Tosca'         },
  { color: '#F57F17', label: 'Kuning'        },
  { color: '#AD1457', label: 'Pink'          },
  { color: '#00838F', label: 'Cyan'          },
  { color: '#37474F', label: 'Abu-abu'       },
  { color: '#4527A0', label: 'Indigo'        },
  { color: '#558B2F', label: 'Hijau Muda'   },
  { color: '#E65100', label: 'Oranye'        },
];

const loadSettings = (): AppSettings => {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? { ...DEFAULT_SETTINGS, ...JSON.parse(s) } : DEFAULT_SETTINGS;
  } catch { return DEFAULT_SETTINGS; }
};

function Toggle({ checked, onChange, color }: { checked: boolean; onChange: (v: boolean) => void; color: string }) {
  return (
    <button onClick={() => onChange(!checked)}
      className="relative w-11 h-6 rounded-full transition-all duration-300"
      style={{ background: checked ? color : '#d1d5db' }}>
      <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
        style={{ left: checked ? '24px' : '4px' }} />
    </button>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm dark:border dark:border-white/5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--tp-xl, #E8F5E9)' }}>
          {icon}
        </div>
        <h2 className="text-gray-800 dark:text-gray-100" style={{ fontWeight: 700, fontSize: '0.95rem' }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Row({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b dark:border-white/5 last:border-0 gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-gray-700 dark:text-gray-300 text-sm" style={{ fontWeight: 500 }}>{label}</p>
        {description && <p className="text-gray-400 text-xs mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

export function SettingsPage() {
  const { darkMode, toggleDarkMode, themeColor, setThemeColor } = useApp();

  const [settings,    setSettings]    = useState<AppSettings>(loadSettings);
  const [saved,       setSaved]       = useState(false);
  const [resetting,   setResetting]   = useState(false);
  const [hasChanges,  setHasChanges]  = useState(false);
  const [localColor,  setLocalColor]  = useState(themeColor);

  const tc = localColor;

  // Deteksi perubahan
  useEffect(() => {
    const stored   = loadSettings();
    const colorChanged = localColor !== (localStorage.getItem('ghm_theme_color') || DEFAULT_THEME);
    const settingsChanged = JSON.stringify(settings) !== JSON.stringify(stored);
    setHasChanges(colorChanged || settingsChanged);
  }, [settings, localColor]);

  // Preview color secara langsung saat digeser
  const handleColorChange = (color: string) => {
    setLocalColor(color);
    setThemeColor(color); // preview real-time
  };

  const updateNotif = (key: keyof NotifSettings, val: boolean) =>
    setSettings(p => ({ ...p, notif: { ...p.notif, [key]: val } }));

  // ── Simpan ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 600));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setThemeColor(localColor);
    setSaved(true);
    setHasChanges(false);
    setTimeout(() => setSaved(false), 2500);
  };

  // ── Reset ───────────────────────────────────────────────────────────────────
  const handleReset = async () => {
    setResetting(true);
    await new Promise(r => setTimeout(r, 500));
    setSettings(DEFAULT_SETTINGS);
    setLocalColor(DEFAULT_THEME);
    setThemeColor(DEFAULT_THEME);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem('ghm_theme_color', DEFAULT_THEME);
    if (darkMode) toggleDarkMode();
    setResetting(false);
    setHasChanges(false);
  };

  const notifRows: {
    key: keyof NotifSettings; label: string; desc: string; color?: string;
  }[] = [
    { key: 'email',    label: 'Notifikasi Email',   desc: 'Terima alert via email' },
    { key: 'push',     label: 'Notifikasi Push',    desc: 'Notifikasi browser real-time' },
    { key: 'critical', label: 'Alert Kritis',       desc: 'Wajib untuk kondisi darurat', color: '#C62828' },
    { key: 'warning',  label: 'Alert Peringatan',   desc: 'Kondisi di luar batas optimal', color: '#F57F17' },
    { key: 'daily',    label: 'Laporan Harian',     desc: 'Ringkasan harian otomatis' },
    { key: 'sound',    label: 'Suara Notifikasi',   desc: 'Bunyi saat alert muncul' },
  ];

  return (
    <div className="p-4 lg:p-6 max-w-screen-lg mx-auto space-y-5">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-gray-800 dark:text-gray-100" style={{ fontWeight: 800, fontSize: '1.5rem' }}>
          Pengaturan
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
          Kelola preferensi dan konfigurasi sistem GHM
        </p>
      </motion.div>

      {/* Unsaved banner */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: '#FFF8E1', border: '1.5px solid #FFE082' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-sm" style={{ color: '#F57F17', fontWeight: 600 }}>
                Ada perubahan yang belum disimpan
              </span>
            </div>
            <button onClick={handleSave}
              className="text-xs px-3 py-1.5 rounded-lg text-white"
              style={{ background: '#F57F17', fontWeight: 600 }}>
              Simpan Sekarang
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Section title="Notifikasi" icon={<Bell size={18} style={{ color: tc }} />}>
          {notifRows.map(row => (
            <Row key={row.key} label={row.label} description={row.desc}>
              <Toggle checked={settings.notif[row.key]} onChange={v => updateNotif(row.key, v)} color={row.color ?? tc} />
            </Row>
          ))}
        </Section>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Section title="Tampilan" icon={<Palette size={18} style={{ color: tc }} />}>

          {/* Dark mode */}
          <Row label="Mode Gelap" description="Tampilan gelap untuk malam hari">
            <button onClick={toggleDarkMode}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all"
              style={{ background: darkMode ? tc + '25' : '#f1f5f9', color: darkMode ? tc : '#374151', fontWeight: 600, border: `1.5px solid ${darkMode ? tc : '#e2e8f0'}` }}>
              {darkMode ? <><Moon size={14} /> Dark</> : <><Sun size={14} /> Light</>}
            </button>
          </Row>

          {/* ── Color Picker ── */}
          <div className="py-4 last:border-0">
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-1" style={{ fontWeight: 500 }}>
              Tema Warna
            </p>
            <p className="text-gray-400 text-xs mb-4">
              Klik lingkaran untuk membuka color picker — perubahan langsung diterapkan
            </p>

            <div className="flex flex-wrap items-center gap-5">
              {/* Big color circle — opens native color picker */}
              <div className="flex flex-col items-center gap-2">
                <label htmlFor="theme-color-input" className="cursor-pointer group relative">
                  <div
                    className="w-16 h-16 rounded-2xl transition-transform group-hover:scale-105 shadow-lg flex items-center justify-center"
                    style={{
                      background: tc,
                      boxShadow:  `0 4px 20px ${tc}60`,
                      border:     '3px solid white',
                      outline:    `3px solid ${tc}`,
                    }}>
                    <Pipette size={20} color="rgba(255,255,255,0.85)" />
                  </div>
                  <input
                    id="theme-color-input"
                    type="color"
                    value={localColor}
                    onChange={e => handleColorChange(e.target.value)}
                    className="sr-only"
                  />
                </label>
                {/* Hex code */}
                <div className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold"
                  style={{ background: tc + '15', color: tc, border: `1px solid ${tc}30` }}>
                  {localColor.toUpperCase()}
                </div>
                <p className="text-xs text-gray-400">Kustom</p>
              </div>

              {/* Preset swatches */}
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-2.5" style={{ fontWeight: 600 }}>
                  Warna Preset
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map(c => {
                    const isActive = localColor.toLowerCase() === c.color.toLowerCase();
                    return (
                      <button
                        key={c.color}
                        title={c.label}
                        onClick={() => handleColorChange(c.color)}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                        style={{
                          background: c.color,
                          transform:  isActive ? 'scale(1.2)' : 'scale(1)',
                          boxShadow:  isActive
                            ? `0 0 0 2px white, 0 0 0 4px ${c.color}`
                            : `0 2px 6px ${c.color}40`,
                        }}>
                        <AnimatePresence>
                          {isActive && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                              <Check size={13} color="white" strokeWidth={3} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Preview strip */}
            <div className="mt-4 rounded-xl overflow-hidden flex h-8">
              {[tc + 'ff', tc + 'cc', tc + '99', tc + '66', tc + '33'].map((c, i) => (
                <div key={i} className="flex-1" style={{ background: c }} />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              Preview gradasi warna tema
            </p>
          </div>
        </Section>
      </motion.div>

      {/* Buttons */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="flex justify-end gap-3 pb-6">
        <button onClick={handleReset} disabled={resetting}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all hover:bg-gray-100 dark:hover:bg-white/5"
          style={{ border: '1.5px solid #e2e8f0', fontWeight: 500, color: darkMode ? '#9ca3af' : '#6b7280' }}>
          {resetting
            ? <><div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />Mereset...</>
            : <><RefreshCw size={15} />Reset Default</>}
        </button>
        <button onClick={handleSave} disabled={saved}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm transition-all hover:opacity-90"
          style={{ background: saved ? '#43A047' : `linear-gradient(135deg, ${tc}, ${tc}bb)`, fontWeight: 600, boxShadow: `0 3px 12px ${tc}40` }}>
          {saved
            ? <><Check size={15} />Tersimpan!</>
            : <><Save size={15} />Simpan Pengaturan</>}
        </button>
      </motion.div>
    </div>
  );
}