import { motion } from 'motion/react';
import { Leaf, Sun, CheckCircle2, Clock } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface PhaseBarProps {
  label: string; description: string; current: number; total: number;
  color: string; bgColor: string; darkBgColor: string;
  icon: React.ReactNode;
  milestones: { day: number; label: string }[];
  delay?: number; darkMode: boolean;
}

function PhaseBar({ label, description, current, total, color, bgColor, darkBgColor, icon, milestones, delay = 0, darkMode }: PhaseBarProps) {
  const pct = Math.min((current / total) * 100, 100);
  const status = pct >= 100 ? 'Selesai' : pct >= 75 ? 'Hampir Selesai' : pct >= 50 ? 'Pertengahan' : pct >= 25 ? 'Awal' : 'Baru Mulai';
  const statusColor = pct >= 100 ? color : pct >= 75 ? color : pct >= 50 ? '#F57F17' : '#1565C0';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-xl p-4 dark:border dark:border-white/5"
      style={{ background: darkMode ? darkBgColor : bgColor }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: color + '25' }}>
            {icon}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.9rem' }} className="text-gray-900 dark:text-gray-100">{label}</p>
            <p className="text-gray-500 dark:text-gray-400" style={{ fontSize: '0.7rem' }}>{description}</p>
          </div>
        </div>
        <div className="text-right">
          <p style={{ fontWeight: 800, color, fontSize: '1.3rem', lineHeight: 1 }}>
            {current}<span className="text-gray-400 text-sm">/{total}</span>
          </p>
          <p style={{ fontSize: '0.7rem', color: statusColor, fontWeight: 600 }}>{status}</p>
        </div>
      </div>

      <div className="relative h-3 rounded-full mb-3" style={{ background: '#e8ecef' }}>
        <motion.div className="absolute inset-y-0 left-0 rounded-full"
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ delay: delay + 0.3, duration: 0.8, ease: 'easeOut' }}
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }} />
        <div className="absolute -top-0.5 rounded-full w-4 h-4 border-2 border-white shadow-sm"
          style={{ left: `calc(${pct}% - 8px)`, background: color }} />
      </div>

      <div className="flex justify-between">
        {milestones.map((m, i) => {
          const reached = current >= m.day;
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: reached ? color : '#e2e8f0' }}>
                {reached
                  ? <CheckCircle2 size={12} className="text-white" />
                  : <Clock size={10} className="text-gray-400" />}
              </div>
              <p style={{ color: reached ? color : '#94a3b8', fontWeight: reached ? 600 : 400, fontSize: '0.65rem' }}>
                H{m.day}
              </p>
              <p className="text-xs text-center leading-tight"
                style={{ color: '#94a3b8', fontSize: '0.6rem', maxWidth: '3rem' }}>
                {m.label}
              </p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export function GrowthStatus() {
  const { plantData, darkMode } = useApp();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm dark:border dark:border-white/5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-gray-800 dark:text-gray-100" style={{ fontWeight: 700 }}>Status Pertumbuhan</h3>
          <p className="text-gray-400 text-xs mt-0.5">{plantData.namaVarietas} · {plantData.lokasi}</p>
        </div>
        <div className="px-3 py-1.5 rounded-full text-xs"
          style={{ background: 'var(--tp-xl)', color: 'var(--tp)', fontWeight: 600 }}>
          🌿 Fase Aktif
        </div>
      </div>

      <div className="space-y-4">
        <PhaseBar
          label="Fase Vegetatif" description="Pertumbuhan daun & batang"
          current={plantData.hst} total={30}
          color="var(--tp)"
          bgColor="var(--tp-xl)" darkBgColor="rgba(0,0,0,0.3)"
          icon={<Leaf size={16} style={{ color: 'var(--tp)' }} />}
          milestones={[
            { day: 5, label: 'Kecambah' }, { day: 10, label: 'Bibit' },
            { day: 15, label: 'Daun 4' }, { day: 20, label: 'Percabangan' }, { day: 30, label: 'Bunga' },
          ]}
          delay={0} darkMode={darkMode}
        />
        <PhaseBar
          label="Fase Generatif" description="Pembungaan & pembuahan"
          current={Math.max(0, plantData.hst - 30)} total={45}
          color="#F57F17"
          bgColor="#FFF8E1" darkBgColor="#1a1200"
          icon={<Sun size={16} style={{ color: '#F57F17' }} />}
          milestones={[
            { day: 5, label: 'Anthesis' }, { day: 10, label: 'Set Buah' },
            { day: 20, label: 'Pembesaran' }, { day: 35, label: 'Matang' }, { day: 45, label: 'Panen' },
          ]}
          delay={0.15} darkMode={darkMode}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t dark:border-white/5">
        {[
          { label: 'Tgl Tanam',   value: new Date(plantData.tanggalTanam).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }), color: 'var(--tp)'  },
          { label: 'Jml Tanaman', value: `${plantData.jumlahTanaman}`,   color: '#1565C0' },
          { label: 'Est. Panen',  value: `${75 - plantData.hst} hari`,   color: '#F57F17' },
        ].map((s, i) => (
          <div key={i} className="text-center p-2 rounded-lg" style={{ background: '#f8f9fa' }}>
            <p style={{ fontWeight: 700, color: s.color, fontSize: '1rem' }}>{s.value}</p>
            <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}