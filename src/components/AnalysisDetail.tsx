import { useState } from 'react';
import type { DictionaryContext } from '../utils/dictionary';
import type { ParsedFrame } from '../utils/helpers';
import { getHeuristicStatus, getFilteredContent, renderCleanMarkdown } from '../utils/helpers';

interface AnalysisDetailProps {
  t: DictionaryContext;
  activeFrameData: ParsedFrame | undefined;
}

export default function AnalysisDetail({ t, activeFrameData }: AnalysisDetailProps) {
  // State activeTab dipindahkan ke sini karena hanya dipakai di komponen ini
  const [activeTab, setActiveTab] = useState<'all' | 'designer' | 'developer'>('all');

  return (
    <div className="ux-detail-area">
      <div className="ux-fixed-top-panel">
        <h3 className="ux-section-title">{t.matrixSummary}</h3>
        <div className="ux-matrix-container">
          {activeFrameData && Array.from({ length: 10 }).map((_, i) => {
            const hNum = i + 1;
            const status = getHeuristicStatus(activeFrameData.content, hNum);
            
            let badgeClass = 'ux-b-proc';
            let dotClass = 'ux-bg-gray';

            if (status === 'Kritikal') { badgeClass = 'ux-b-crit'; dotClass = 'ux-bg-red'; } 
            else if (status === 'Mayor') { badgeClass = 'ux-b-may'; dotClass = 'ux-bg-yellow'; } 
            else if (status === 'Minor') { badgeClass = 'ux-b-min'; dotClass = 'ux-bg-lime'; } 
            else if (status === 'Passed') { badgeClass = 'ux-b-pass'; dotClass = 'ux-bg-green'; }

            return (
              <span key={hNum} className={`ux-badge ${badgeClass}`}>
                <span className={`ux-dot ${dotClass}`}></span> H{hNum}: {status}
              </span>
            );
          })}
        </div>

        <hr className="ux-divider-line" />

        <div className="ux-analysis-tabs">
          <button className={`ux-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>{t.tabAll}</button>
          <button className={`ux-tab ${activeTab === 'designer' ? 'active' : ''}`} onClick={() => setActiveTab('designer')}>{t.tabUiUx}</button>
          <button className={`ux-tab ${activeTab === 'developer' ? 'active' : ''}`} onClick={() => setActiveTab('developer')}>{t.tabCode}</button>
        </div>
      </div>

      <div className="ux-markdown-container">
        {activeFrameData && (
          <div dangerouslySetInnerHTML={{ __html: renderCleanMarkdown(getFilteredContent(activeFrameData.content, activeTab)) }} />
        )}
      </div>
    </div>
  );
}