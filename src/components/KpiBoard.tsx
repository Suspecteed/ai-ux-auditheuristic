import type { DictionaryContext } from '../utils/dictionary';

interface KpiBoardProps {
  t: DictionaryContext;
  kpiStats: {
    total: number;
    passRate: number;
    major: number;
    minor: number;
  };
}

export default function KpiBoard({ t, kpiStats }: KpiBoardProps) {
  return (
    <>
      <h2 className="ux-section-title">{t.kpiSummary}</h2>
      <div className="ux-kpi-grid">
        <div className="ux-kpi-box">
          <span className="ux-kpi-label">{t.kpiTotalFrames}:</span>
          <div className="ux-kpi-bottom"><span className="ux-kpi-number">{kpiStats.total}</span></div>
        </div>
        <div className="ux-kpi-box">
          <span className="ux-kpi-label">{t.kpiPassRate}:</span>
          <div className="ux-kpi-bottom"><span className="ux-kpi-number">{kpiStats.passRate}%</span></div>
        </div>
        <div className="ux-kpi-box">
          <span className="ux-kpi-label">{t.kpiMajor}:</span>
          <div className="ux-kpi-bottom">
            <span className="ux-kpi-number ux-red">{kpiStats.major}</span> 
            <span className="ux-dot ux-bg-red"></span>
          </div>
        </div>
        <div className="ux-kpi-box">
          <span className="ux-kpi-label">{t.kpiMinor}:</span>
          <div className="ux-kpi-bottom">
            <span className="ux-kpi-number ux-amber">{kpiStats.minor}</span> 
            <span className="ux-dot ux-bg-amber"></span>
          </div>
        </div>
      </div>
    </>
  );
}