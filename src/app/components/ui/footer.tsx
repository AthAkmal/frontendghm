import { motion } from 'motion/react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Data Geografis Spesifik
  const coordinates = "8°1'59.94077\"S 112°29'51.82897\"E";
  const decimalCoords = "-8.033317, 112.497730"; // Konversi desimal untuk link
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${decimalCoords}`;

  return (
    <footer className="relative mt-auto overflow-hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900">
      
      {/* 1. Top Animated Border */}
      <motion.div 
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className="h-[3px] w-full bg-[length:200%_auto] bg-gradient-to-r from-transparent via-emerald-500 via-green-400 to-transparent opacity-60" 
      />

      {/* 2. Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.08, 0.03] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-green-500/20 blur-[150px] rounded-full" 
         />
      </div>

      <div className="max-w-[1700px] mx-auto px-6 lg:px-12 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          
          {/* KOLOM KIRI: Terminal Branding */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <motion.div 
                whileHover={{ rotate: 90, scale: 1.1 }}
                className="w-16 h-16 bg-gradient-to-br from-gray-900 to-black dark:from-white dark:to-gray-200 rounded-2xl flex items-center justify-center shadow-2xl relative group"
              >
                <div className="absolute inset-0 bg-green-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
                <span className="text-white dark:text-green-800 font-black text-3xl relative z-10">G</span>
              </motion.div>
              <div>
                <h2 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">
                  GHM<span className="text-green-500 animate-pulse">.</span>
                </h2>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-green-600/80 mt-2">
                  Precision Agriculture Terminal
                </p>
              </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-sm font-medium mx-auto lg:mx-0 text-justify">
              Sistem ini merupakan pusat integrasi teknologi untuk manajemen lingkungan budidaya varietas unggul GHM. Berfokus pada optimalisasi pertumbuhan melalui sinkronisasi data sensorik secara real-time, protokol ini dirancang untuk memastikan stabilitas ekosistem di wilayah Plaosan.
            </p>
          </div>

          {/* KOLOM TENGAH: Detailed Geography & Interactive Maps */}
          <div className="space-y-8 px-0 lg:px-8 lg:border-x border-gray-100 dark:border-gray-900/50">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-green-500/50" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 shrink-0">Geographic Data</h3>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-green-500/50" />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Site Name</span>
                  <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider italic">Desa Plaosan</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">District</span>
                  <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider italic">Wonosari, Malang</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Timezone</span>
                  <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">WIB (UTC +7)</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Elevation</span>
                  <p className="text-xs font-bold text-green-600 uppercase tracking-wider">~450M ASL</p>
                </div>
              </div>
            </div>

            {/* Clickable Live Coordination */}
            <motion.a 
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              className="block p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 group/map cursor-pointer transition-colors hover:border-green-500/30"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 group-hover/map:bg-green-500 transition-colors">
                  <svg className="w-5 h-5 text-green-600 group-hover/map:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Live Coordinates</span>
                  <span className="text-[11px] font-mono font-bold text-gray-700 dark:text-gray-300 group-hover/map:text-green-500 transition-colors">
                    {coordinates}
                  </span>
                </div>
              </div>
            </motion.a>
          </div>

          {/* KOLOM KANAN: High-Impact Status */}
          <div className="flex flex-col items-center lg:items-end gap-6">
            <div className="relative p-[1px] rounded-[32px] bg-gradient-to-br from-green-500/40 via-transparent to-emerald-500/40 w-full max-w-[300px]">
              <div className="bg-white/80 dark:bg-gray-950/90 backdrop-blur-2xl px-10 py-8 rounded-[31px] border border-white/20 dark:border-gray-800 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-[9px] font-black tracking-[0.4em] uppercase text-green-600">Active Node</span>
                </div>
                
                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-green-600 dark:from-white dark:to-green-400 tracking-tighter">
                  100%
                </span>
                
                <div className="w-full h-1 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden mt-4">
                  <motion.div 
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    className="h-full w-1/3 bg-gradient-to-r from-transparent via-green-500 to-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM METADATA */}
        <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
            <p className="text-gray-400 text-[10px] font-black tracking-[0.3em] uppercase">
              © {currentYear} GHM TERMINAL • <span className="text-green-600">MALANG DEPLOYMENT</span>
            </p>
            <span className="hidden md:inline text-gray-300 dark:text-gray-800">|</span>
            <p className="text-gray-500 dark:text-gray-400 text-[10px] font-bold tracking-wider uppercase">
              by : KKN Sistem Komputer Institut Asia Malang 2026
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black tracking-widest uppercase">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Stable Environment
            </div>
            <span className="text-gray-300 dark:text-gray-700 font-mono text-[10px]">v2.4.0_PLAOSAN_CORE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}