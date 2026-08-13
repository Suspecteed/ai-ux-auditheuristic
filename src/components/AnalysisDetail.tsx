import { useState } from 'react';
import type { DictionaryContext } from '../utils/dictionary';
import type { ParsedFrame, Issue } from '../utils/helpers'; // Tambahkan import Issue
import { getFilteredContent, renderCleanMarkdown } from '../utils/helpers';

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
            
            // ✨ LOGIKA BARU: Cari status keparahan murni dari JSON AI
            let status = 'Passed';
            let badgeClass = 'ux-b-pass';
            let dotClass = 'ux-bg-green';

            if (issuesData && issuesData.length > 0) {
              // Filter isu berdasarkan frame yang sedang aktif
              const frameIssues = selectedFrame === 'ALL' 
                ? issuesData 
                : issuesData.filter(issue => issue.frameName === activeFrameData.name);
              
              // Cari apakah ada pelanggaran untuk Heuristik (H1-H10) ini
              const foundIssue = frameIssues.find(issue => issue.heuristicId === heuristicId);
              
              if (foundIssue) {
                if (foundIssue.badgeColor.includes('🔴')) {
                  status = 'Kritikal'; badgeClass = 'ux-b-crit'; dotClass = 'ux-bg-red';
                } else if (foundIssue.badgeColor.includes('🟡')) {
                  status = 'Mayor'; badgeClass = 'ux-b-may'; dotClass = 'ux-bg-yellow';
                } else if (foundIssue.badgeColor.includes('🟢')) {
                  status = 'Minor'; badgeClass = 'ux-b-min'; dotClass = 'ux-bg-lime';
                }
              }
            }

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