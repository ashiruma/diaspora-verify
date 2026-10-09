import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVerification } from '../../context/VerificationContext';

export interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({ isOpen, onClose }) => {
  const { requests, agents, properties } = useVerification();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Aggregate searchable items
  interface SearchResultItem {
    id: string;
    title: string;
    subtitle: string;
    category: 'Requests' | 'Clients' | 'Agents' | 'Reports' | 'Properties';
    onSelect: () => void;
  }

  const allItems: SearchResultItem[] = [];

  // 1. Requests
  requests.forEach((r) => {
    allItems.push({
      id: `req-${r.id}`,
      title: `${r.id} — ${r.title}`,
      subtitle: `${r.location.county} · Status: ${r.status}`,
      category: 'Requests',
      onSelect: () => {
        navigate(`/request/${r.id}`);
        onClose();
      },
    });
  });

  // 2. Clients
  const uniqueClients = new Map<string, typeof requests[0]['client']>();
  requests.forEach((r) => {
    if (r.client?.email && !uniqueClients.has(r.client.email)) {
      uniqueClients.set(r.client.email, r.client);
    }
  });
  uniqueClients.forEach((c) => {
    allItems.push({
      id: `client-${c.email}`,
      title: c.name,
      subtitle: `${c.email} · ${c.locationAbroad}`,
      category: 'Clients',
      onSelect: () => {
        navigate(`/admin?tab=clients&search=${encodeURIComponent(c.name)}`);
        onClose();
      },
    });
  });

  // 3. Agents
  agents.forEach((a) => {
    allItems.push({
      id: `agent-${a.id}`,
      title: `${a.name} (${a.badgeLevel})`,
      subtitle: `${a.phone} · Counties: ${a.primaryCounties?.join(', ')}`,
      category: 'Agents',
      onSelect: () => {
        navigate(`/admin?tab=agents&search=${encodeURIComponent(a.name)}`);
        onClose();
      },
    });
  });

  // 4. Reports
  requests.filter((r) => r.qaReview || r.evidence?.length > 0).forEach((r) => {
    allItems.push({
      id: `rep-${r.id}`,
      title: `Report: ${r.title}`,
      subtitle: `Dossier ${r.id} · QA: ${r.qaReview?.recommendationType || 'Published'}`,
      category: 'Reports',
      onSelect: () => {
        navigate(`/request/${r.id}`);
        onClose();
      },
    });
  });

  // 5. Properties
  properties.forEach((p) => {
    allItems.push({
      id: `prop-${p.id}`,
      title: p.title,
      subtitle: `${p.county}, ${p.town} · ${p.propertyType}`,
      category: 'Properties',
      onSelect: () => {
        navigate('/properties');
        onClose();
      },
    });
  });

  const filteredItems = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.slice(0, 10);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].onSelect();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-150"
        onClick={onClose}
      />

      {/* Palette Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col text-left">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3 bg-slate-50/50">
          <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search requests, clients, agents, reports..."
            className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto custom-scrollbar p-2 divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No matching records found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.onSelect}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3 py-2.5 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                    isSelected ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-xs font-semibold truncate text-slate-900">{item.title}</div>
                    <div className="text-[11px] text-slate-400 truncate">{item.subtitle}</div>
                  </div>
                  <span className="flex-shrink-0 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-200/70 text-slate-600 font-semibold">
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>esc Exit</span>
          </div>
          <span className="font-mono">DiasporaVerify Admin CLI</span>
        </div>
      </div>
    </div>
  );
};
