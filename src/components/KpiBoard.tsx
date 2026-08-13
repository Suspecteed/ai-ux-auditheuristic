import type { DictionaryContext } from '../utils/dictionary';
import { SEVERITY_CONFIG } from '../utils/severity';

interface KpiBoardProps {
  t: DictionaryContext;
  kpiStats: {
    total: number;
    passRate: number;
    critical: number;
    major: number;
    minor: number;
  };
}

export default function KpiBoard({ t, kpiStats }: KpiBoardProps) {
 return (
    <>
      <h2 className="ux-section-title">{t.kpiSummary}</h2>
      <div className="ux-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
        
        <div className="ux-kpi-box">
          <span className="ux-kpi-label">{t.kpiTotalFrames}:</span>
          <div className="ux-kpi-bottom"><span className="ux-kpi-number">{kpiStats.total}</span></div>
        </div>

        <div className="ux-kpi-box">
          <span className="ux-kpi-label">{t.kpiPassRate}:</span>
          <div className="ux-kpi-bottom"><span className="ux-kpi-number">{kpiStats.passRate}%</span></div>
        </div>

        <div className="ux-kpi-box">
          <span className="ux-kpi-label">{t.kpiCritical}:</span>
          <div className="ux-kpi-bottom">
            <span className="ux-kpi-number" style={{ color: SEVERITY_CONFIG.CRITICAL.color }}>{kpiStats.critical}</span> 
            <span className="ux-dot" style={{ backgroundColor: SEVERITY_CONFIG.CRITICAL.color }}></span>
          </div>
        </div>

        <div className="ux-kpi-box">
          <span className="ux-kpi-label">{t.kpiMajor}:</span>
          <div className="ux-kpi-bottom">
            <span className="ux-kpi-number" style={{ color: SEVERITY_CONFIG.MAJOR.color }}>{kpiStats.major}</span> 
            <span className="ux-dot" style={{ backgroundColor: SEVERITY_CONFIG.MAJOR.color }}></span>
          </div>
        </div>

        <div className="ux-kpi-box">
          <span className="ux-kpi-label">{t.kpiMinor}:</span>
          <div className="ux-kpi-bottom">
            <span className="ux-kpi-number" style={{ color: SEVERITY_CONFIG.MINOR.color }}>{kpiStats.minor}</span> 
            <span className="ux-dot" style={{ backgroundColor: SEVERITY_CONFIG.MINOR.color }}></span>
          </div>
        </div>

      </div>
    </>
  );
}