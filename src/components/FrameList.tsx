import type { ParsedFrame } from '../utils/helpers';

interface FrameListProps {
  parsedFrames: ParsedFrame[];
  selectedFrame: string;
  setSelectedFrame: (name: string) => void;
}

export default function FrameList({ parsedFrames, selectedFrame, setSelectedFrame }: FrameListProps) {
  return (
    <div className="ux-frame-sidebar">
      {parsedFrames.map((frame, idx) => (
        <div key={idx} className={`ux-frame-item ${selectedFrame === frame.name ? 'active' : ''}`} onClick={() => setSelectedFrame(frame.name)}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          <div className="ux-fi-text">
            <small>Frame {idx + 1}</small>
            <strong>{frame.name}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}