
import React, { useRef } from 'react';
import { AppSettings, BgColor, RitualSection, PromptFadeMode } from '@/types';
import { AVAILABLE_VOICES } from '@/constants';
import { Lock, ChevronRight } from 'lucide-react';

interface SettingsOverlayProps {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  customRituals: RitualSection[];
  onImport: (rituals: RitualSection[]) => void;
  onReset: () => void;
  onClose: () => void;
}

const SettingsOverlay: React.FC<SettingsOverlayProps> = ({ 
  settings, 
  setSettings, 
  customRituals,
  onImport,
  onReset,
  onClose 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(customRituals, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `ritual_backup_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          onImport(imported);
          alert(`Successfully restored ${imported.length} rituals.`);
        }
      } catch (err) {
        alert("Failed to restore backup. Invalid file format.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-north-navy/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white text-north-navy">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black uppercase tracking-tight">Study Settings</h2>
            <p className="text-[10px] font-bold text-north-light uppercase tracking-widest">Ritual Companion v2.0</p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto text-slate-900">
          {/* Voice Character Selection */}
          <section>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Senior Officer Voice</label>
            <div className="grid grid-cols-1 gap-3">
              {AVAILABLE_VOICES.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => {
                    let style: 'commanding' | 'steady' | 'eloquent' = 'steady';
                    if (voice.id === 'Fenrir') style = 'commanding';
                    if (voice.id === 'Charon') style = 'steady';
                    if (voice.id === 'Zephyr') style = 'eloquent';
                    setSettings({ ...settings, voiceName: voice.id, voiceStyle: style });
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-left ${
                    settings.voiceName === voice.id 
                    ? 'border-north-navy bg-north-navy text-white' 
                    : 'border-slate-100 bg-slate-50 text-north-navy hover:border-north-light'
                  }`}
                >
                  <div>
                    <p className="font-black text-xs uppercase tracking-tight">{voice.label}</p>
                    <p className="text-[8px] opacity-60 uppercase">{voice.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Background Color */}
          <section>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Paper Tint</label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { color: BgColor.WHITE, tint: 'white', label: 'White' },
                { color: BgColor.CREAM, tint: 'cream', label: 'Cream' },
                { color: BgColor.MINT, tint: 'mint', label: 'Soft Green' },
                { color: BgColor.SKY, tint: 'blue', label: 'Soft Blue' },
                { color: BgColor.PEACH, tint: 'peach', label: 'Soft Peach' }
              ].map((option) => (
                <div key={option.tint} className="flex flex-col items-center space-y-2">
                  <button
                    onClick={() => {
                      setSettings({ ...settings, bgColor: option.color, paperTint: option.tint as any });
                    }}
                    className={`w-full h-12 rounded-xl border-4 transition-all ${option.color} ${settings.paperTint === option.tint ? 'border-north-gold scale-110 shadow-lg' : 'border-slate-50'}`}
                  />
                  <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter text-center">{option.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Learning Presets Group */}
          <div className="space-y-3 pt-2">
            <label className="block text-[9px] font-black text-slate-400/80 uppercase tracking-[0.2em] mb-1">Learning Presets</label>
            {/* Assist Mode */}
            <section className="flex items-center justify-between px-5 py-6 bg-north-navy/5 rounded-2xl border border-north-navy/10">
              <div>
                <p className="font-black text-north-navy uppercase text-sm">Assist Mode</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Applies supportive reading and focus settings</p>
              </div>
              <button 
                onClick={() => {
                  const newAssistMode = !settings.assistMode;
                  const newSettings = { ...settings, assistMode: newAssistMode };
                  if (newAssistMode) {
                    newSettings.readingSupport = true;
                    newSettings.reduceMotion = true;
                    newSettings.focusMode = true;
                    newSettings.highlightCurrentBlock = true;
                  }
                  setSettings(newSettings);
                }}
                className={`w-12 h-7 rounded-full transition-all relative ${settings.assistMode ? 'bg-north-navy' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${settings.assistMode ? 'translate-x-5' : ''}`} />
              </button>
            </section>
          </div>

          {/* Text & Reading Group */}
          <div className="space-y-4 pt-4">
            <label className="block text-[9px] font-black text-slate-400/80 uppercase tracking-[0.2em] mb-1">Text & Reading</label>
            {/* Reading Support */}
            <section className="flex items-center justify-between px-5 py-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <p className="font-black text-north-navy uppercase text-sm">Reading Support</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Reading-friendly font and spacing</p>
              </div>
              <button 
                onClick={() => setSettings({ 
                  ...settings, 
                  readingSupport: !settings.readingSupport 
                })}
                className={`w-12 h-7 rounded-full transition-all relative ${settings.readingSupport ? 'bg-north-navy' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${settings.readingSupport ? 'translate-x-5' : ''}`} />
              </button>
            </section>

            {/* Text Size Selection */}
            <section className="space-y-3">
              <p className="text-[10px] font-black text-north-navy/40 uppercase tracking-widest ml-1">Text Size</p>
              <div className="flex gap-2">
                {[
                  { label: 'Standard', scale: 1.0 },
                  { label: 'Large', scale: 1.15 },
                  { label: 'Extra Large', scale: 1.3 }
                ].map((size) => (
                  <button
                    key={size.label}
                    onClick={() => setSettings({ ...settings, textScale: size.scale })}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 text-[9px] font-black uppercase tracking-widest transition-all ${
                      (settings.textScale || 1.0) === size.scale 
                      ? 'border-north-navy bg-north-navy text-white shadow-md' 
                      : 'border-slate-100 bg-slate-50 text-north-navy hover:border-north-light'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Focus Group */}
          <div className="space-y-3 pt-4">
            <label className="block text-[9px] font-black text-slate-400/80 uppercase tracking-[0.2em] mb-1">Focus</label>
            {/* Focus Mode */}
            <section className="flex items-center justify-between px-5 py-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <p className="font-black text-north-navy uppercase text-sm">Focus Mode</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Minimize distractions during study</p>
              </div>
              <button 
                onClick={() => setSettings({ 
                  ...settings, 
                  focusMode: !settings.focusMode 
                })}
                className={`w-12 h-7 rounded-full transition-all relative ${settings.focusMode ? 'bg-north-navy' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${settings.focusMode ? 'translate-x-5' : ''}`} />
              </button>
            </section>

            {/* Line Focus */}
            <section className="flex items-center justify-between px-5 py-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <p className="font-black text-north-navy uppercase text-sm">Line Focus</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Dim surrounding lines to focus on current</p>
              </div>
              <button 
                onClick={() => setSettings({ 
                  ...settings, 
                  lineFocus: !settings.lineFocus 
                })}
                className={`w-12 h-7 rounded-full transition-all relative ${settings.lineFocus ? 'bg-north-navy' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${settings.lineFocus ? 'translate-x-5' : ''}`} />
              </button>
            </section>

            {/* Highlight Current Block */}
            <section className="flex items-center justify-between px-5 py-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <p className="font-black text-north-navy uppercase text-sm">Highlight Playback</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Highlight text while audio is playing</p>
              </div>
              <button 
                onClick={() => setSettings({ 
                  ...settings, 
                  highlightCurrentBlock: !settings.highlightCurrentBlock 
                })}
                className={`w-12 h-7 rounded-full transition-all relative ${settings.highlightCurrentBlock ? 'bg-north-navy' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${settings.highlightCurrentBlock ? 'translate-x-5' : ''}`} />
              </button>
            </section>

            {/* Prompt Fade Mode */}
            <section className="space-y-3 pt-2">
              <p className="text-[10px] font-black text-north-navy/40 uppercase tracking-widest ml-1">Prompt Fade</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Off', value: PromptFadeMode.OFF },
                  { label: 'Fade Last Word', value: PromptFadeMode.LAST_WORD },
                  { label: 'Fade Half Line', value: PromptFadeMode.HALF_LINE },
                  { label: 'First Letters', value: PromptFadeMode.FIRST_LETTERS },
                  { label: 'Hide Line', value: PromptFadeMode.HIDE_LINE }
                ].map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => setSettings({ ...settings, promptFadeMode: mode.value })}
                    className={`py-3 px-4 rounded-xl border-2 text-[9px] font-black uppercase tracking-widest transition-all ${
                      settings.promptFadeMode === mode.value 
                      ? 'border-north-navy bg-north-navy text-white shadow-md' 
                      : 'border-slate-100 bg-slate-50 text-north-navy hover:border-north-light'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Data Management - To address User's "Lost" data concern */}
          <section className="p-5 bg-north-navy/5 rounded-2xl border border-north-navy/10 space-y-4">
            <h3 className="text-[10px] font-black text-north-navy uppercase tracking-widest">Ritual Data Management</h3>
            <div className="flex gap-3">
               <button 
                onClick={handleExport}
                className="flex-1 py-3 px-4 bg-white border border-north-navy/20 text-north-navy rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/80 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Backup
              </button>
              <button 
                onClick={handleImportClick}
                className="flex-1 py-3 px-4 bg-white border border-north-navy/20 text-north-navy rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/80 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l4-4m0 0l4 4m-4-4v12" />
                </svg>
                Restore
              </button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".json" 
              onChange={handleFileChange} 
            />
            <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest text-center leading-relaxed">
              Export your custom rituals to a file periodically to prevent data loss.
            </p>
          </section>

          {/* Lock Application */}
          <section className="pt-4">
            <button
              onClick={() => {
                localStorage.removeItem('app_access_granted');
                localStorage.removeItem('ritual_access_level');
                window.location.reload();
              }}
              className="w-full flex items-center justify-between p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-all">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Lock Application</p>
                  <p className="text-[8px] opacity-70 font-bold uppercase tracking-widest">Requires access code on next visit</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 opacity-30" />
            </button>
          </section>

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
        
        <div className="p-8 bg-slate-50 space-y-4">
          <button 
            onClick={onReset}
            className="w-full py-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-north-navy transition-colors"
          >
            Reset to Defaults
          </button>
          <button 
            onClick={onClose}
            className="w-full py-5 bg-north-navy text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:shadow-2xl transition-all shadow-lg"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsOverlay;
