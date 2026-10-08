import React, { useState } from 'react';
import type { EvidenceItem } from '../../types';
import { EvidenceViewerModal } from './EvidenceViewerModal';

export interface EvidenceGalleryProps {
  items: EvidenceItem[];
  requestId?: string;
  allowUpload?: boolean;
  onUploadClick?: () => void;
  className?: string;
}

export const EvidenceGallery: React.FC<EvidenceGalleryProps> = ({
  items,
  requestId,
  allowUpload = false,
  onUploadClick,
  className = '',
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredItems = items.filter((item) => {
    if (filterType === 'all') return true;
    if (filterType === 'photo') return item.type === 'photo';
    if (filterType === 'video') return item.type === 'video';
    if (filterType === 'document') return item.type === 'document' || item.type === 'receipt';
    if (filterType === 'gps') return Boolean(item.gpsCoords);
    return item.type === filterType;
  });

  return (
    <div className={`space-y-4 text-left ${className}`}>
      {/* Category Filter & Upload CTA */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: `All (${items.length})` },
            { id: 'photo', label: 'Photos' },
            { id: 'video', label: 'Videos' },
            { id: 'document', label: 'Documents' },
            { id: 'gps', label: 'GPS Telemetry' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filterType === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {allowUpload && onUploadClick && (
          <button
            onClick={onUploadClick}
            className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1.5"
          >
            <span>+ Upload Evidence</span>
          </button>
        )}
      </div>

      {/* Grid of Evidence Artifacts */}
      {filteredItems.length === 0 ? (
        <div className="py-10 text-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400 text-xs">
          No evidence items recorded under this filter.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedIdx(idx)}
              className="group relative rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-150 cursor-pointer flex flex-col"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />

                <div className="absolute top-2 left-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-950/80 text-white backdrop-blur-xs border border-white/20">
                    {item.type}
                  </span>
                </div>

                {item.sha256Hash && (
                  <div className="absolute top-2 right-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shadow" title="Cryptographically verified SHA-256">
                      ✓
                    </span>
                  </div>
                )}
              </div>

              {/* Title & Timestamp footer */}
              <div className="p-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                    {item.locationTag || item.gpsCoords}
                  </p>
                </div>
                <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{item.timestamp.split(' ')[0]}</span>
                  <span className="text-emerald-700 font-semibold group-hover:underline">Inspect →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Inspector Modal */}
      {selectedIdx !== null && (
        <EvidenceViewerModal
          isOpen={true}
          onClose={() => setSelectedIdx(null)}
          items={filteredItems}
          initialIndex={selectedIdx}
          requestId={requestId}
        />
      )}
    </div>
  );
};
