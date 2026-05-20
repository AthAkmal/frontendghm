import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

import {
  FileText,
  Thermometer,
  Droplets,
  FlaskConical,
  TrendingUp,
  CalendarDays,
} from 'lucide-react';

import { useApp } from '../contexts/AppContext';

type MetricKey =
  | 'suhu'
  | 'kelembapan'
  | 'air'
  | 'nutrisi';

const METRICS = [
  {
    key: 'suhu',
    title: 'Suhu Udara',
    color: '#E53935',
    bg: '#FFEBEE',
    icon: Thermometer,
    unit: '°C',
  },

  {
    key: 'kelembapan',
    title: 'Kelembapan',
    color: '#1E88E5',
    bg: '#E3F2FD',
    icon: Droplets,
    unit: '%',
  },

  {
    key: 'air',
    title: 'Level Air',
    color: '#00ACC1',
    bg: '#E0F7FA',
    icon: Droplets,
    unit: '%',
  },

  {
    key: 'nutrisi',
    title: 'Nutrisi',
    color: '#7B1FA2',
    bg: '#F3E5F5',
    icon: FlaskConical,
    unit: 'ppm',
  },
] as const;

const CustomTooltip = ({
  active,
  payload,
  label,
}: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-3 shadow-xl border border-gray-100 dark:border-white/10">
      <p
        className="text-gray-500 text-xs mb-2"
        style={{ fontWeight: 700 }}
      >
        {label}
      </p>

      {payload.map((p: any, i: number) => (
        <div
          key={i}
          className="flex items-center gap-2 text-xs"
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: p.color }}
          />

          <span className="text-gray-500">
            {p.name}:
          </span>

          <span
            style={{
              fontWeight: 700,
              color: p.color,
            }}
          >
            {p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export function ReportsPage() {
  const { historicalData, darkMode } = useApp();

  const [selectedFeature, setSelectedFeature] =
    useState<MetricKey | null>(null);

  const [startDate, setStartDate] =
    useState<Date | null>(
      new Date(
        Date.now() -
          7 * 24 * 60 * 60 * 1000
      )
    );

  const [endDate, setEndDate] =
    useState<Date | null>(new Date());

  // FILTER DATA BERDASARKAN TANGGAL
  const filteredChartData = useMemo(() => {
    if (!startDate || !endDate) {
      return historicalData;
    }

    return historicalData.filter((item) => {
      const itemDate = new Date(item.tanggal);

      return (
        itemDate >= startDate &&
        itemDate <= endDate
      );
    });
  }, [
    historicalData,
    startDate,
    endDate,
  ]);

  return (
    <div className="p-4 lg:p-6 max-w-screen-xl mx-auto space-y-6">

      {/* HEADER (Tombol Download PDF Lama Sudah Dihapus Dari Sini) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1
            className="text-gray-800 dark:text-gray-100"
            style={{
              fontWeight: 800,
              fontSize: '1.6rem',
            }}
          >
            Laporan Monitoring
          </h1>

          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Monitoring dan visualisasi data sensor greenhouse
          </p>
        </div>
      </motion.div>

      {/* FORM LAPORAN */}
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.1,
        }}
        className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm dark:border dark:border-white/5"
      >

        {/* TITLE */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: '#E8F5E9',
            }}
          >
            <FileText
              size={28}
              style={{
                color: '#2E7D32',
              }}
            />
          </div>

          <div>
            <h2
              className="text-gray-800 dark:text-gray-100"
              style={{
                fontWeight: 800,
                fontSize: '1.15rem',
              }}
            >
              Form Laporan Sensor
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              Pilih fitur sensor untuk melihat grafik laporan
            </p>
          </div>
        </div>

        {/* SENSOR LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {METRICS.map((metric) => {
            const Icon = metric.icon;

            const active =
              selectedFeature ===
              metric.key;

            return (
              <motion.button
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                key={metric.key}
                onClick={() =>
                  setSelectedFeature(
                    metric.key as MetricKey
                  )
                }
                className="rounded-3xl p-5 text-left transition-all duration-300"
                style={{
                  background: active
                    ? metric.color
                    : darkMode
                    ? '#111827'
                    : '#fff',

                  border: active
                    ? `2px solid ${metric.color}`
                    : '1.5px solid #e5e7eb',

                  boxShadow: active
                    ? `0 10px 30px ${metric.color}35`
                    : '0 4px 15px rgba(0,0,0,0.04)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{
                    background: active
                      ? '#ffffff20'
                      : metric.bg,
                  }}
                >
                  <Icon
                    size={24}
                    style={{
                      color: active
                        ? '#fff'
                        : metric.color,
                    }}
                  />
                </div>

                <h3
                  style={{
                    fontWeight: 800,
                    fontSize: '1rem',

                    color: active
                      ? '#fff'
                      : darkMode
                      ? '#f3f4f6'
                      : '#111827',
                  }}
                >
                  {metric.title}
                </h3>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color: active
                      ? '#ffffffcc'
                      : darkMode
                      ? '#9ca3af'
                      : '#6b7280',
                  }}
                >
                  Klik untuk melihat grafik
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* FILTER + CHART */}
        <AnimatePresence>
          {selectedFeature && (
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 15,
              }}
              className="rounded-3xl p-5"
              style={{
                background: darkMode
                  ? '#111827'
                  : '#f8fafc',

                border:
                  '1.5px solid #e5e7eb',
              }}
            >

              {/* DATE PICKER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

                {/* START DATE */}
                <div>
                  <label
                    className="block mb-2 text-sm"
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    Tanggal Mulai
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                    />

                    <input
                      type="date"
                      value={
                        startDate
                          ? startDate
                              .toISOString()
                              .split('T')[0]
                          : ''
                      }
                      onChange={(e) =>
                        setStartDate(
                          e.target.value
                            ? new Date(
                                e.target.value
                              )
                            : null
                        )
                      }
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
                    />
                  </div>
                </div>

                {/* END DATE */}
                <div>
                  <label
                    className="block mb-2 text-sm"
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    Tanggal Selesai
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                    />

                    <input
                      type="date"
                      value={
                        endDate
                          ? endDate
                              .toISOString()
                              .split('T')[0]
                          : ''
                      }
                      onChange={(e) =>
                        setEndDate(
                          e.target.value
                            ? new Date(
                                e.target.value
                              )
                            : null
                        )
                      }
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* CHART */}
              <div
                className="bg-white dark:bg-gray-900 rounded-3xl p-5"
                style={{
                  border:
                    '1px solid #e5e7eb',
                }}
              >

                {/* HEADER */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{
                      background:
                        '#E8F5E9',
                    }}
                  >
                    <TrendingUp
                      size={20}
                      style={{
                        color:
                          '#2E7D32',
                      }}
                    />
                  </div>

                  <div>
                    <h3
                      className="text-gray-800 dark:text-white"
                      style={{
                        fontWeight: 800,
                      }}
                    >
                      Grafik Sensor
                    </h3>

                    <p className="text-xs text-gray-400 mt-1">
                      Visualisasi data sensor
                    </p>
                  </div>
                </div>

                <ResponsiveContainer
                  width="100%"
                  height={350}
                >
                  <LineChart
                    data={filteredChartData}
                    margin={{
                      top: 5,
                      right: 20,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={
                        darkMode
                          ? '#1f2937'
                          : '#f0f0f0'
                      }
                    />

                    <XAxis
                      dataKey="tanggal"
                      tick={{
                        fontSize: 11,
                        fill: '#9ca3af',
                      }}
                    />

                    <YAxis
                      tick={{
                        fontSize: 11,
                        fill: '#9ca3af',
                      }}
                    />

                    <Tooltip
                      content={
                        <CustomTooltip />
                      }
                    />

                    {METRICS.filter(
                      (metric) =>
                        metric.key ===
                        selectedFeature
                    ).map((metric) => (
                      <Line
                        key={metric.key}
                        type="monotone"
                        dataKey={metric.key}
                        name={`${metric.title} (${metric.unit})`}
                        stroke={
                          metric.color
                        }
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          fill:
                            metric.color,
                        }}
                        activeDot={{
                          r: 7,
                          fill: '#fff',
                          stroke:
                            metric.color,
                          strokeWidth: 2,
                        }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}