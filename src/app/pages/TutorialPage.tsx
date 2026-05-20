import { FileText, Youtube, Download, PlayCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../contexts/AppContext';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// ==========================================
// 1. DESAIN TEMPLATE DOKUMEN PDF (DOWNLOAD)
// ==========================================
const createPdfStyles = (themeColor: string) => StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#2d3748',
    lineHeight: 1.6,
  },
  headerBanner: {
    backgroundColor: themeColor || '#2E7D32',
    color: '#ffffff',
    padding: 18,
    borderRadius: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: '#e2e8f0',
  },
  metaBox: {
    backgroundColor: '#f7fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
    fontSize: 9,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: themeColor || '#2E7D32',
    marginTop: 15,
    marginBottom: 8,
    borderBottom: `1px solid ${themeColor || '#2E7D32'}`,
    paddingBottom: 2,
  },
  paragraph: {
    marginBottom: 10,
    textAlign: 'justify',
  },
  bulletList: {
    marginLeft: 12,
    marginBottom: 10,
  },
  bulletItem: {
    marginBottom: 4,
    textAlign: 'justify',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#a0aec0',
    textAlign: 'center',
    borderTop: '1px solid #e2e8f0',
    paddingTop: 5,
  }
});

// Komponen Render PDF Internal (Berdasarkan Dokumen Budidaya Buah Melon)
function SopDocument({ themeColor }: { themeColor: string }) {
  const styles = createPdfStyles(themeColor);
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerBanner}>
          <Text style={styles.title}>STANDARD OPERATING PROCEDURE (SOP)</Text>
          <Text style={styles.subtitle}>Panduan Budidaya Melon Sistem Polybag — GHM Smart Agriculture</Text>
        </View>

        {/* Metadata */}
        <View style={styles.metaBox}>
          <Text>Komoditas: Buah Melon (Cucumis melo, L) [cite: 1]</Text>
          <Text>Sistem Tanam: Polybag Khusus Lahan Sempit [cite: 2, 3]</Text>
          <Text>Rilis Dokumen: Real-time Generated System</Text>
        </View>

        {/* Konten Bagian A & B */}
        <Text style={styles.sectionTitle}>A. Alat, Bahan & Media Tanam</Text>
        <Text style={styles.paragraph}>
          Untuk memulai budidaya melon di dalam polybag, siapkan peralatan utama berupa polybag ukuran 37 cm x 40 cm, rambatan dari bambu, reng kayu ukuran 2 x 4 cm, paku ukuran 2-inch, tali rafia, selang plastik setengah inch sepanjang 10 meter, serta gunting dan pisau pemotong[cite: 4, 5, 6]. Saprodi yang diperlukan mencakup benih melon, pupuk kandang, pupuk NPK, urea, kapur, insektisida, fungisida, dan herbisida[cite: 6]. Budidaya sebaiknya dilakukan pada musim yang pas agar saat panen cuaca sedang panas[cite: 6].
        </Text>
        <Text style={styles.paragraph}>
          Media tanah untuk mengisi polybag diolah menggunakan campuran formulasi tanah, pasir, abu sekam, dan pupuk kandang dengan perbandingan volume 1 : 1 : 1[cite: 7].
        </Text>

        {/* Konten Bagian B & C */}
        <Text style={styles.sectionTitle}>B. Persemaian & Penanaman</Text>
        <Text style={styles.paragraph}>
          Bersamaan dengan pengisian polybag, lakukan penyemaian benih melon pada media pesemaian yang steril[cite: 7]. Setelah pesemaian berumur sekitar 14 hari, bibit dipindahkan ke dalam polybag dengan ketentuan satu batang tanaman untuk setiap polybag, serta diatur menggunakan jarak penempatan antar-polybag sebesar 50cm x 75 cm[cite: 8].
        </Text>

        {/* Konten Bagian D */}
        <Text style={styles.sectionTitle}>C. Protokol Pemeliharaan Tanaman</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Pemasangan Rambatan: Dilakukan saat tanaman mulai merambat atau sekitar umur 5 – 8 hari setelah tanam, sekaligus mengatur arah rambatannya[cite: 9].</Text>
          <Text style={styles.bulletItem}>• Pemangkasan Rutin: Pemangkasan wajib dilakukan setiap hari karena pertumbuhan cabang melon sangat cepat agar tidak terlalu panjang[cite: 10]. Cabang yang muncul dari ketiak daun ke-1 sampai ke-8 dipotong seluruhnya[cite: 11]. Cabang pada ketiak daun ke-9 sampai ke-13 dipelihara untuk pembuahan[cite: 11]. Setelah daun ke-13, tidak perlu ada cabang yang dipelihara lagi, dan batang utama dipotong pada daun ke-17[cite: 11].</Text>
          <Text style={styles.bulletItem}>• Regulasi Pemupukan: Pupuk dasar menggunakan pupuk Mutiara sebanyak 15 gram/polybag pada saat pengisian media[cite: 12]. Pemupukan susulan diberikan masing-masing 10 gram/polybag setiap setengah bulan sekali[cite: 12].</Text>
          <Text style={styles.bulletItem}>• Seleksi Buah & OPT: Buah yang dipelihara maksimal dua biji per pohon yang diambil dari cabang produktif ke-9 sampai ke-13[cite: 13]. Pengendalian hama (kunang-kunang, ulat pucuk) dilakukan secara fisik mekanis, sedangkan penyakit daun (antraknosa, karat daun) ditangani menggunakan fungisida Bion-M[cite: 13, 14].</Text>
        </View>

        {/* Konten Bagian E */}
        <Text style={styles.sectionTitle}>D. Indikator Panen (Varietas Sky Rocket)</Text>
        <Text style={styles.paragraph}>
          Melon mulai berbuah sejak umur 20 hari setelah tanam[cite: 15]. Buah yang dipelihara dirawat hingga umur sekitar 60 hari sampai siap panen[cite: 15]. Adapun ciri-ciri fisik buah varietas Sky Rocket yang siap panen meliputi: pola jaring (netting) pada kulit buah terlihat sudah rapat, warna kulit buah mulai putih kekuningan, terbentuk cincin atau lingkaran retak-retak pada tangkai buah, serta tercium aroma khas melon yang kuat[cite: 15, 16, 17].
        </Text>

        {/* Footer */}
        <Text style={styles.footer}>GHM Precision Agriculture Terminal • Generated Automatically System</Text>
      </Page>
    </Document>
  );
}

// ==========================================
// 2. TAMPILAN HALAMAN UTAMA (UI COMPONENT)
// ==========================================
export function TutorialPage() {
  const { themeColor } = useApp();

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 lg:p-6">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tutorial & Panduan Budidaya</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Pusat pembelajaran dan optimalisasi sistem ekosistem vegetatif GHM.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* KARTU 1: MODUL PDF AUTOMATIC GENERATION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
            <FileText className="text-emerald-600 dark:text-emerald-400" size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Modul Panduan (PDF)</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm flex-1 mb-6 text-justify">
            Dokumen komprehensif berisi standar operasional prosedur (SOP) budidaya melon sistem polybag, formulasi media tanam, regulasi nutrisi, teknik pemangkasan, dan indikator panen varietas Sky Rocket.
          </p>
          
          {/* Eksekusi PDFDownloadLink dari react-pdf */}
          <PDFDownloadLink 
            document={<SopDocument themeColor={themeColor} />} 
            fileName="SOP_Budidaya_GHM.pdf"
            className="flex items-center justify-center gap-2 w-full text-white py-3 px-4 rounded-xl font-semibold transition-colors shadow-sm hover:opacity-95 text-center"
            style={{ backgroundColor: themeColor || '#2E7D32' }}
          >
            {({ loading }) => (
              <>
                <Download size={18} />
                {loading ? 'Menyiapkan Dokumen...' : 'Unduh Modul PDF'}
              </>
            )}
          </PDFDownloadLink>
        </motion.div>

        {/* KARTU 2: YOUTUBE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col"
        >
          <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <Youtube className="text-red-600 dark:text-red-400" size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Video Tutorial</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm flex-1 mb-6 text-justify">
            Pelajari visualisasi praktis mengenai sinkronisasi instrumen lapangan, perawatan tanaman harian, dan langkah penanganan stabilitas ekosistem Green House secara interaktif.
          </p>
          
          <a 
            href="https://www.youtube.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 rounded-xl font-semibold transition-colors"
          >
            <PlayCircle size={18} className="text-red-500" />
            Tonton di YouTube
          </a>
        </motion.div>

      </div>
    </div>
  );
}