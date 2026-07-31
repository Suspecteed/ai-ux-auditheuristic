import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from './firebase';
import snarkdown from 'snarkdown';

interface AuditData {
  nodeId: string;
  nodeName: string;
  hasilAudit: string;
  timestamp: number;
  status: string;
}

interface ParsedFrame {
  name: string;
  content: string;
}

function App() {
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State untuk Tab & Filter
  const [activeTab, setActiveTab] = useState<'all' | 'designer' | 'developer'>('all');
  const [selectedFrame, setSelectedFrame] = useState<string>('ALL');

  useEffect(() => {
    const auditRef = ref(database, 'current_audit');

    const unsubscribe = onValue(auditRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAuditData(data);
      }
      setLoading(false);
    }, (error) => {
      console.error("Gagal membaca Firebase:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fungsi Memecah Markdown Berdasarkan Frame
  const parseAuditData = (rawText: string, fallbackName: string): ParsedFrame[] => {
    if (!rawText) return [];

    // Jika AI tidak memecah frame (hanya ada 1 frame tunggal tanpa judul emoji)
    if (!rawText.includes('🖼️ Frame:')) {
      return [{ name: fallbackName, content: rawText }];
    }

    // Pisahkan teks berdasarkan pattern judul frame
    const segments = rawText.split(/##?\s*🖼️\s*Frame:\s*/);
    const result: ParsedFrame[] = [];

    for (const seg of segments) {
      if (!seg.trim()) continue;
      const lines = seg.trim().split('\n');
      
      // Baris pertama pasti nama frame (bersihkan dari karakter aneh jika ada)
      const name = lines[0].replace(/[*_#\[\]]/g, '').trim(); 
      // Sisanya adalah konten markdown
      const content = lines.slice(1).join('\n').replace(/^---/gm, '').trim(); 
      
      result.push({ name, content });
    }

    return result;
  };

  // 2. Fungsi Memfilter Baris Markdown Berdasarkan Tab
  const getFilteredContent = (content: string, tab: 'all' | 'designer' | 'developer') => {
    if (tab === 'all') return content;

    return content.split('\n').filter(line => {
      const lowerLine = line.toLowerCase();
      if (tab === 'designer') {
        // Hilangkan bagian developer
        return !lowerLine.includes('rekomendasi teknis (untuk developer');
      }
      if (tab === 'developer') {
        // Hilangkan bagian desainer dan analisis kognitif
        return !lowerLine.includes('rekomendasi solutif (untuk desainer') && 
               !lowerLine.includes('analisis kognitif pakar');
      }
      return true;
    }).join('\n');
  };

  const renderCleanMarkdown = (rawText: string) => {
    if (!rawText) return '';
    const cleanLines = rawText.split('\n').map(line => line.trim()).join('\n');
    return snarkdown(cleanLines);
  };

  // Data yang sudah diproses & siap ditampilkan
  const parsedFrames = parseAuditData(auditData?.hasilAudit || '', auditData?.nodeName || 'Unknown');
  const displayedFrames = selectedFrame === 'ALL' 
    ? parsedFrames 
    : parsedFrames.filter(f => f.name === selectedFrame);

  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#f5f7fb',
      minHeight: '100vh',
      padding: '40px 20px',
      color: '#333',
      textAlign: 'left' 
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
        {/* Header Dashboard */}
        <header style={{ marginBottom: '24px', borderBottom: '2px solid #e0e6ed', paddingBottom: '20px' }}>
          <h1 style={{ fontSize: '28px', color: '#1e293b', margin: '0 0 8px 0' }}>
            UI/UX Heuristic Evaluation Dashboard
          </h1>
          <p style={{ color: '#64748b', margin: 0 }}>
            Evaluasi Antarmuka Komponen Figma Secara Real-Time
          </p>
        </header>

        {/*(KARTU PANDUAN TETAP SAMA SEPERTI KODEMU SEBELUMNYA)*/}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '18px' }}>💡</span>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: '600' }}>
              Panduan & Cara Kerja Audit Heuristik AI
            </h3>
          </div>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#475569', lineHeight: '1.6', textAlign: 'justify' }}>
            Asisten AI ini bertindak sebagai <strong>Co-Pilot UX</strong> yang menganalisis data struktural antarmuka dari Figma secara otomatis berdasarkan kerangka kerja <strong>10 Nielsen Usability Heuristics</strong>.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', fontSize: '12px', color: '#334155', lineHeight: '1.5', textAlign: 'justify' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <strong style={{ color: '#2563eb', display: 'block', marginBottom: '4px' }}>1. Analisis Kognitif & Semantik</strong>
              AI mengevaluasi konteks teks (UX Writing), hirarki informasi, visibilitas elemen interaktif, serta konsistensi alur informasi dari sudut pandang pengguna.
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <strong style={{ color: '#2563eb', display: 'block', marginBottom: '4px' }}>2. Fokus Antarmuka Fungsional</strong>
              AI dirancang spesifik untuk menganalisis layar aplikasi/website nyata. Asset dekoratif atau gambar presentasi (seperti <em>Dribbble Showcase/Cover</em>) akan tetap dievaluasi berdasarkan standar baku UI.
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <strong style={{ color: '#2563eb', display: 'block', marginBottom: '4px' }}>3. Filter Objek Visual</strong>
              Sistem secara otomatis menyaring elemen dekoratif berat dan hanya berfokus pada konten visual yang berada di dalam batas tampilan (viewport) layar aktif.
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <strong style={{ color: '#2563eb', display: 'block', marginBottom: '4px' }}>4. Peran Hasil Audit</strong>
              Laporan ini berfungsi sebagai <em>Preventive Draft</em> untuk membantu desainer sebelum tahap <em>handoff</em>, serta mempercepat kerja Auditor UX.
            </div>
          </div>
          <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1', fontSize: '11px', color: '#64748b', textAlign: 'justify' }}>
            * <strong>Catatan Penggunaan:</strong> Jika Anda memperbaiki temuan dan melakukan audit ulang, AI dapat melakukan evaluasi berlapis untuk memeriksa detail interaksi yang lebih dalam.
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            Menghubungkan ke Firebase Cloud...
          </div>
        ) : auditData ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Kartu Status Informasi Komponen & COMBOBOX */}
            <div style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.06)',
              borderLeft: '6px solid #4f46e5',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              <div>
                <h2 style={{ fontSize: '18px', margin: '0 0 16px 0', color: '#1e293b' }}>
                  📋 Informasi Audit Terakhir
                </h2>
                <table style={{ borderCollapse: 'collapse', fontSize: '14px' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '4px 0', color: '#64748b', width: '150px' }}>Waktu Sinkronisasi</td>
                      <td style={{ padding: '4px 0', color: '#334155', fontWeight: 'bold' }}>
                        : {new Date(auditData.timestamp).toLocaleString('id-ID')} WIB
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 0', color: '#64748b' }}>Status Analisis</td>
                      <td style={{ padding: '4px 0' }}>
                        : <span style={{
                            backgroundColor: auditData.status === 'success' ? '#dcfce7' : '#fee2e2',
                            color: auditData.status === 'success' ? '#15803d' : '#b91c1c',
                            padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold'
                          }}>
                            {auditData.status.toUpperCase()}
                          </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* TAMPILAN COMBOBOX FILTER FRAME */}
              <div style={{ minWidth: '220px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px' }}>
                  Tampilkan Laporan Untuk:
                </label>
                <select
                  value={selectedFrame}
                  onChange={(e) => setSelectedFrame(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc',
                    color: '#0f172a',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="ALL">Semua Frame ({parsedFrames.length})</option>
                  {parsedFrames.map((f, i) => (
                    <option key={i} value={f.name}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* AREA TAB & HASIL ANALISIS */}
            <div style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.06)'
            }}>
              
              {/* HEADER TABS BAR */}
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                borderBottom: '2px solid #e2e8f0', 
                paddingBottom: '16px',
                marginBottom: '20px',
                flexWrap: 'wrap'
              }}>
                <button 
                  onClick={() => setActiveTab('all')}
                  style={{
                    padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', border: 'none',
                    backgroundColor: activeTab === 'all' ? '#1e293b' : '#f1f5f9',
                    color: activeTab === 'all' ? '#ffffff' : '#64748b',
                    transition: 'all 0.2s'
                  }}>
                  📑 Semua Laporan
                </button>
                <button 
                  onClick={() => setActiveTab('designer')}
                  style={{
                    padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', border: 'none',
                    backgroundColor: activeTab === 'designer' ? '#1e293b' : '#f1f5f9',
                    color: activeTab === 'designer' ? '#ffffff' : '#64748b',
                    transition: 'all 0.2s'
                  }}>
                  🎨 Rekomendasi Desainer
                </button>
                <button 
                  onClick={() => setActiveTab('developer')}
                  style={{
                    padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', border: 'none',
                    backgroundColor: activeTab === 'developer' ? '#1e293b' : '#f1f5f9',
                    color: activeTab === 'developer' ? '#ffffff' : '#64748b',
                    transition: 'all 0.2s'
                  }}>
                  💻 Rekomendasi Developer
                </button>
              </div>

              {/* DAFTAR FRAME YANG DIRENDER */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {displayedFrames.map((frame, index) => (
                  <div key={index} style={{
                    background: '#f8fafc',
                    padding: '24px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                  }}>
                    {/* Judul Frame (Jika lebih dari 1 Frame / Spesifik) */}
                    {parsedFrames.length > 1 && (
                      <h3 style={{ 
                        margin: '0 0 16px 0', 
                        color: '#0f172a', 
                        fontSize: '18px', 
                        borderBottom: '2px solid #cbd5e1', 
                        paddingBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        🖼️ Frame: <span style={{ color: '#2563eb' }}>{frame.name}</span>
                      </h3>
                    )}

                    {/* Hasil Markdown untuk Frame tersebut */}
                    <div 
                      style={{
                        fontSize: '14px',
                        lineHeight: '1.7',
                        color: '#334155',
                        textAlign: 'justify', 
                        wordBreak: 'break-word',
                      }}
                      dangerouslySetInnerHTML={{ 
                        __html: renderCleanMarkdown(getFilteredContent(frame.content, activeTab)) 
                      }}
                    />
                  </div>
                ))}
              </div>

            </div>

          </div>
        ) : (
          <div style={{
            background: '#fff',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center',
            color: '#64748b',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
          }}>
            Belum ada data audit yang masuk. Silakan buka Figma dan klik tombol "Mulai Audit UX" pada plugin Anda!
          </div>
        )}
      </div>
      
      {/* CSS Internal untuk Komponen Markdown (Styling Tabel, List, Header) */}
      <style>{`
        div[dangerouslySetInnerHTML] p, div[dangerouslySetInnerHTML] li {
          text-align: justify !important;
        }
        div[dangerouslySetInnerHTML] ul, div[dangerouslySetInnerHTML] ol {
          padding-left: 20px !important;
          margin: 10px 0 !important;
        }
        div[dangerouslySetInnerHTML] li {
          margin-bottom: 8px !important;
        }
        div[dangerouslySetInnerHTML] h3, div[dangerouslySetInnerHTML] h4 {
          color: '#1e293b' !important;
          margin-top: '20px' !important;
          margin-bottom: '10px' !important;
        }
        div[dangerouslySetInnerHTML] strong {
          color: #0f172a;
        }
      `}</style>
    </div>
  );
}

export default App;
