import snarkdown from 'snarkdown';

export interface AuditData {
  nodeId: string;
  nodeName: string;
  hasilAudit: string;
  timestamp: number;
  status: string;
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
  const result: ParsedFrame[] = [];
  for (const seg of segments) {
    if (!seg.trim()) continue;
    const lines = seg.trim().split('\n');
    const name = lines[0].replace(/[*_#\[\]]/g, '').trim();
    const content = lines.slice(1).join('\n').replace(/^---/gm, '').trim();
    if (name) result.push({ name, content });
  }
  return result;
};

export const getHeuristicStatus = (content: string, hIndex: number) => {
  if (!content) return 'Processing';

  const findingBlocks = content.split(/(?:Temuan|Finding)\s*#?\d+/i);
  for (let i = 1; i < findingBlocks.length; i++) {
    const block = findingBlocks[i];
    const hPrincipleRegex = new RegExp(`(?:Prinsip\\s*Nielsen|Nielsen\\s*Principle)\\s*[:\\-]?\\s*\\bH${hIndex}\\b`, 'i');
    if (hPrincipleRegex.test(block)) {
      const lower = block.toLowerCase();
      if (lower.includes('kritikal') || lower.includes('critical')) return 'Kritikal';
      if (lower.includes('mayor') || lower.includes('major')) return 'Mayor';
      if (lower.includes('minor')) return 'Minor';
      if (lower.includes('warning')) return 'Minor';
    }
  }

  const lines = content.split('\n');
  for (const line of lines) {
    const exactLineRegex = new RegExp(`^[•\\-\\*]?\\s*H${hIndex}\\b`, 'i');
    if (exactLineRegex.test(line)) {
      const lower = line.toLowerCase();
      if (lower.includes('passed') || lower.includes('pass') || lower.includes('lolos')) {
        if (!lower.includes('warning') && !lower.includes('kritikal') && !lower.includes('mayor') && !lower.includes('minor')) {
          return 'Passed';
        }
      }
      if (lower.includes('kritikal') || lower.includes('critical')) return 'Kritikal';
      if (lower.includes('mayor') || lower.includes('major')) return 'Mayor';
      if (lower.includes('minor')) return 'Minor';
      if (lower.includes('warning')) return 'Minor';
    }
  }

  return 'Passed';
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
  return snarkdown(cleanLines);
};
