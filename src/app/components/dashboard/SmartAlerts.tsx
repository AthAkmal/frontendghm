import { motion, AnimatePresence } from 'motion/react';

export interface AlertItem {
  id: string;
  type: 'critical' | 'warning' | 'success';
  status: string;
  message: string;
  timestamp: string;
}

interface SmartAlertsProps {
  alerts: AlertItem[];
}

export function SmartAlerts({ alerts }: SmartAlertsProps) {
  const kritisCount = alerts.filter(a => a.type === 'critical').length;
  const peringatanCount = alerts.filter(a => a.type === 'warning').length;
  const normalCount = alerts.filter(a => a.type === 'success').length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm w-full">
      
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-50 dark:bg-green-900/20 text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-gray-800 dark:text-gray-100 font-bold text-lg">Smart Alert</h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs">Informasi kondisi sistem terkini</p>
          </div>
        </div>
      </div>

      {/* Ringkasan Status */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${kritisCount > 0 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>
          {kritisCount} Kritis
        </div>
        <div className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${peringatanCount > 0 ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>
          {peringatanCount} Peringatan
        </div>
        <div className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${normalCount > 0 ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>
          {normalCount} Normal
        </div>
      </div>

      {/* List Alert & Normal Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-start justify-between p-4 rounded-xl border transition-all ${
                alert.type === 'critical' ? 'bg-red-50/30 border-red-100' : 
                alert.type === 'warning' ? 'bg-orange-50/30 border-orange-100' : 
                'bg-green-50/30 border-green-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-xl mt-0.5">
                  {alert.id.includes('suhu') && '🌡️'}
                  {alert.id.includes('kelembapan') && '💧'}
                  {alert.id.includes('nutrisi') && '🧪'}
                  {alert.id.includes('ph') && '⚖️'}
                  {alert.id.includes('airLevel') && '🌊'}
                </div>
                <div>
                  <p className="text-gray-800 dark:text-gray-200 font-semibold text-sm">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                      alert.type === 'critical' ? 'bg-red-100 text-red-600' : 
                      alert.type === 'warning' ? 'bg-orange-100 text-orange-600' : 
                      'bg-green-100 text-green-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                        alert.type === 'critical' ? 'bg-red-500' : 
                        alert.type === 'warning' ? 'bg-orange-500' : 
                        'bg-green-500'
                      }`}></span>
                      {alert.status}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase font-medium">{alert.timestamp}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}