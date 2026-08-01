import { useEffect, useState, useMemo } from 'react';
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

const DICTIONARY = {
  id: {
    headerTitle: "UI/UX Heuristic Evaluation Dashboard",
    headerSubtitle: "Evaluasi Antarmuka Komponen Figma Secara Real-Time",
    guideTitle: "Panduan & Cara Kerja Audit Heuristik AI",
    guideIntro: "Asisten AI ini bertindak sebagai ",
    guideCoPilot: "Co-Pilot UX",
    guideIntro2: " yang menganalisis data struktural antarmuka dari Figma secara otomatis berdasarkan kerangka kerja ",
    guideNielsen: "10 Nielsen Usability Heuristics",
    point1Title: "1. Analisis Kognitif & Semantik",
    point1Desc: "AI mengevaluasi konteks teks (UX Writing), hirarki informasi, visibilitas elemen interaktif, serta konsistensi alur informasi dari sudut pandang pengguna.",
    point2Title: "2. Fokus Antarmuka Fungsional",
    point2Desc: "AI dirancang spesifik untuk menganalisis layar aplikasi/website nyata. Asset dekoratif atau gambar presentasi akan tetap dievaluasi berdasarkan standar baku UI.",
    point3Title: "3. Filter Objek Visual",
    point3Desc: "Sistem secara otomatis menyaring elemen dekoratif berat dan hanya berfokus pada konten visual yang berada di dalam batas tampilan (viewport) layar aktif.",
    point4Title: "4. Peran Hasil Audit",
    point4Desc: "Laporan ini berfungsi sebagai Preventive Draft untuk membantu desainer sebelum tahap handoff, serta mempercepat kerja Auditor UX.",
    guideNote: "* Catatan Penggunaan: Jika Anda memperbaiki temuan dan melakukan audit ulang, AI dapat melakukan evaluasi berlapis untuk memeriksa detail interaksi yang lebih dalam.",
    loading: "Menghubungkan ke Firebase Cloud...",
    infoTitle: "Informasi Audit Terakhir",
    infoTime: "Waktu Sinkronisasi",
    infoStatus: "Status Analisis",
    filterLabel: "Tampilkan Laporan Untuk:",
    filterAll: "Semua Frame",
    tabAll: "Semua Laporan",
    tabDesigner: "Rekomendasi Desainer",
    tabDeveloper: "Rekomendasi Developer",
    emptyState: "Belum ada data audit yang masuk. Silakan jalankan plugin di Figma."
  },
  en: {
    headerTitle: "UI/UX Heuristic Evaluation Dashboard",
    headerSubtitle: "Real-Time Figma Component Interface Evaluation",
    guideTitle: "AI Heuristic Audit Guide & Workflow",
    guideIntro: "This AI Assistant acts as a ",
    guideCoPilot: "UX Co-Pilot",
    guideIntro2: " that automatically analyzes structural interface data from Figma based on the ",
    guideNielsen: "10 Nielsen Usability Heuristics",
    point1Title: "1. Cognitive & Semantic Analysis",
    point1Desc: "The AI evaluates text context (UX Writing), information hierarchy, interactive element visibility, and information flow consistency from a user's perspective.",
    point2Title: "2. Functional Interface Focus",
    point2Desc: "The AI is specifically designed to analyze real app/website screens. Heavy decorative assets or presentation images are still evaluated against standard UI practices.",
    point3Title: "3. Visual Object Filter",
    point3Desc: "The system automatically filters out heavy decorative elements, focusing only on visual content within the active screen viewport.",
    point4Title: "4. Audit Result Role",
    point4Desc: "This report serves as a Preventive Draft to assist designers before handoff and to accelerate the work of UX Auditors.",
    guideNote: "* Usage Note: If you resolve findings and re-audit, the AI can perform layered evaluations to inspect deeper interaction details.",
    loading: "Connecting to Firebase Cloud...",
    infoTitle: "Latest Audit Information",
    infoTime: "Sync Time",
    infoStatus: "Analysis Status",
    filterLabel: "Show Report For:",
    filterAll: "All Frames",
    tabAll: "All Reports",
    tabDesigner: "Designer Recommendations",
    tabDeveloper: "Developer Recommendations",
    emptyState: "No audit data received yet. Please run the Figma plugin."
  }
};

function App() {
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'all' | 'designer' | 'developer'>('all');
  const [selectedFrame, setSelectedFrame] = useState<string>('ALL');
  const [language, setLanguage] = useState<'id' | 'en'>('id'); 

  useEffect(() => {
    const auditRef = ref(database, 'current_audit');
    const unsubscribe = onValue(auditRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setAuditData(data);
      setLoading(false);
    }, (error) => {
      console.error("Firebase read error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Memisahkan fungsi parser ke luar dependency cycle
  const parseAuditData = (rawText: string, fallbackName: string): ParsedFrame[] => {
    if (!rawText) return [];
    
    // Fallback jika format AI meleset dari prompt
    if (!rawText.includes('Frame:')) {
      return [{ name: fallbackName, content: rawText }];
    }

    // Regex diperbarui: Kebal terhadap format markdown (#, ##) dan emoji yang tidak konsisten
    const segments = rawText.split(/#{1,3}\s*(?:🖼️)?\s*Frame:\s*/i);
    const result: ParsedFrame[] = [];

    for (const seg of segments) {
      if (!seg.trim()) continue;
      const lines = seg.trim().split('\n');
      
      const name = lines[0].replace(/[*_#\[\]]/g, '').trim(); 
      const content = lines.slice(1).join('\n').replace(/^---/gm, '').trim(); 
      
      if (name) result.push({ name, content });
    }

    return result;
  };

  // Optimasi performa menggunakan useMemo untuk mencegah parse ulang saat ganti tab/bahasa
  const parsedFrames = useMemo(() => {
    return parseAuditData(auditData?.hasilAudit || '', auditData?.nodeName || 'Unknown');
  }, [auditData]);

  const displayedFrames = useMemo(() => {
    return selectedFrame === 'ALL' 
      ? parsedFrames 
      : parsedFrames.filter(f => f.name === selectedFrame);
  }, [parsedFrames, selectedFrame]);

  const getFilteredContent = (content: string, tab: 'all' | 'designer' | 'developer') => {
    if (tab === 'all') return content;

    return content.split('\n').filter(line => {
      const lowerLine = line.toLowerCase();
      if (tab === 'designer') {
        return !lowerLine.includes('developer') && !lowerLine.includes('teknis') && !lowerLine.includes('technical');
      }
      if (tab === 'developer') {
        return !lowerLine.includes('desainer') && !lowerLine.includes('designer') && 
               !lowerLine.includes('solutif') && !lowerLine.includes('kognitif') && 
               !lowerLine.includes('cognitive');
      }
      return true;
    }).join('\n');
  };

  const renderCleanMarkdown = (rawText: string) => {
    if (!rawText) return '';
    const cleanLines = rawText.split('\n').map(line => line.trim()).join('\n');
    
    // Security Note: Penggunaan snarkdown langsung direkomendasikan untuk dibungkus 
    // dengan library DOMPurify di environment production untuk mitigasi XSS.
    return snarkdown(cleanLines);
  };

  const t = DICTIONARY[language];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f5f7fb', minHeight: '100vh', padding: '40px 20px', color: '#333', textAlign: 'left' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
        <header style={{ marginBottom: '24px', borderBottom: '2px solid #e0e6ed', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', color: '#1e293b', margin: '0 0 8px 0' }}>{t.headerTitle}</h1>
            <p style={{ color: '#64748b', margin: 0 }}>{t.headerSubtitle}</p>
          </div>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'id' | 'en')}
            style={{ padding: '8px 12px', fontSize: '14px', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#ffffff', color: '#1e293b', cursor: 'pointer', fontWeight: 'bold', outline: 'none', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
          >
            <option value="id">ID (Indonesia)</option>
            <option value="en">EN (English)</option>
          </select>
        </header>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: '600' }}>{t.guideTitle}</h3>
          </div>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#475569', lineHeight: '1.6', textAlign: 'justify' }}>
            {t.guideIntro} <strong>{t.guideCoPilot}</strong> {t.guideIntro2} <strong>{t.guideNielsen}</strong>.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', fontSize: '12px', color: '#334155', lineHeight: '1.5', textAlign: 'justify' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <strong style={{ color: '#2563eb', display: 'block', marginBottom: '4px' }}>{t.point1Title}</strong>{t.point1Desc}
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <strong style={{ color: '#2563eb', display: 'block', marginBottom: '4px' }}>{t.point2Title}</strong>{t.point2Desc}
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <strong style={{ color: '#2563eb', display: 'block', marginBottom: '4px' }}>{t.point3Title}</strong>{t.point3Desc}
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <strong style={{ color: '#2563eb', display: 'block', marginBottom: '4px' }}>{t.point4Title}</strong>{t.point4Desc}
            </div>
          </div>
          <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1', fontSize: '11px', color: '#64748b', textAlign: 'justify' }}>
            {t.guideNote}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>{t.loading}</div>
        ) : auditData ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderLeft: '6px solid #4f46e5', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', margin: '0 0 16px 0', color: '#1e293b' }}>{t.infoTitle}</h2>
                <table style={{ borderCollapse: 'collapse', fontSize: '14px' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '4px 0', color: '#64748b', width: '150px' }}>{t.infoTime}</td>
                      <td style={{ padding: '4px 0', color: '#334155', fontWeight: 'bold' }}>
                        : {new Date(auditData.timestamp).toLocaleString(language === 'id' ? 'id-ID' : 'en-US')}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 0', color: '#64748b' }}>{t.infoStatus}</td>
                      <td style={{ padding: '4px 0' }}>
                        : <span style={{ backgroundColor: auditData.status === 'success' ? '#dcfce7' : '#fee2e2', color: auditData.status === 'success' ? '#15803d' : '#b91c1c', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                            {auditData.status.toUpperCase()}
                          </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ minWidth: '220px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px' }}>{t.filterLabel}</label>
                <select
                  value={selectedFrame}
                  onChange={(e) => setSelectedFrame(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', fontSize: '14px', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="ALL">{t.filterAll} ({parsedFrames.length})</option>
                  {parsedFrames.map((f, i) => (
                    <option key={i} value={f.name}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => setActiveTab('all')}
                  style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', border: 'none', backgroundColor: activeTab === 'all' ? '#1e293b' : '#f1f5f9', color: activeTab === 'all' ? '#ffffff' : '#64748b', transition: 'all 0.2s' }}>
                  {t.tabAll}
                </button>
                <button 
                  onClick={() => setActiveTab('designer')}
                  style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', border: 'none', backgroundColor: activeTab === 'designer' ? '#1e293b' : '#f1f5f9', color: activeTab === 'designer' ? '#ffffff' : '#64748b', transition: 'all 0.2s' }}>
                  {t.tabDesigner}
                </button>
                <button 
                  onClick={() => setActiveTab('developer')}
                  style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', border: 'none', backgroundColor: activeTab === 'developer' ? '#1e293b' : '#f1f5f9', color: activeTab === 'developer' ? '#ffffff' : '#64748b', transition: 'all 0.2s' }}>
                  {t.tabDeveloper}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {displayedFrames.map((frame, index) => (
                  <div key={index} style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    {parsedFrames.length > 1 && (
                      <h3 style={{ margin: '0 0 16px 0', color: '#0f172a', fontSize: '18px', borderBottom: '2px solid #cbd5e1', paddingBottom: '8px' }}>
                        Frame: <span style={{ color: '#2563eb' }}>{frame.name}</span>
                      </h3>
                    )}
                    <div 
                      style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155', textAlign: 'justify', wordBreak: 'break-word' }}
                      dangerouslySetInnerHTML={{ __html: renderCleanMarkdown(getFilteredContent(frame.content, activeTab)) }}
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', textAlign: 'center', color: '#64748b', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            {t.emptyState}
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
        }
        div[dangerouslySetInnerHTML] h3, div[dangerouslySetInnerHTML] h4 {
          color: #1e293b !important;
          margin-top: 20px !important;
          margin-bottom: 10px !important;
        }
        div[dangerouslySetInnerHTML] strong {
          color: #0f172a;
        }
      `}</style>
    </div>
  );
}

export default App;
