import type { DictionaryContext } from '../utils/dictionary';

interface HeaderProps {
  t: DictionaryContext;
  language: 'id' | 'en';
  setLanguage: (lang: 'id' | 'en') => void;
  syncDate: string;
  toggleDrawer: () => void; 
}

export default function Header({ t, language, setLanguage, syncDate, toggleDrawer }: HeaderProps) {

  const handleExport = () => {
    window.print();
  };

  return (
    <header className="ux-dark-header">
      <div className="ux-header-left">
        <button className="ux-icon-btn" onClick={toggleDrawer} style={{ marginRight: '8px', color: '#F8FAFC' }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <span className="ux-badge-copilot">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {t.appTitle}
        </span>
        <span className="ux-divider"></span>
        <span className="ux-header-text">{t.syncTime}: {syncDate}</span>
        <span className="ux-divider"></span>
        <span className="ux-header-text">{t.status}: <strong className="ux-text-success">● SUCCESS</strong></span>
      </div>
      <div className="ux-header-right">
        <select className="ux-select-lang" value={language} onChange={(e) => setLanguage(e.target.value as 'id' | 'en')}>
          <option value="id">ID</option>
          <option value="en">EN</option>
        </select>

        <button className="ux-btn-export" onClick={handleExport}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          {t.exportBtn}
        </button>
      </div>
    </header>
  );
}
