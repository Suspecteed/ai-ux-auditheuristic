import type { DictionaryContext } from '../utils/dictionary';
import type { ParsedFrame } from '../utils/helpers';

interface FrameListProps {
  t: DictionaryContext;
  parsedFrames: ParsedFrame[];
  selectedFrame: string;
  setSelectedFrame: (name: string) => void;
}

export default function FrameList({ t, parsedFrames, selectedFrame, setSelectedFrame }: FrameListProps) {
  return (
    <div className="ux-frame-sidebar">
      {/* OPSI SEMUA FRAME */}
      <div 
        className={`ux-frame-item ${selectedFrame === 'ALL' ? 'active' : ''}`}
        onClick={() => setSelectedFrame('ALL')}
      >
        <div className="ux-fi-text">
          <small>ALL</small>
          <strong> {t.allFrames || 'Semua Frame'}</strong>
        </div>
      </div>

      {/* LIST DARI SETIAP FRAME */}
      {parsedFrames.map((frame, idx) => (
        <div 
          key={idx} 
          className={`ux-frame-item ${selectedFrame === frame.name ? 'active' : ''}`} 
          onClick={() => setSelectedFrame(frame.name)}
        >
          <div className="ux-fi-text">
            <small>Frame {idx + 1}</small>
            <strong>{frame.name}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}