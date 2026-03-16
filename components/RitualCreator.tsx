
import React, { useState } from 'react';
import { Degree, Office, RitualSection, Working } from '@/types';
import { PLATFORM } from '@/config/editionConfig';

interface RitualCreatorProps {
  working: Working;
  onSave: (ritual: RitualSection) => void;
  onClose: () => void;
}

const RitualCreator: React.FC<RitualCreatorProps> = ({ working, onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [degree, setDegree] = useState<Degree>(Degree.FIRST);
  const [office, setOffice] = useState<Office>(Office.WM);
  const [rawText, setRawText] = useState('');

  const handleSave = () => {
    if (!title || !rawText) return;

    // --- Smart Chunking Logic ---
    const text = rawText.replace(/\r\n/g, '\n').trim();

    const chunks = text.split(
      /\n\n+|(?=\n[A-Z]{2,}(?:\s[A-Z]+)*:)|(?=\n\s*[\*\-]{1,3}\s)|(?=\n\s*(?:-{3,}|\*{3,})\s*\n)/
    );

    const content = chunks
      .map(chunk => chunk.trim())
      .filter(chunk => chunk.length > 2);

    let finalContent = content;
    if (finalContent.length <= 1 && text.includes('\n')) {
      finalContent = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 4);
    }

    const newRitual: RitualSection = {
      id: `custom-${Date.now()}`,
      title,
      degree,
      office,
      working: working,
      content: finalContent,
      isCustom: true
    };

    onSave(newRitual);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-north-navy/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div>
            <h2 className="logo-text text-xl md:text-2xl font-black text-north-navy uppercase tracking-tight">{PLATFORM.name}</h2>
            <p className="text-[10px] font-bold text-north-light uppercase tracking-widest">Create Your Custom Working</p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all active:scale-90">
            <svg className="w-6 h-6 text-north-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1 text-slate-900">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Title</label>
              <input 
                type="text" 
                placeholder="e.g. 1st Degree Tools (Full)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3.5 focus:border-north-navy outline-none transition-all font-bold text-north-navy shadow-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Degree</label>
                <select 
                  value={degree}
                  onChange={(e) => setDegree(e.target.value as Degree)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3.5 focus:border-north-navy outline-none font-bold text-north-navy appearance-none cursor-pointer shadow-sm"
                >
                  {Object.values(Degree).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <div className="absolute right-4 top-[2.4rem] pointer-events-none text-north-navy">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Officer</label>
                <select 
                  value={office}
                  onChange={(e) => setOffice(e.target.value as Office)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3.5 focus:border-north-navy outline-none font-bold text-north-navy appearance-none cursor-pointer shadow-sm"
                >
                  {Object.values(Office).map(o => <option key={o} value={o}>{o.split(' ')[0]}</option>)}
                </select>
                <div className="absolute right-4 top-[2.4rem] pointer-events-none text-north-navy">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Ritual Script (Paste Here)</label>
              <textarea 
                placeholder="Paste the ritual text here. Each paragraph, speaker change (e.g. WM:), or bullet point will become a separate learning card."
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={8}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:border-north-navy outline-none transition-all font-medium text-slate-600 text-sm leading-relaxed shadow-sm"
              />
            </div>
          </div>

          {/* Confidentiality Footer */}
          <div className="pt-8 pb-4 border-t border-slate-100 text-center space-y-2">
            <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">
              © 2026 Carl Birkenshaw / Birkenshaw Ltd.
            </p>
            <p className="text-[7px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">
              Proprietary Licensed Software. Reverse engineering prohibited.
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8 bg-slate-50 shrink-0">
          <button 
            onClick={handleSave}
            disabled={!title || !rawText}
            className="w-full py-5 bg-north-navy text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-xl active:scale-95"
          >
            Save to Library
          </button>
        </div>
      </div>
    </div>
  );
};

export default RitualCreator;
