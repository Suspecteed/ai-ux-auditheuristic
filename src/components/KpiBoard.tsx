import type { DictionaryContext } from '../utils/dictionary';

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
      <div 
        className="ux-kpi-grid" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)', 
          gap: '12px' 
        }}
      >
        {/* Total Frames */}
        <div className="ux-kpi-box">
          <span className="ux-kpi-label">{t.kpiTotalFrames}:</span>
          <div className="ux-kpi-bottom">
            <span className="ux-kpi-number">{kpiStats.total}</span>
          </div>
        </div>

        {/* Pass Rate */}
        <div className="ux-kpi-box">
          <span className="ux-kpi-label">{t.kpiPassRate}:</span>
          <div className="ux-kpi-bottom">
            <span className="ux-kpi-number">{kpiStats.passRate}%</span>
          </div>
        </div>

        {/* Critical Issues - Merah (#DC2826) */}
        <div className="ux-kpi-box">
          <span className="ux-kpi-label">{t.kpiCritical}:</span>
          <div className="ux-kpi-bottom">
            <span className="ux-kpi-number" style={{ color: '#DC2826' }}>
              {kpiStats.critical}
            </span> 
            <span className="ux-dot" style={{ backgroundColor: '#DC2826' }}></span>
          </div>
        </div>

        {/* Major Issues - Kuning/Oranye (#EAB308) */}
        <div className="ux-kpi-box">
          <span className="ux-kpi-label">{t.kpiMajor}:</span>
          <div className="ux-kpi-bottom">
            <span className="ux-kpi-number" style={{ color: '#EAB308' }}>
              {kpiStats.major}
            </span> 
            <span className="ux-dot" style={{ backgroundColor: '#EAB308' }}></span>
          </div>
        </div>

        {/* Minor Issues - Hijau Muda/Lime (#84CC16) */}
        <div className="ux-kpi-box">
          <span className="ux-kpi-label">{t.kpiMinor}:</span>
          <div className="ux-kpi-bottom">
            <span className="ux-kpi-number" style={{ color: '#84CC16' }}>
              {kpiStats.minor}
            </span> 
            <span className="ux-dot" style={{ backgroundColor: '#84CC16' }}></span>
          </div>
        </div>
      </div>
    </>
  );
}