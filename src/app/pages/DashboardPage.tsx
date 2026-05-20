import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { MonitoringCards }    from '../components/dashboard/MonitoringCards';
import { SmartAlerts }        from '../components/dashboard/SmartAlerts';
import { DataVisualization, SensorThresholds } from '../components/dashboard/DataVisualization';
import { useApp }             from '../contexts/AppContext';
import { Footer }             from '../components/ui/footer';

const DEFAULT_THRESHOLDS: SensorThresholds = {
  suhu:       { min: 23,   max: 33   },
  kelembapan: { min: 65,   max: 88   },
  nutrisi:    { min: 1200, max: 1900 },
  ph:         { min: 5.8,  max: 6.8  },
  airLevel:   { min: 60,   max: 95   },
};

export function DashboardPage() {
  // Menggunakan galleryImages bawaan AppContext agar tidak error TypeScript
  const { sensorData, galleryImages } = useApp();
  const [thresholds] = useState<SensorThresholds>(DEFAULT_THRESHOLDS);

  const activeAlerts = useMemo(() => {
    const generatedAlerts: any[] = [];
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const checkThreshold = (key: keyof SensorThresholds, label: string, unit: string) => {
      const value = sensorData[key];
      const { min, max } = thresholds[key];

      if (value < min) {
        generatedAlerts.push({
          id: `${key}-rendah`,
          type: 'warning',
          status: 'Rendah',
          message: `${label} di bawah batas aman: ${value.toFixed(1)}${unit}`,
          timestamp: timeNow,
        });
      } else if (value > max) {
        generatedAlerts.push({
          id: `${key}-tinggi`,
          type: 'critical',
          status: 'Tinggi',
          message: `${label} melebihi ambang batas: ${value.toFixed(1)}${unit}`,
          timestamp: timeNow,
        });
      } else {
        generatedAlerts.push({
          id: `${key}-normal`,
          type: 'success',
          status: 'Normal',
          message: `${label} terpantau dalam kondisi optimal: ${value.toFixed(1)}${unit}`,
          timestamp: timeNow,
        });
      }
    };

    checkThreshold('suhu', 'Suhu', '°C');
    checkThreshold('kelembapan', 'Kelembapan', '%');
    checkThreshold('nutrisi', 'Nutrisi', ' ppm');
    checkThreshold('ph', 'pH', '');
    checkThreshold('airLevel', 'Level Air', '%');

    return generatedAlerts;
  }, [sensorData, thresholds]);

  const alertCount = activeAlerts.filter(a => a.type !== 'success').length;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-500">
      
      {/* Dynamic Background Element */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-50/50 dark:bg-green-900/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4" />
      </div>

      <main className="p-6 lg:p-12 space-y-16 max-w-[1700px] mx-auto w-full flex-grow relative z-10">
        
        {/* Terminal Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-10"
        >
          <div className="space-y-4">
            <h1 className="text-6xl font-black tracking-tighter text-gray-900 dark:text-white">
              GHM <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent">Terminal</span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="h-[2px] w-16 bg-green-600 rounded-full shadow-[0_0_10px_rgba(22,163,74,0.5)]" />
              <p className="text-gray-400 font-black tracking-[0.4em] uppercase text-[10px]">
                Autonomous Ecosystem Monitor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {alertCount > 0 && (
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="px-10 py-5 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(220,38,38,0.2)]"
              >
                {alertCount} Critical Alerts
              </motion.div>
            )}
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">System Time</span>
              <div className="px-8 py-4 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl text-xs font-black tracking-widest text-gray-900 dark:text-white shadow-sm">
                {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </div>
          </div>
        </motion.header>

        {/* UI Segments */}
        <section className="space-y-12">
          <MonitoringCards />
          <SmartAlerts alerts={activeAlerts} />
          <DataVisualization thresholds={thresholds} />
          
          {/* Bagian Data Tanaman & Dokumentasi Foto Sebelumnya Sudah Dihapus dari Sini */}
        </section>
      </main>

      {/* Pro Footer */}
      <Footer />
    </div>
  );
}