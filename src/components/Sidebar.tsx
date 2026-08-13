import type { DictionaryContext } from '../utils/dictionary';
import { SEVERITY_CONFIG } from '../utils/severity';

interface SidebarProps {
  t: DictionaryContext;
  isOpen: boolean;        
  closeDrawer: () => void; 
}

export default function Sidebar({ t, isOpen, closeDrawer }: SidebarProps) {
  return (
    <aside className={`ux-sidebar ${isOpen ? 'ux-sidebar-open' : 'ux-sidebar-closed'}`}>
      <button className="ux-icon-btn ux-close-btn" onClick={closeDrawer}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
      <div className="ux-logo-area">
        <svg viewBox="0 0 38 57" width="22" height="33" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#0acf83"/>
          <path d="M0 47.5a9.5 9.5 0 0 1 9.5-9.5H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ca789"/>
          <path d="M19 0H9.5A9.5 9.5 0 1 0 9.5 19H19V0z" fill="#f24e1e"/>
          <path d="M19 19H9.5A9.5 9.5 0 1 0 9.5 38H19V19z" fill="#a259ff"/>
          <path d="M38 9.5A9.5 9.5 0 1 0 28.5 19H38V9.5z" fill="#ff7262"/>
        </svg>
        <span>Figma UI</span>
      </div>
      
      <h1 className="ux-sidebar-title">{t.mainTitle}</h1>
      <p className="ux-sidebar-desc">{t.subTitle}</p>

      <h3 className="ux-matrix-title" style={{ marginTop: '2px' }}>{t.nielsenMatrixTitle}</h3>
      <div className="ux-nielsen" style={{ borderRadius: '10px', padding: '5px 0px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {t.nielsenList && t.nielsenList.map((item, idx) => {
            const parts = item.split(':');
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#000', border: '1px solid #444', borderRadius: '4px', padding: '1px 4px', fontSize: '9px', fontWeight: 'bold', flexShrink: 0, minWidth: '25px', textAlign: 'center', lineHeight: '1.4' }}>
                  {parts[0]?.trim()}
                </span>
                <span style={{ fontSize: '11px', lineHeight: '1.3' }}>{parts.slice(1).join(':').trim()}</span>
              </div>
            );
          })}
        </div>
      </div>

      <h3 className="ux-matrix-title">{t.legendTitle}</h3>
      <div className="ux-palette-list">
        <div className="ux-color-item">
          <span className="ux-swatch" style={{ backgroundColor: SEVERITY_CONFIG.CRITICAL.color }}></span>
          <div className="ux-color-info"><strong>{t.legendCritical}</strong><span>{t.legendCriticalDesc}</span></div>
        </div>
        <div className="ux-color-item">
          <span className="ux-swatch" style={{ backgroundColor: SEVERITY_CONFIG.MAJOR.color }}></span>
          <div className="ux-color-info"><strong>{t.legendMajor}</strong><span>{t.legendMajorDesc}</span></div>
        </div>
        <div className="ux-color-item">
          <span className="ux-swatch" style={{ backgroundColor: SEVERITY_CONFIG.MINOR.color }}></span>
          <div className="ux-color-info"><strong>{t.legendMinor}</strong><span>{t.legendMinorDesc}</span></div>
        </div>
        <div className="ux-color-item">
          <span className="ux-swatch" style={{ backgroundColor: SEVERITY_CONFIG.PASSED.color }}></span>
          <div className="ux-color-info"><strong>{t.legendPassed}</strong><span>{t.legendPassedDesc}</span></div>
        </div>
      </div>
    </aside>
  );
}