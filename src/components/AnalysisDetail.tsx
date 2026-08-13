import { useState } from 'react';
import type { DictionaryContext } from '../utils/dictionary';
import type { ParsedFrame, Issue } from '../utils/helpers';
import { getFilteredContent, renderCleanMarkdown } from '../utils/helpers';
import { SEVERITY_CONFIG, type SeverityLevel } from '../utils/severity';

interface AnalysisDetailProps {
  t: DictionaryContext;
  activeFrameData: ParsedFrame | undefined;
  issuesData: Issue[];
  selectedFrame: string;
}

export default function AnalysisDetail({ t, activeFrameData, issuesData, selectedFrame }: AnalysisDetailProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'designer' | 'developer'>('all');

  return (
    <div className="ux-detail-area">
      <div className="ux-fixed-top-panel">
        <h3 className="ux-section-title">{t.matrixSummary}</h3>
        <div className="ux-matrix-container">
          {activeFrameData && Array.from({ length: 10 }).map((_, i) => {
            const hNum = i + 1;
            const heuristicId = `H${hNum}`;
            let currentLevel: SeverityLevel = 'PASSED';

            if (issuesData && issuesData.length > 0) {
              const frameIssues = selectedFrame === 'ALL' ? issuesData : issuesData.filter(issue => issue.frameName === activeFrameData.name);
              const foundIssue = frameIssues.find(issue => issue.heuristicId === heuristicId);
              if (foundIssue) {
                const lvl = (foundIssue.severityLevel || '').toUpperCase() as SeverityLevel;
                if (SEVERITY_CONFIG[lvl]) currentLevel = lvl;
              }
            }

            const config = SEVERITY_CONFIG[currentLevel];
            return (
              <span key={hNum} className={`ux-badge ${config.badgeClass}`}>
                <span className={`ux-dot ${config.dotClass}`}></span> H{hNum}: {config.label}
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
        {activeFrameData && <div dangerouslySetInnerHTML={{ __html: renderCleanMarkdown(getFilteredContent(activeFrameData.content, activeTab)) }} />}
      </div>
    </div>
  );
}