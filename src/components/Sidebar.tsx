import type { DictionaryContext } from '../utils/dictionary';

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
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" 
          alt="Figma Logo" 
          style={{ width: '22px', height: '33px', flexShrink: 0 }} 
        />
        <span>Figma UI</span>
      </div>
      <h1 className="ux-sidebar-title">{t.mainTitle}</h1>
      <p className="ux-sidebar-desc">{t.subTitle}</p>

      <h3 className="ux-matrix-title" style={{ marginTop: '2px' }}>
        {t.nielsenMatrixTitle}
      </h3>
      
      <div 
        className="ux-nielsen" 
        style={{ 
          borderRadius: '10px', 
          padding: '5px 0px', 
          marginBottom: '20px', 
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {t.nielsenList && t.nielsenList.map((item, idx) => {
            const parts = item.split(':');
            const code = parts[0]?.trim(); 
            const label = parts.slice(1).join(':').trim(); 

            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span 
                  style={{ 
                    color: '#000000', 
                    border: '1px solid #444444', 
                    borderRadius: '4px', 
                    padding: '1px 4px', 
                    fontSize: '9px', 
                    fontWeight: 'bold', 
                    flexShrink: 0, 
                    minWidth: '25px', 
                    textAlign: 'center',
                    lineHeight: '1.4'
                  }}
                >
                  {code}
                </span>

                <span style={{ fontSize: '11px', lineHeight: '1.3' }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <h3 className="ux-matrix-title">{t.legendTitle}</h3>
      <div className="ux-palette-list">
        <div className="ux-color-item">
          <span className="ux-swatch" style={{ backgroundColor: '#DC2826' }}></span>
          <div className="ux-color-info">
            <strong>{t.legendCritical}</strong>
            <span>{t.legendCriticalDesc}</span>
          </div>
        </div>

        <div className="ux-color-item">
          <span className="ux-swatch" style={{ backgroundColor: '#EAB308' }}></span>
          <div className="ux-color-info">
            <strong>{t.legendMajor}</strong>
            <span>{t.legendMajorDesc}</span>
          </div>
        </div>

        <div className="ux-color-item">
          <span className="ux-swatch" style={{ backgroundColor: '#84CC16' }}></span>
          <div className="ux-color-info">
            <strong>{t.legendMinor}</strong>
            <span>{t.legendMinorDesc}</span>
          </div>
        </div>

        <div className="ux-color-item">
          <span className="ux-swatch" style={{ backgroundColor: '#15803D' }}></span>
          <div className="ux-color-info">
            <strong>{t.legendPassed}</strong>
            <span>{t.legendPassedDesc}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}