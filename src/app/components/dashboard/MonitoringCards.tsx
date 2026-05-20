import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Thermometer, Droplets, FlaskConical, Calendar,
  TrendingUp, TrendingDown, Minus, Waves
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

function useCountUp(target: number, decimals = 1) {
  const [val, setVal] = useState(target);
  const prev = useRef(target);
  useEffect(() => {
    const start = prev.current;
    const diff  = target - start;
    if (Math.abs(diff) < 0.01) return;
    const duration  = 800;
    const startTime = Date.now();
    const frame = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setVal(parseFloat((start + diff * eased).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(frame);
      else prev.current = target;
    };
    requestAnimationFrame(frame);
  }, [target, decimals]);
  return val;
}

function TrendIcon({ current, previous }: { current: number; previous: number | null }) {
  if (!previous) return null;
  const diff = current - previous;
  if (Math.abs(diff) < 0.1) return <Minus size={12} className="text-gray-400" />;
  return diff > 0
    ? <TrendingUp  size={12} className="text-red-400" />
    : <TrendingDown size={12} className="text-green-400" />;
}

interface CardProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  subtitle?: string;
  color: string;
  bgGradient: string;
  trend?: { current: number; previous: number | null };
  delay?: number;
}

function MonitorCard({
  title, icon, value, unit, status, subtitle,
  color, bgGradient, trend, delay = 0,
}: CardProps) {
  const { darkMode } = useApp();
  const statusColors = {
    normal:   { bg: 'var(--tp-xl, #E8F5E9)', text: 'var(--tp, #2E7D32)', label: 'Normal'     },
    warning:  { bg: '#FFF8E1',               text: '#F57F17',             label: 'Peringatan' },
    critical: { bg: '#FFEBEE',               text: '#C62828',             label: 'Kritis'     },
  };
  const sc = statusColors[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl p-5 group hover:shadow-lg transition-all duration-300 dark:border dark:border-white/5"
      style={{ background: darkMode ? '#111827' : 'white' }}
      whileHover={{ y: -2 }}>

      {/* Accent circles */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-6 translate-x-6"
        style={{ background: bgGradient }} />
      <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full opacity-5 translate-y-4 -translate-x-4"
        style={{ background: bgGradient }} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: bgGradient }}>
            {icon}
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
            style={{ background: sc.bg, color: sc.text, fontWeight: 600 }}>
            <div className={`w-1.5 h-1.5 rounded-full ${
              status === 'normal'   ? 'bg-green-500' :
              status === 'warning'  ? 'bg-yellow-500' : 'bg-red-500'
            } ${status !== 'normal' ? 'animate-pulse' : ''}`} />
            {sc.label}
          </div>
        </div>

        {/* Value */}
        <div className="flex items-end gap-1 mb-1">
          <span style={{ fontSize: '2rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</span>
          <span className="text-gray-400 text-sm mb-1" style={{ fontWeight: 500 }}>{unit}</span>
          {trend && (
            <span className="mb-1 ml-1">
              <TrendIcon current={trend.current} previous={trend.previous} />
            </span>
          )}
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-xs" style={{ fontWeight: 500 }}>{title}</p>
        {subtitle && <p className="text-gray-400 text-xs mt-0.5">{subtitle}</p>}
      </div>
    </motion.div>
  );
}

function RealTimeCard() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const days   = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl p-5 group hover:shadow-lg transition-all duration-300"
      style={{ background: 'linear-gradient(135deg, var(--tp-d, #1B5E20), var(--tp, #2E7D32))' }}
      whileHover={{ y: -2 }}>
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -translate-y-8 translate-x-8"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.6), transparent)' }} />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.2)' }}>
            <Calendar size={22} color="rgba(255,255,255,0.9)" />
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
            style={{ background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Live
          </div>
        </div>
        <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', marginTop: 4, fontWeight: 500 }}>
          {days[time.getDay()]}, {time.getDate()} {months[time.getMonth()]} {time.getFullYear()}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.75rem', marginTop: 2 }}>
          Waktu Sistem Real-time
        </p>
      </div>
    </motion.div>
  );
}

export function MonitoringCards() {
  const { sensorData, previousSensorData } = useApp();

  const suhuVal    = useCountUp(sensorData.suhu,       1);
  const humVal     = useCountUp(sensorData.kelembapan, 1);
  const airVal     = useCountUp(sensorData.airLevel,   1);
  const nutrisiVal = useCountUp(sensorData.nutrisi,    0);

  const getSuhuStatus = (v: number): 'normal' | 'warning' | 'critical' =>
    v > 36 ? 'critical' : v > 33 || v < 23 ? 'warning' : 'normal';
  const getHumStatus  = (v: number): 'normal' | 'warning' | 'critical' =>
    v < 55 || v > 95 ? 'critical' : v < 65 || v > 88 ? 'warning' : 'normal';
  const getAirStatus  = (v: number): 'normal' | 'warning' | 'critical' =>
    v < 40 ? 'critical' : v < 60 ? 'warning' : 'normal';
  const getNutStatus  = (v: number): 'normal' | 'warning' | 'critical' =>
    v < 1000 || v > 2200 ? 'critical' : v < 1200 || v > 1900 ? 'warning' : 'normal';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">

      {/* Real-time clock */}
      <RealTimeCard />

      {/* 1 — Suhu Udara */}
      <MonitorCard
        title="Suhu Udara"
        unit="°C"
        color="#E53935"
        value={suhuVal.toFixed(1)}
        status={getSuhuStatus(sensorData.suhu)}
        subtitle={`Feels like ${(sensorData.suhu + 1.2).toFixed(1)}°C`}
        icon={<Thermometer size={22} className="text-orange-100" />}
        bgGradient="linear-gradient(135deg, #FF7043, #E53935)"
        trend={{ current: sensorData.suhu, previous: previousSensorData?.suhu ?? null }}
        delay={0.1}
      />

      {/* 2 — Kelembapan */}
      <MonitorCard
        title="Kelembapan Udara"
        unit="%"
        color="#1E88E5"
        value={humVal.toFixed(1)}
        status={getHumStatus(sensorData.kelembapan)}
        subtitle={`Titik embun ${(sensorData.suhu - (100 - sensorData.kelembapan) / 5).toFixed(1)}°C`}
        icon={<Droplets size={22} className="text-blue-100" />}
        bgGradient="linear-gradient(135deg, #42A5F5, #1565C0)"
        trend={{ current: sensorData.kelembapan, previous: previousSensorData?.kelembapan ?? null }}
        delay={0.2}
      />

      {/* 3 — Level Air */}
      <MonitorCard
        title="Level Air"
        unit="%"
        color="#00ACC1"
        value={airVal.toFixed(1)}
        status={getAirStatus(sensorData.airLevel)}
        subtitle={`pH larutan: ${sensorData.ph.toFixed(2)}`}
        icon={<Waves size={22} className="text-cyan-100" />}
        bgGradient="linear-gradient(135deg, #26C6DA, #00838F)"
        trend={{ current: sensorData.airLevel, previous: previousSensorData?.airLevel ?? null }}
        delay={0.3}
      />

      {/* 4 — Nutrisi */}
      <MonitorCard
        title="Nutrisi Larutan"
        unit="ppm"
        color="#7B1FA2"
        value={nutrisiVal.toFixed(0)}
        status={getNutStatus(sensorData.nutrisi)}
        subtitle={`EC ≈ ${(sensorData.nutrisi / 700).toFixed(2)} mS/cm`}
        icon={<FlaskConical size={22} className="text-purple-100" />}
        bgGradient="linear-gradient(135deg, #AB47BC, #7B1FA2)"
        trend={{ current: sensorData.nutrisi, previous: previousSensorData?.nutrisi ?? null }}
        delay={0.4}
      />
    </div>
  );
}