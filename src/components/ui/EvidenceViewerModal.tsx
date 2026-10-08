import React, { useState, useEffect } from 'react';
import type { EvidenceItem } from '../../types';

export interface EvidenceViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: EvidenceItem[];
  initialIndex?: number;
  requestId?: string;
}

export const EvidenceViewerModal: React.FC<EvidenceViewerModalProps> = ({
  isOpen,
  onClose,
  items,
  initialIndex = 0,
  requestId,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showMetadata, setShowMetadata] = useState(true);
  const [copiedHash, setCopiedHash] = useState(false);

  const handleNext = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % (items.length || 1));
    setZoomLevel(1);
  }, [items.length]);

  const handlePrev = React.useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + (items.length || 1)) % (items.length || 1));
    setZoomLevel(1);
  }, [items.length]);

  const [prevInitialIndex, setPrevInitialIndex] = useState(initialIndex);
  if (initialIndex !== prevInitialIndex) {
    setPrevInitialIndex(initialIndex);
    setCurrentIndex(initialIndex);
    setZoomLevel(1);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex] || items[0];

  const handleCopyHash = () => {
    if (currentItem.sha256Hash) {
      navigator.clipboard.writeText(currentItem.sha256Hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md">
      {/* Top Bar */}
      <div className="absolute top-0 inset-x-0 h-14 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 z-20">
        <div className="flex items-center gap-3 text-white">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {currentItem.id}
          </span>
          <span className="text-xs font-semibold truncate max-w-xs sm:max-w-md">
            {currentItem.title}
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            ({currentIndex + 1} of {items.length})
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
              className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-700"
              title="Zoom out"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
              </svg>
            </button>
            <span className="px-2 text-[10px] font-mono text-slate-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
              className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-700"
              title="Zoom in"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Toggle Metadata */}
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className={`p-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
              showMetadata
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>Inspector</span>
          </button>

          {/* Download */}
          <a
            href={currentItem.url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
            title="Download original file"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 rounded-lg border border-slate-700 transition-colors"
            title="Close viewer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative w-full h-full pt-14 flex overflow-hidden">
        {/* Navigation Previous */}
        {items.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white border border-slate-700 flex items-center justify-center transition-transform hover:scale-110 shadow-lg"
            title="Previous item"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Media Canvas */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-auto">
          {currentItem.type === 'video' ? (
            <video
              src={currentItem.url}
              controls
              autoPlay
              className="max-h-[80vh] max-w-full rounded-lg shadow-2xl"
            />
          ) : (
            <div
              className="transition-transform duration-150 flex items-center justify-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={currentItem.url}
                alt={currentItem.title}
                width={800}
                height={600}
                decoding="async"
                className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl select-none"
              />
            </div>
          )}
        </div>

        {/* Navigation Next */}
        {items.length > 1 && (
          <button
            onClick={handleNext}
            className={`absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white border border-slate-700 flex items-center justify-center transition-transform hover:scale-110 shadow-lg ${
              showMetadata ? 'right-84' : 'right-4'
            }`}
            title="Next item"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Right Metadata Inspector Panel */}
        {showMetadata && (
          <div className="w-80 bg-slate-900 border-l border-slate-800 text-slate-300 p-5 overflow-y-auto space-y-4 text-xs select-text">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Cryptographic Integrity
              </div>
              <div className="mt-1.5 p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[10px] break-all text-emerald-400">
                {currentItem.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
              </div>
              <button
                onClick={handleCopyHash}
                className="mt-1 text-[10px] text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
              >
                <span>{copiedHash ? '✓ Hash Copied!' : 'Copy SHA-256 Digest'}</span>
              </button>
            </div>

            <div className="space-y-2 border-t border-slate-800 pt-3">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Evidence ID</span>
                <span className="font-mono text-white text-[11px]">{currentItem.id}</span>
              </div>
              {requestId && (
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Request / Assignment ID</span>
                  <span className="font-mono text-white text-[11px]">{requestId}</span>
                </div>
              )}
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Timestamp Recorded</span>
                <span className="text-white text-[11px]">{currentItem.timestamp}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Ground Location</span>
                <span className="text-white text-[11px]">{currentItem.locationTag}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">GPS Coordinates</span>
                <a
                  href={`https://maps.google.com/?q=${currentItem.gpsCoords}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-mono text-[11px]"
                >
                  {currentItem.gpsCoords} ↗
                </a>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Field Agent ID</span>
                <span className="font-mono text-white text-[11px]">{currentItem.verifiedByAgentId}</span>
              </div>
              {currentItem.cameraAngle && (
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Standard Camera Angle</span>
                  <span className="text-slate-300 text-[11px]">{currentItem.cameraAngle}</span>
                </div>
              )}
            </div>

            {currentItem.description && (
              <div className="border-t border-slate-800 pt-3">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Field Observations</span>
                <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">{currentItem.description}</p>
              </div>
            )}

            {currentItem.uncertaintyFlag && (
              <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/60 text-amber-300">
                <div className="text-[10px] font-bold uppercase tracking-wider">Uncertainty Flag</div>
                <div className="text-[11px] mt-0.5">{currentItem.uncertaintyFlag}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
