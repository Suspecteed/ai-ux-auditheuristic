import { useEffect, useState, useMemo } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from './firebase'; 
import './App.css';
import { DICTIONARY } from './utils/dictionary';
import { parseAuditData } from './utils/helpers'; // getHeuristicStatus sudah bisa dihapus
import type { AuditData } from './utils/helpers';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import KpiBoard from './components/KpiBoard';
import FrameList from './components/FrameList';
import AnalysisDetail from './components/AnalysisDetail';

function App() {
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFrame, setSelectedFrame] = useState<string>('ALL');
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const t = DICTIONARY[language];
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const closeDrawer = () => setIsDrawerOpen(false);

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

  const parsedFrames = useMemo(() => {
    return parseAuditData(auditData?.hasilAudit || '', auditData?.nodeName || 'Unknown');
  }, [auditData]);

  const activeFrameData = useMemo(() => {
    if (!parsedFrames || parsedFrames.length === 0) return undefined;

    if (selectedFrame === 'ALL') {
      return {
        name: t.allFrames || 'Semua Frame',
        content: parsedFrames.map(f => `### Frame: ${f.name}\n${f.content}`).join('\n\n---\n\n')
      };
    }

    return parsedFrames.find(f => f.name === selectedFrame) || parsedFrames[0];
  }, [parsedFrames, selectedFrame, t]);

  // 👇 INI BAGIAN YANG DIPERBARUI (Menggunakan JSON issuesData) 👇
  const kpiStats = useMemo(() => {
    let critical = 0;
    let major = 0;
    let minor = 0;

    // 1. Hitung jumlah masalah langsung dari JSON AI (Akurat 100%)
    if (auditData?.issuesData && Array.isArray(auditData.issuesData)) {
      auditData.issuesData.forEach(issue => {
        if (issue.badgeColor.includes('🔴')) critical++;
        else if (issue.badgeColor.includes('🟡')) major++;
        else if (issue.badgeColor.includes('🟢')) minor++;
      });
    }

    const totalFrames = parsedFrames.length || 0;
    
    // 2. Hitung Pass Rate secara Matematis & Presisi
    let passRate = 0;
    if (totalFrames > 0) {
       const totalEvaluatedHeuristics = totalFrames * 10;
       
       const violatedHeuristics = new Set(
         (auditData?.issuesData || []).map(issue => `${issue.frameName}-${issue.heuristicId}`)
       );
       
       const passedHeuristics = totalEvaluatedHeuristics - violatedHeuristics.size;
       passRate = Math.round((passedHeuristics / totalEvaluatedHeuristics) * 100);
    }

    return { total: totalFrames, passRate, critical, major, minor };
  }, [parsedFrames.length, auditData?.issuesData]);
  // 👆 AKHIR BAGIAN YANG DIPERBARUI 👆

  const syncDate = auditData?.timestamp ? new Date(auditData.timestamp).toLocaleString(language === 'id' ? 'id-ID' : 'en-US') : '-';

  if (loading) {
    return <div className="ux-loading">{t.loading}</div>;
  }

  return (
    <div className="ux-app-wrapper">
      {/* Tambahkan Overlay Gelap yang bisa diklik untuk menutup */}
      {isDrawerOpen && (
        <div className="ux-drawer-overlay" onClick={closeDrawer}></div>
      )}

      {/* Kirim props ke Sidebar */}
      <Sidebar t={t} isOpen={isDrawerOpen} closeDrawer={closeDrawer} />

      <main className="ux-main">
        {parsedFrames.length === 0 ? (
          <div className="ux-empty">{t.emptyState}</div>
        ) : (
          <div className="ux-main-card">
            {/* Kirim props toggle ke Header */}
            <Header 
              t={t} 
              language={language} 
              setLanguage={setLanguage} 
              syncDate={syncDate}
              toggleDrawer={toggleDrawer} 
            />

            <div className="ux-card-body">
              <KpiBoard 
                t={t} 
                kpiStats={kpiStats} 
              />

              <div className="ux-split-layout">
                <FrameList 
                  t={t}
                  parsedFrames={parsedFrames} 
                  selectedFrame={selectedFrame} 
                  setSelectedFrame={setSelectedFrame} 
                />
                
               <AnalysisDetail 
                  t={t} 
                  activeFrameData={activeFrameData} 
                  issuesData={auditData?.issuesData || []} 
                  selectedFrame={selectedFrame}            
                />
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;