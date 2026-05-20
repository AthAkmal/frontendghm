import { motion } from 'motion/react';
import { TrendingUp, Activity } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export interface SensorThresholds {
  suhu:       { min: number; max: number };
  kelembapan: { min: number; max: number };
  nutrisi:    { min: number; max: number };
  ph:         { min: number; max: number };
  airLevel:   { min: number; max: number };
}

interface Props {
  thresholds: SensorThresholds;
}

const SENSOR_CONFIG = [
  { key: 'suhu'       as const, label: 'Suhu',       unit: '°C',  color: '#E53935', icon: '🌡️', displayMin: 15,  displayMax: 45   },
  { key: 'kelembapan' as const, label: 'Kelembapan', unit: '%',   color: '#1E88E5', icon: '💧', displayMin: 40,  displayMax: 100  },
  { key: 'nutrisi'    as const, label: 'Nutrisi',    unit: 'ppm', color: '#7B1FA2', icon: '⚗️', displayMin: 700, displayMax: 2600 },
  { key: 'ph'         as const, label: 'pH',         unit: '',    color: '#FB8C00', icon: '🧪', displayMin: 3.5, displayMax: 9.0  },
  { key: 'airLevel'   as const, label: 'Level Air',  unit: '%',   color: '#00ACC1', icon: '🪣', displayMin: 15,  displayMax: 100  },
];

type SensorKey = typeof SENSOR_CONFIG[number]['key'];

function formatValue(key: SensorKey, value: number): string {
  if (key === 'ph')      return value.toFixed(2);
  if (key === 'nutrisi') return value.toFixed(0);
  return value.toFixed(1);
}

function getCondition(value: number, min: number, max: number) {
  if (value < min) return { label: 'Rendah', color: '#1565C0', bg: '#E3F2FD' };
  if (value > max) return { label: 'Tinggi', color: '#C62828', bg: '#FFEBEE' };
  return { label: 'Normal', color: '#2E7D32', bg: '#E8F5E9' };
}

export function DataVisualization({ thresholds }: Props) {
  const { sensorData, darkMode } = useApp();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm dark:border dark:border-white/5">

      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--tp-xl, #E8F5E9)' }}>
          <TrendingUp size={18} style={{ color: 'var(--tp, #2E7D32)' }} />
        </div>
        <div>
          <h3 className="text-gray-800 dark:text-gray-100"
            style={{ fontWeight: 700, fontSize: '0.95rem' }}>
            Visualisasi Data
          </h3>
          <p className="text-gray-400 text-xs flex items-center gap-1">
            <Activity size={10} /> Monitoring real-time
          </p>
        </div>
      </div>

      {/* Interval gauges */}
      <div className="space-y-3">
        {SENSOR_CONFIG.map(sensor => {
          const value = (sensorData as any)[sensor.key] as number;
          const { min: normalMin, max: normalMax } = thresholds[sensor.key];
          const toPct = (v: number) =>
            Math.max(0, Math.min(100, ((v - sensor.displayMin) / (sensor.displayMax - sensor.displayMin)) * 100));
          const normalMinPct = toPct(normalMin);
          const normalMaxPct = toPct(normalMax);
          const valuePct     = toPct(value);
          const condition    = getCondition(value, normalMin, normalMax);

          return (
            <div key={sensor.key} className="p-4 rounded-xl"
              style={{ background: darkMode ? '#111827' : '#f8f9fa' }}>

              {/* Sensor header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">{sensor.icon}</span>
                  <span className="text-sm"
                    style={{ fontWeight: 600, color: darkMode ? '#e5e7eb' : '#374151' }}>
                    {sensor.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg" style={{ fontWeight: 800, color: sensor.color }}>
                    {formatValue(sensor.key, value)}
                    {sensor.unit && (
                      <span className="text-sm ml-0.5" style={{ fontWeight: 500 }}>{sensor.unit}</span>
                    )}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs"
                    style={{ fontWeight: 700, background: condition.bg, color: condition.color }}>
                    {condition.label}
                  </span>
                </div>
              </div>

              {/* Interval bar */}
              <div className="relative h-8 rounded-full overflow-hidden mb-1">
                {/* Rendah */}
                <div className="absolute top-0 bottom-0 flex items-center justify-center overflow-hidden"
                  style={{
                    left: 0, width: `${normalMinPct}%`,
                    background: darkMode ? '#1a2f4a' : '#BBDEFB',
                    borderRadius: '999px 0 0 999px', minWidth: '8%',
                  }}>
                  <span className="text-xs font-semibold px-1 whitespace-nowrap"
                    style={{ color: darkMode ? '#64B5F6' : '#1565C0' }}>Rendah</span>
                </div>

                {/* Normal */}
                <div className="absolute top-0 bottom-0 flex items-center justify-center overflow-hidden"
                  style={{
                    left: `${normalMinPct}%`,
                    width: `${normalMaxPct - normalMinPct}%`,
                    background: darkMode ? '#1a3d2b' : '#C8E6C9',
                  }}>
                  <span className="text-xs font-semibold"
                    style={{ color: darkMode ? '#81C784' : '#2E7D32' }}>Normal</span>
                </div>

                {/* Tinggi */}
                <div className="absolute top-0 bottom-0 flex items-center justify-center overflow-hidden"
                  style={{
                    left: `${normalMaxPct}%`, right: 0,
                    background: darkMode ? '#4a1a1a' : '#FFCCBC',
                    borderRadius: '0 999px 999px 0', minWidth: '8%',
                  }}>
                  <span className="text-xs font-semibold px-1 whitespace-nowrap"
                    style={{ color: darkMode ? '#EF9A9A' : '#C62828' }}>Tinggi</span>
                </div>

                {/* Value needle */}
                <div className="absolute top-0 bottom-0 flex items-center"
                  style={{
                    left: `${valuePct}%`,
                    transform: 'translateX(-50%)',
                    transition: 'left 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    zIndex: 10,
                  }}>
                  <div className="w-1 h-full rounded-full"
                    style={{ background: condition.color, boxShadow: `0 0 8px ${condition.color}` }} />
                </div>
              </div>

              {/* Scale labels */}
              <div className="relative h-4">
                <span className="absolute text-xs left-0"
                  style={{ color: darkMode ? '#6b7280' : '#9ca3af' }}>
                  {sensor.displayMin}{sensor.unit}
                </span>
                <span className="absolute text-xs"
                  style={{ left: `${normalMinPct}%`, transform: 'translateX(-50%)', color: darkMode ? '#6b7280' : '#9ca3af' }}>
                  {normalMin}{sensor.unit}
                </span>
                <span className="absolute text-xs"
                  style={{ left: `${normalMaxPct}%`, transform: 'translateX(-50%)', color: darkMode ? '#6b7280' : '#9ca3af' }}>
                  {normalMax}{sensor.unit}
                </span>
                <span className="absolute text-xs right-0"
                  style={{ color: darkMode ? '#6b7280' : '#9ca3af' }}>
                  {sensor.displayMax}{sensor.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer legend */}
      <div className="flex gap-4 mt-4 pt-4 border-t dark:border-white/5">
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#1565C0' }}>
          <div className="w-3 h-3 rounded-full" style={{ background: '#BBDEFB', border: '1px solid #1565C0' }} />
          Rendah
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#2E7D32' }}>
          <div className="w-3 h-3 rounded-full" style={{ background: '#C8E6C9', border: '1px solid #2E7D32' }} />
          Normal
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#C62828' }}>
          <div className="w-3 h-3 rounded-full" style={{ background: '#FFCCBC', border: '1px solid #C62828' }} />
          Tinggi
        </div>
      </div>
    </div>
  );
}