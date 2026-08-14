import snarkdown from 'snarkdown';

export interface Issue {
  heuristicId: string;
  heuristicTitle: string;
  severityLevel: string;
  nodeName: string;
  frameName: string;
  problem: string;
  solution: string;
}

export interface AuditData {
  nodeName: string;
  hasilAudit: string;
  timestamp: number;
  status: string;
  issuesData?: Issue[]; 
}

export interface ParsedFrame {
  name: string;
  content: string;
}

export const parseAuditData = (rawText: string, fallbackName: string): ParsedFrame[] => {
  if (!rawText) return [];
  if (!rawText.includes('Frame:')) {
    return [{ name: fallbackName, content: rawText }];
  }

  const segments = rawText.split(/#{1,3}\s*(?:)?\s*Frame:\s*/i);
  const frameMap = new Map<string, string[]>();

  for (const seg of segments) {
    if (!seg.trim()) continue;
    const lines = seg.trim().split('\n');
    const rawHeader = lines[0].replace(/[*_#\[\]]/g, '').trim();
    
    const mainFrameName = rawHeader.split('➔')[0].trim() || rawHeader;
    const content = lines.slice(1).join('\n').replace(/^---/gm, '').trim();

    if (!frameMap.has(mainFrameName)) {
      frameMap.set(mainFrameName, []);
    }
    
    frameMap.get(mainFrameName)?.push(`### ${rawHeader}\n${content}`);
  }

  const result: ParsedFrame[] = [];
  frameMap.forEach((contents, name) => {
    result.push({
      name,
      content: contents.join('\n\n---\n\n')
    });
  });

  return result;
};

export const getFilteredContent = (content: string, tab: 'all' | 'designer' | 'developer') => {
  if (!content) return '';
  if (tab === 'all') return content;

  return content.split('\n').filter(line => {
    const lowerLine = line.toLowerCase();
    if (tab === 'designer') {
      return !lowerLine.includes('developer') && !lowerLine.includes('teknis') && !lowerLine.includes('technical');
    }
    if (tab === 'developer') {
      return !lowerLine.includes('desainer') && !lowerLine.includes('designer') &&
             !lowerLine.includes('solutif') && !lowerLine.includes('kognitif') &&
             !lowerLine.includes('cognitive');
    }
    return true;
  }).join('\n');
};

export const renderCleanMarkdown = (rawText: string) => {
  if (!rawText) return '';
  const cleanLines = rawText.split('\n').map(line => line.trim()).join('\n');
  const html = snarkdown(cleanLines);
  return html.replace(
    /<code>(.*?)<\/code>/g,
    '<span style="background-color: #F1F5F9; color: #0F172A; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: 600; border: 1px solid #CBD5E1; font-family: ui-monospace, monospace;">$1</span>'
  );
};
