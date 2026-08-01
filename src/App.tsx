import { useEffect, useState, useMemo } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from './firebase'; 
import './App.css';
import { DICTIONARY } from './utils/dictionary';
import { parseAuditData, getHeuristicStatus } from './utils/helpers';
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

  const kpiStats = useMemo(() => {
    let major = 0;
    let minor = 0;
    let passed = 0;
    let evaluatedCount = 0;

    parsedFrames.forEach(frame => {
      for (let i = 1; i <= 10; i++) {
        const status = getHeuristicStatus(frame.content, i);
        if (status === 'Kritikal' || status === 'Mayor') major++;
        else if (status === 'Minor') minor++;
        else if (status === 'Passed') passed++;

        if (status !== 'Processing') evaluatedCount++;
      }
    });

    const total = parsedFrames.length || 0;
    const passRate = evaluatedCount > 0 ? Math.round((passed / evaluatedCount) * 100) : 0;

    return { total, major, minor, passRate };
  }, [parsedFrames]);

  const syncDate = auditData?.timestamp ? new Date(auditData.timestamp).toLocaleString(language === 'id' ? 'id-ID' : 'en-US') : '-';

  if (loading) {
    return <div className="ux-loading">{t.loading}</div>;
  }

  return (
    <div className="ux-app-wrapper">
      <Sidebar t={t} />

      <main className="ux-main">
        {parsedFrames.length === 0 ? (
          <div className="ux-empty">{t.emptyState}</div>
        ) : (
          <div className="ux-main-card">
            <Header 
              t={t} 
              language={language} 
              setLanguage={setLanguage} 
              syncDate={syncDate} 
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
