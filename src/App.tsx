import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from './firebase'; // Pastikan file firebase.ts kamu export 'database'
import snarkdown from 'snarkdown';

interface AuditData {
  nodeId: string;
  nodeName: string;
  hasilAudit: string;
  timestamp: number;
  status: string;
  nodeImage?: string;
  fileKey?: string;
}

function App() {
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'ui' | 'dev'>('all');

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

  const renderCleanMarkdown = (rawText: string) => {
    if (!rawText) return '';
    const cleanLines = rawText
      .split('\n')
      .map(line => line.trim())
      .join('\n');
      
    return snarkdown(cleanLines);
  };

  const getFilteredAudit = (fullText: string) => {
    if (!fullText) return '';
    if (activeTab === 'all') return fullText;

    return fullText
      .split('\n')
      .filter(line => {
        const lower = line.toLowerCase();
        if (activeTab === 'ui') {
          return !lower.includes('rekomendasi teknis');
        }
        if (activeTab === 'dev') {
          return !lower.includes('rekomendasi solutif');
        }
        return true;
      })
      .join('\n');
  };

  const figmaDeepLink = auditData?.fileKey && auditData?.nodeId 
    ? `https://www.figma.com/design/${auditData.fileKey}?node-id=${auditData.nodeId.replace(':', '-')}`
    : null;

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

        {/* Panduan Audit */}
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

          <p style={{ 
            margin: '0 0 14px 0', 
            fontSize: '13px', 
            color: '#475569', 
            lineHeight: '1.6',
            textAlign: 'justify' 
          }}>
            Asisten AI ini bertindak sebagai <strong>Co-Pilot UX</strong> yang menganalisis data struktural antarmuka dari Figma secara otomatis berdasarkan kerangka kerja <strong>10 Nielsen Usability Heuristics</strong>.
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
            gap: '12px',
            fontSize: '12px',
            color: '#334155',
            lineHeight: '1.5',
            textAlign: 'justify'
          }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <strong style={{ color: '#2563eb', display: 'block', marginBottom: '4px' }}>
                1. Analisis Kognitif & Semantik
              </strong>
              AI mengevaluasi konteks teks (UX Writing), hirarki informasi, visibilitas elemen interaktif, serta konsistensi alur informasi dari sudut pandang pengguna.
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <strong style={{ color: '#2563eb', display: 'block', marginBottom: '4px' }}>
                2. Fokus Antarmuka Fungsional
              </strong>
              AI dirancang spesifik untuk menganalisis layar aplikasi/website nyata. Asset dekoratif atau gambar presentasi akan tetap dievaluasi berdasarkan standar baku UI.
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <strong style={{ color: '#2563eb', display: 'block', marginBottom: '4px' }}>
                3. Filter Objek Visual
              </strong>
              Sistem secara otomatis menyaring elemen dekoratif berat dan hanya berfokus pada konten visual yang berada di dalam batas tampilan layar aktif.
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <strong style={{ color: '#2563eb', display: 'block', marginBottom: '4px' }}>
                4. Peran Hasil Audit
              </strong>
              Laporan ini berfungsi sebagai <em>Preventive Draft</em> untuk membantu desainer sebelum tahap <em>handoff</em>, serta mempercepat kerja Auditor UX.
            </div>
          </div>

          <div style={{ 
            marginTop: '14px', 
            paddingTop: '10px', 
            borderTop: '1px dashed #cbd5e1', 
            fontSize: '11px', 
            color: '#64748b',
            textAlign: 'justify'
          }}>
            * <strong>Catatan Penggunaan:</strong> Jika Anda memperbaiki temuan dan melakukan audit ulang, AI dapat melakukan evaluasi berlapis untuk memeriksa detail interaksi yang lebih dalam.
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            Menghubungkan ke Firebase Cloud...
          </div>
        ) : auditData ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Kartu Status & Pratinjau Komponen */}
            <div style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.06)',
              borderLeft: '6px solid #4f46e5',
              display: 'flex',
              gap: '24px',
              flexWrap: 'wrap'
            }}>
              
              <div style={{ flex: '1 1 300px' }}>
                <h2 style={{ fontSize: '18px', margin: '0 0 16px 0', color: '#1e293b' }}>
                  📋 Informasi Komponen Terakhir
                </h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '8px 0', color: '#64748b', width: '140px' }}>Nama Elemen</td>
                      <td style={{ padding: '8px 0', fontWeight: 'bold', color: '#0f172a' }}>: {auditData.nodeName}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>ID Node</td>
                      <td style={{ padding: '8px 0', fontFamily: 'monospace', color: '#334155' }}>: {auditData.nodeId}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>Waktu Audit</td>
                      <td style={{ padding: '8px 0', color: '#334155' }}>
                        : {new Date(auditData.timestamp).toLocaleString('id-ID')} WIB
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>Status Analisis</td>
                      <td style={{ padding: '8px 0' }}>
                        : <span style={{
                            backgroundColor: auditData.status === 'success' ? '#dcfce7' : '#fee2e2',
                            color: auditData.status === 'success' ? '#15803d' : '#b91c1c',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {auditData.status.toUpperCase()}
                          </span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ marginTop: '16px' }}>
                  {figmaDeepLink ? (
                    <a 
                      href={figmaDeepLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        display: 'inline-block', padding: '8px 16px', backgroundColor: '#0ea5e9', 
                        color: '#ffffff', textDecoration: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '13px' 
                      }}
                    >
                      Buka di Figma
                    </a>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
                      * Jump to Node aktif jika berkas tersimpan di akun Figma Cloud.
                    </span>
                  )}
                </div>
              </div>

              <div style={{ flex: '0 0 200px', textAlign: 'center', alignSelf: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
                  PRATINJAU VISUAL
                </span>
                {auditData.nodeImage ? (
                  <img 
                    src={auditData.nodeImage} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: '140px', borderRadius: '6px', border: '1px solid #cbd5e1', objectFit: 'contain' }}
                  />
                ) : (
                  <div style={{ padding: '20px', background: '#f1f5f9', borderRadius: '6px', color: '#94a3b8', fontSize: '12px' }}>
                    Pratinjau tidak tersedia
                  </div>
                )}
              </div>

            </div>

            {/* Menu Navigasi Tab */}
            <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
              <button 
                onClick={() => setActiveTab('all')}
                style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px', backgroundColor: activeTab === 'all' ? '#1e293b' : '#f1f5f9', color: activeTab === 'all' ? '#ffffff' : '#64748b' }}
              >
                Semua Laporan
              </button>
              <button 
                onClick={() => setActiveTab('ui')}
                style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px', backgroundColor: activeTab === 'ui' ? '#0284c7' : '#f1f5f9', color: activeTab === 'ui' ? '#ffffff' : '#64748b' }}
              >
                🎨 Rekomendasi Desainer
              </button>
              <button 
                onClick={() => setActiveTab('dev')}
                style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px', backgroundColor: activeTab === 'dev' ? '#16a34a' : '#f1f5f9', color: activeTab === 'dev' ? '#ffffff' : '#64748b' }}
              >
                💻 Rekomendasi Developer
              </button>
            </div>

            {/* Kartu Hasil Rekomendasi AI */}
            <div style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.06)'
            }}>
              <h2 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#1e293b' }}>
                Hasil Analisis & Rekomendasi Pakar AI
              </h2>
              
              <div 
                style={{
                  background: '#f8fafc',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  lineHeight: '1.7',
                  color: '#334155',
                  fontFamily: 'inherit',
                  textAlign: 'justify',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  overflowX: 'hidden',
                  whiteSpace: 'normal', 
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}
                dangerouslySetInnerHTML={{ __html: renderCleanMarkdown(getFilteredAudit(auditData.hasilAudit || '')) }}
              />
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
          white-space: normal !important;
        }
        div[dangerouslySetInnerHTML] pre, div[dangerouslySetInnerHTML] code {
          background: transparent !important;
          color: inherit !important;
          white-space: pre-wrap !important;
          word-break: break-word !important;
        }
      `}</style>
    </div>
  );
}

export default App;