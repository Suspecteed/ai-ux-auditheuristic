import type { DictionaryContext } from '../utils/dictionary';

interface SidebarProps {
  t: DictionaryContext;
}

export default function Sidebar({ t }: SidebarProps) {
  return (
    <aside className="ux-sidebar">
      <div className="ux-logo-area">
        <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" alt="Figma Logo" style={{ width: '22px', height: '33px', flexShrink: 0 }} />
        <span>Figma UI</span>
      </div>
      <h1 className="ux-sidebar-title">{t.mainTitle}</h1>
      <p className="ux-sidebar-desc">{t.subTitle}</p>

      <h3 className="ux-palette-title">{t.legendTitle}</h3>
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