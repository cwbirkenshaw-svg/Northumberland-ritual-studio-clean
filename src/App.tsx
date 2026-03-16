
import React, { useState, useMemo, useEffect } from 'react';

import { PLATFORM, EDITION, FULL_BRAND } from './config/editionConfig';
import { AppSettings, BgColor, RevealLevel, RitualSection, Office, Degree, Working, PromptFadeMode, RitualPack, AccessLevel } from './types';

import { OFFICE_ICONS, AVAILABLE_VOICES, UNLOCK_CODES } from './constants';
import { SAMPLE_RITUALS } from './data/rituals';

import SettingsOverlay from './components/SettingsOverlay';
import Memorizer from './components/Memorizer';
import RitualCreator from './components/RitualCreator';
import GovernanceDashboard from './components/GovernanceDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import Logo from './components/Logo';
import { AccessGate } from './components/AccessGate';

import { canAccessDegree, canAccessOfficerContent, canAccessRitual } from './utils/accessUtils';
import { normalizeOfficer, normalizeWorking, buildWorkingsIndex } from './utils/officerUtils';

import { Lock, Upload, User, ShieldCheck, Key } from 'lucide-react';

const DEFAULT_SETTINGS: AppSettings = {
  bgColor: BgColor.WHITE,
  playbackSpeed: 1.0, 
  revealLevel: RevealLevel.FULL,
  voiceName: AVAILABLE_VOICES[0].id,
  voiceStyle: 'steady',
  paperTint: 'white',
  readingSupport: false,
  textScale: 1.0,
  reduceMotion: false,
  assistMode: false,
  focusMode: false,
  lineFocus: false,
  highlightCurrentBlock: false,
  promptFadeMode: PromptFadeMode.OFF,
};

const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [appAccessGranted, setAppAccessGranted] = useState(false);
  const [ritualAccessLevel, setRitualAccessLevel] = useState<AccessLevel>(AccessLevel.GUEST);
  const [unlockCode, setUnlockCode] = useState('');
  const [unlockError, setUnlockError] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isLearningCopiesOpen, setIsLearningCopiesOpen] = useState(false);
  const [showStartupNotice, setShowStartupNotice] = useState(true);
  const [customRituals, setCustomRituals] = useState<RitualSection[]>([]);
  const [customPacks, setCustomPacks] = useState<RitualPack[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  
  const [selectedWorking, setSelectedWorking] = useState<Working | null>(null);
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
  const [selectedDegree, setSelectedDegree] = useState<Degree | null>(null);
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
  const [selectedSection, setSelectedSection] = useState<RitualSection | null>(null);
  const [quickAccessType, setQuickAccessType] = useState<'Opening' | 'Closing' | null>(null);

  useEffect(() => {
    const savedAppAccess = localStorage.getItem('app_access_granted');
    if (savedAppAccess === 'true') setAppAccessGranted(true);

    const savedLevel = localStorage.getItem('ritual_access_level');
    if (savedLevel) setRitualAccessLevel(savedLevel as AccessLevel);

    const savedPrefs = localStorage.getItem('ritualStudioPreferences');
    if (savedPrefs) {
      try {
        const parsed = JSON.parse(savedPrefs);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to load preferences", e);
      }
    }
    
    const savedRituals = localStorage.getItem('custom_rituals_v2');
    if (savedRituals) {
      try {
        setCustomRituals(JSON.parse(savedRituals));
      } catch (e) {
        // Fallback for older version
        const oldSaved = localStorage.getItem('custom_rituals');
        if (oldSaved) {
            try { setCustomRituals(JSON.parse(oldSaved)); } catch (e2) {}
        }
      }
    }

    const savedPacks = localStorage.getItem('custom_ritual_packs');
    if (savedPacks) {
      try {
        setCustomPacks(JSON.parse(savedPacks));
      } catch (e) {
        console.error("Failed to load custom packs", e);
      }
    }
  }, []);

  // Load recently viewed from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recently_viewed_rituals');
    if (saved) {
      try {
        setRecentlyViewed(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recently viewed", e);
      }
    }
  }, []);

  // Save recently viewed to localStorage
  const addToRecentlyViewed = (ritualId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== ritualId);
      const updated = [ritualId, ...filtered].slice(0, 5);
      localStorage.setItem('recently_viewed_rituals', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    const isSupportOn = settings.readingSupport;
    const scale = settings.textScale || 1.0;
    
    // Apply Font and Scale
    root.style.setProperty('--font-family', isSupportOn ? '"OpenDyslexic", Verdana, Arial, sans-serif' : "'Lexend', sans-serif");
    root.style.setProperty('--font-scale', scale.toString());
    root.style.setProperty('--line-height', isSupportOn ? '1.8' : '1.6');
    root.style.setProperty('--letter-spacing', isSupportOn ? '0.03em' : 'normal');
    root.style.setProperty('--word-spacing', isSupportOn ? '0.06em' : 'normal');
    root.style.setProperty('--content-max-width', isSupportOn ? '720px' : '920px');
    root.style.setProperty('--paragraph-spacing', isSupportOn ? '1.5rem' : '0');
    
    // Apply Paper Tint
    let bg = '#ffffff';
    let text = '#1a1a1a';
    if (settings.paperTint === 'cream') bg = '#FDF5E6';
    if (settings.paperTint === 'mint') bg = '#F0FFF0';
    if (settings.paperTint === 'blue') bg = '#e0f2fe';
    if (settings.paperTint === 'peach') bg = '#FFE5D0';
    
    root.style.setProperty('--paper-bg', bg);
    root.style.setProperty('--text-color', text);
    
    // Apply Reduce Motion
    if (settings.reduceMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }, [settings.readingSupport, settings.paperTint, settings.textScale, settings.reduceMotion]);

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('ritualStudioPreferences', JSON.stringify({
      voiceStyle: newSettings.voiceStyle,
      paperTint: newSettings.paperTint,
      readingSupport: newSettings.readingSupport,
      textScale: newSettings.textScale,
      reduceMotion: newSettings.reduceMotion,
      assistMode: newSettings.assistMode,
      focusMode: newSettings.focusMode,
      highlightCurrentBlock: newSettings.highlightCurrentBlock,
      promptFadeMode: newSettings.promptFadeMode,
      // Also sync legacy
      bgColor: newSettings.bgColor,
      voiceName: newSettings.voiceName
    }));
    setIsSettingsOpen(false);
  };

  const handleResetSettings = () => {
    handleSaveSettings(DEFAULT_SETTINGS);
  };

  const saveCustomRitual = (newRitual: RitualSection) => {
    const updated = [...customRituals, newRitual];
    setCustomRituals(updated);
    localStorage.setItem('custom_rituals_v2', JSON.stringify(updated));
  };

  const handleImportRituals = (imported: RitualSection[]) => {
    const updated = [...customRituals, ...imported];
    setCustomRituals(updated);
    localStorage.setItem('custom_rituals_v2', JSON.stringify(updated));
  };

  const handleSavePack = (pack: RitualPack) => {
    const updated = [...customPacks, pack];
    setCustomPacks(updated);
    localStorage.setItem('custom_ritual_packs', JSON.stringify(updated));
    setIsLearningCopiesOpen(false);
  };

  const handleGrantAppAccess = () => {
    setAppAccessGranted(true);
    localStorage.setItem('app_access_granted', 'true');
  };

  const handleUnlockLevel = (code: string) => {
    const upperCode = code.trim().toUpperCase();
    let newLevel: AccessLevel | null = null;

    if (upperCode === UNLOCK_CODES.EA) newLevel = AccessLevel.EA;
    else if (upperCode === UNLOCK_CODES.FC) newLevel = AccessLevel.FC;
    else if (upperCode === UNLOCK_CODES.MM) newLevel = AccessLevel.MM;
    else if (upperCode === UNLOCK_CODES.OFFICER) newLevel = AccessLevel.OFFICER;

    if (newLevel) {
      setRitualAccessLevel(newLevel);
      localStorage.setItem('ritual_access_level', newLevel);
      setUnlockCode('');
      setShowUnlockModal(false);
      return true;
    }
    return false;
  };

  const allRituals = useMemo(() => {
    const packRituals: RitualSection[] = [];
    try {
      customPacks.forEach(pack => {
        if (!pack || !Array.isArray(pack.sections)) return;
        
        pack.sections.forEach(section => {
          if (!section || !Array.isArray(section.steps)) return;
          
          const { key: wKey, title: wTitle } = normalizeWorking(section.title);

          const normalizedSteps = section.steps.map(step => ({
            ...step,
            officerKey: normalizeOfficer(step.officer || ""),
            workingKey: wKey,
            workingTitle: wTitle
          }));

          packRituals.push({
            id: `${pack.pack_id}-${section.id}`,
            degree: section.degree,
            working: pack.working || (pack.pack_name === "Northumberland" ? Working.NORTHUMBERLAND : Working.EMULATION),
            title: section.title || "Untitled Section",
            office: (section.steps[0]?.officer as Office) || Office.WM,
            officerKey: normalizeOfficer(section.steps[0]?.officer || ""),
            workingKey: wKey,
            content: section.steps.map(s => s?.text || ""),
            steps: normalizedSteps,
            isCustom: pack.pack_type === "CUSTOM",
            pack_id: pack.pack_id
          });
        });
      });
    } catch (err) {
      console.error("Error constructing ritual list:", err);
    }

    // Normalize SAMPLE_RITUALS and customRituals
    const normalizedLegacy = [...SAMPLE_RITUALS, ...customRituals].map(r => {
      const { key: wKey, title: wTitle } = normalizeWorking(r.title);
      const offKey = normalizeOfficer(r.office || "");
      
      // If steps are missing, generate them from content
      const steps = r.steps || r.content.map((text, i) => ({
        seq: (i + 1) * 10,
        officer: r.office || "ALL",
        officerKey: offKey,
        workingKey: wKey,
        workingTitle: wTitle,
        type: "speech" as const,
        text
      }));

      return {
        ...r,
        officerKey: offKey,
        workingKey: wKey,
        steps
      };
    });

    return [...normalizedLegacy, ...packRituals].filter(r => 
      canAccessRitual(ritualAccessLevel, r.degree, r.office)
    );
  }, [customRituals, customPacks, ritualAccessLevel]);

  const filteredRituals = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return allRituals.filter(r => 
      r.title.toLowerCase().includes(query) || 
      r.degree.toLowerCase().includes(query) ||
      (r.office && r.office.toLowerCase().includes(query))
    );
  }, [allRituals, searchQuery]);

  const handleSelectSection = (section: RitualSection) => {
    setSelectedSection(section);
    addToRecentlyViewed(section.id);
  };

  const filteredRitualsByWorking = useMemo(() => {
    if (selectedPackId) {
      // If a specific pack is selected, only show rituals from that pack
      return allRituals.filter(r => r.id.startsWith(selectedPackId));
    }
    if (!selectedWorking) return [];
    // For core rituals, filter by working and ensure they are not custom
    return allRituals.filter(r => r.working === selectedWorking && !r.isCustom); 
  }, [selectedWorking, selectedPackId, allRituals]);

  // Ensure all officers are visible for EVERY degree as requested
  const availableOfficesForDegree = useMemo(() => {
    if (!selectedDegree) return [];
    
    // Base offices available to candidates/guests
    const baseOffices = [Office.CANDIDATE];
    
    // Officer content only available if level is OFFICER
    if (ritualAccessLevel === AccessLevel.OFFICER) {
      return [
        'ALL' as Office,
        Office.WM, Office.IPM, Office.SW, Office.JW, 
        Office.SD, Office.JD, Office.IG, Office.TYLER, 
        Office.DC, Office.CHAPLAIN, Office.CANDIDATE
      ];
    }

    return baseOffices;
  }, [selectedDegree, ritualAccessLevel]);

  const officeRituals = useMemo(() => {
    if (!selectedDegree || !selectedOffice) return [];
    
    return buildWorkingsIndex(selectedDegree, selectedOffice, filteredRitualsByWorking);
  }, [filteredRitualsByWorking, selectedDegree, selectedOffice]);

  const quickAccessSections = useMemo(() => {
    if (!quickAccessType) return [];
    
    // For quick access, we want to show all officers for that working type
    const results: any[] = [];
    const { key: targetKey } = normalizeWorking(quickAccessType);

    filteredRitualsByWorking.forEach(section => {
      const { key: wKey } = normalizeWorking(section.title);
      if (wKey === targetKey) {
        // If it's a multi-officer section (like Emulation), we might want to split it?
        // Actually, let's just show the section as is for now, or split if it's core.
        results.push(section);
      }
    });
    return results;
  }, [filteredRitualsByWorking, quickAccessType]);

  const resetSelection = () => {
    if (selectedSection) {
      setSelectedSection(null);
    }
    else if (selectedOffice) setSelectedOffice(null);
    else if (selectedDegree) setSelectedDegree(null);
    else if (quickAccessType) setQuickAccessType(null);
    else {
      setSelectedWorking(null);
      setSelectedPackId(null);
    }
  };

  if (!appAccessGranted) {
    return (
      <ErrorBoundary>
        <AccessGate onGrantAccess={handleGrantAppAccess} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`min-h-screen transition-all duration-700 flex flex-col font-sans ${settings.bgColor}`}>
      <header className={`bg-white/95 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200 p-3 md:p-4 md:px-8 flex justify-between items-center shadow-sm transition-all duration-500 ${settings.focusMode && selectedSection ? 'opacity-0 -translate-y-full pointer-events-none h-0 p-0 overflow-hidden' : 'opacity-100 translate-y-0'}`}>
        <div className="flex items-center space-x-2 md:space-x-4">
          <button 
            onClick={resetSelection}
            className={`p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-90 shadow-sm ${(selectedWorking || selectedDegree || selectedOffice || selectedSection || quickAccessType) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <svg className="w-5 h-5 text-north-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <Logo variant="compact" />
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowUnlockModal(true)}
            className="p-2.5 bg-white shadow-sm border border-slate-200 rounded-xl hover:shadow-md transition-all active:scale-90 flex items-center gap-2"
            title="Unlock Progression"
          >
            <Key className="w-5 h-5 text-north-gold" />
            <span className="hidden md:inline text-[10px] font-black text-north-navy uppercase tracking-widest">{ritualAccessLevel}</span>
          </button>
          <button 
            onClick={() => setIsLearningCopiesOpen(true)}
            className="p-2.5 bg-north-gold text-white shadow-md border border-north-gold rounded-xl hover:brightness-110 transition-all active:scale-90"
            title="Add Learning Copy"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 bg-white shadow-sm border border-slate-200 rounded-xl hover:shadow-md transition-all active:scale-90"
          >
            <svg className="w-5 h-5 text-north-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-1 relative z-10 overflow-y-auto pb-10">
        {!selectedWorking ? (
          <div className="flex flex-col min-h-[calc(100vh-80px)]">
            <div className="flex-1 bg-north-navy flex items-center justify-center p-8 md:p-20 relative overflow-hidden">
               <Logo variant="full" className="animate-in zoom-in fade-in duration-1000" />
            </div>

            <div className="bg-slate-50 p-6 md:p-12 space-y-10 animate-in slide-in-from-bottom-12 duration-700">
               <div className="max-w-4xl mx-auto space-y-10">
                 {/* Core Workings */}
                 <div className="space-y-4">
                   <div className="flex items-center justify-between px-2">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Workings</p>
                     <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
                       <Lock className="w-2 h-2" /> Immutable
                     </span>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {[Working.NORTHUMBERLAND, Working.EMULATION].map((work) => (
                      <button 
                        key={work}
                        onClick={() => {
                          setSelectedWorking(work);
                          setSelectedPackId(null);
                        }}
                        className="group relative bg-white p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-slate-200 shadow-xl hover:-translate-y-1 transition-all duration-500 text-left overflow-hidden flex flex-col justify-between"
                      >
                        <div className="relative z-10 flex items-start justify-between w-full">
                          <div className="pr-4">
                            <h3 className="logo-text text-xl md:text-3xl font-black text-north-navy uppercase tracking-tight leading-none mb-1">
                              {work === Working.NORTHUMBERLAND ? 'Northumberland' : 'Emulation'}
                            </h3>
                            <p className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                              {work === Working.NORTHUMBERLAND ? 'Provincial Standard' : 'Standard Ritual'}
                            </p>
                          </div>
                          <div className="bg-north-navy text-white p-4 rounded-xl group-hover:bg-north-gold group-hover:text-white transition-all shadow-md shrink-0">
                             <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </button>
                    ))}
                   </div>
                 </div>

                 {/* Custom Areas */}
                 <div className="space-y-4 pt-4">
                   <div className="flex items-center justify-between px-2">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Custom Areas</p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <button 
                        onClick={() => {
                          setSelectedWorking(Working.CUSTOM_RITUAL);
                          setSelectedPackId(null);
                        }}
                        className="group relative bg-white p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-slate-200 shadow-xl hover:-translate-y-1 transition-all duration-500 text-left overflow-hidden flex flex-col justify-between"
                      >
                        <div className="relative z-10 flex items-start justify-between w-full">
                          <div className="pr-4">
                            <h3 className="logo-text text-xl md:text-3xl font-black text-north-navy uppercase tracking-tight leading-none mb-1">
                              Custom Ritual
                            </h3>
                            <p className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-2">
                              Lodge Rehearsal Notes & Prompts
                            </p>
                          </div>
                          <div className="bg-slate-100 text-north-navy p-4 rounded-xl group-hover:bg-north-navy group-hover:text-white transition-all shadow-md shrink-0">
                             <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </button>

                      <button 
                        onClick={() => {
                          setSelectedWorking(Working.YOUR_OWN_RITUAL);
                          setSelectedPackId(null);
                        }}
                        className="group relative bg-white p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-slate-200 shadow-xl hover:-translate-y-1 transition-all duration-500 text-left overflow-hidden flex flex-col justify-between"
                      >
                        <div className="relative z-10 flex items-start justify-between w-full">
                          <div className="pr-4">
                            <h3 className="logo-text text-xl md:text-3xl font-black text-north-navy uppercase tracking-tight leading-none mb-1">
                              Your Own Ritual
                            </h3>
                            <p className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-2">
                              Create, Import & Edit
                            </p>
                          </div>
                          <div className="bg-slate-100 text-north-navy p-4 rounded-xl group-hover:bg-north-navy group-hover:text-white transition-all shadow-md shrink-0">
                             <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </button>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        ) : !quickAccessType && !selectedDegree && !selectedSection ? (
          <div className="max-w-4xl mx-auto px-5 py-6 md:py-12 space-y-8 md:space-y-10 animate-in fade-in slide-in-from-right-10 duration-500">
            {/* Search Bar */}
            <div className="w-full max-w-md mx-auto">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search rituals, degrees, or offices..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-north-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-north-gold/30 transition-all shadow-sm"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-north-navy"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {searchQuery ? (
              <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-top-4 duration-300">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Search Results</h3>
                <div className="space-y-3">
                  {filteredRituals.length > 0 ? (
                    filteredRituals.map(r => (
                      <button 
                        key={r.id}
                        onClick={() => handleSelectSection(r)}
                        className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-north-gold transition-all"
                      >
                        <div className="text-left">
                          <p className="text-[11px] font-black text-north-navy uppercase tracking-widest">{r.title}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{r.degree} • {r.office || 'General'}</p>
                        </div>
                        <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))
                  ) : (
                    <p className="text-[10px] font-bold text-slate-400 text-center py-8 bg-white/50 rounded-2xl border border-dashed border-slate-200">No rituals found matching your search.</p>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Recently Viewed */}
                {recentlyViewed.length > 0 && (
                  <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Recently Viewed</h3>
                      <button 
                        onClick={() => {
                          setRecentlyViewed([]);
                          localStorage.removeItem('recently_viewed_rituals');
                        }}
                        className="text-[8px] font-black text-slate-400 uppercase tracking-widest hover:text-north-red transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar">
                      {recentlyViewed.map(id => {
                        const ritual = allRituals.find(r => r.id === id);
                        if (!ritual) return null;
                        return (
                          <button 
                            key={id}
                            onClick={() => handleSelectSection(ritual)}
                            className="shrink-0 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm min-w-[160px] text-left hover:border-north-gold transition-all"
                          >
                            <p className="text-[10px] font-black text-north-navy uppercase tracking-widest truncate">{ritual.title}</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{ritual.degree}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedWorking === Working.CUSTOM_RITUAL ? (
                  <div className="space-y-8">
                    <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center space-y-4">
                      <h3 className="text-lg font-black text-north-navy uppercase tracking-tight">Custom Ritual</h3>
                      <p className="text-xs font-bold text-slate-500">
                        Create modified versions for Lodge rehearsal notes, Officer prompt cards, Short-form ceremonies, or Educational versions.
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stored separately from master ritual files.</p>
                      <button 
                        onClick={() => setIsCreatorOpen(true)}
                        className="mt-4 px-6 py-3 bg-north-navy text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all"
                      >
                        Create Custom Ritual
                      </button>
                    </div>
                    {filteredRitualsByWorking.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredRitualsByWorking.map(ritual => (
                          <button 
                            key={ritual.id}
                            onClick={() => handleSelectSection(ritual)}
                            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition-all text-left flex items-center justify-between group w-full"
                          >
                            <div>
                              <h4 className="text-sm font-black text-north-navy uppercase tracking-tight">{ritual.title}</h4>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{ritual.degree} • {ritual.office}</p>
                            </div>
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-300 group-hover:text-indigo-500 transition-colors">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : selectedWorking === Working.YOUR_OWN_RITUAL ? (
                  <div className="space-y-8">
                    <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center space-y-4">
                      <h3 className="text-lg font-black text-north-navy uppercase tracking-tight">Your Own Ritual</h3>
                      <p className="text-xs font-bold text-slate-500">
                        Create your own ritual structure, import ritual text, edit your own workings, and export ritual files.
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Never interacts with master directories.</p>
                      <button 
                        onClick={() => setIsCreatorOpen(true)}
                        className="mt-4 px-6 py-3 bg-north-navy text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all"
                      >
                        Create Your Own Ritual
                      </button>
                    </div>
                    {filteredRitualsByWorking.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredRitualsByWorking.map(ritual => (
                          <button 
                            key={ritual.id}
                            onClick={() => handleSelectSection(ritual)}
                            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition-all text-left flex items-center justify-between group w-full"
                          >
                            <div>
                              <h4 className="text-sm font-black text-north-navy uppercase tracking-tight">{ritual.title}</h4>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{ritual.degree} • {ritual.office}</p>
                            </div>
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-300 group-hover:text-indigo-500 transition-colors">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="flex items-end justify-between border-b border-slate-200 pb-5">
                      <div>
                        <span className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                          {selectedPackId ? "Learning Copy" : "Active Tradition"}
                        </span>
                        <h2 className="logo-text text-2xl md:text-4xl font-black text-north-navy uppercase tracking-tighter leading-none">
                          {selectedPackId ? customPacks.find(p => p.pack_id === selectedPackId)?.pack_name : selectedWorking}
                        </h2>
                      </div>
                    </div>

                    {/* CORE RITUALS */}
                    <div className="space-y-4 md:space-y-6 pt-2">
                      <h4 className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Core Rituals</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                        {[Degree.FIRST, Degree.SECOND, Degree.THIRD, Degree.GENERAL].map((deg) => {
                          const isLocked = !canAccessDegree(ritualAccessLevel, deg);
                          return (
                            <button
                              key={deg}
                              onClick={() => !isLocked && setSelectedDegree(deg)}
                              disabled={isLocked}
                              className={`bg-white p-4 md:p-8 rounded-xl md:rounded-[2.5rem] border ${isLocked ? 'border-slate-100 opacity-60 grayscale' : 'border-slate-200 hover:border-north-gold hover:shadow-xl'} transition-all flex items-center justify-between group relative overflow-hidden w-full text-left`}
                            >
                              <div>
                                <h3 className="logo-text text-base md:text-2xl font-black text-north-navy uppercase tracking-tight">
                                  {deg === Degree.GENERAL ? 'Installation' : deg.split(' ')[0]}
                                </h3>
                                {isLocked && (
                                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Locked</p>
                                )}
                              </div>
                              <div className={`${isLocked ? 'bg-slate-50 text-slate-300' : 'bg-slate-100 text-north-navy group-hover:bg-north-navy group-hover:text-white'} p-2.5 md:p-4 rounded-lg md:rounded-xl transition-all shadow-sm`}>
                                {isLocked ? (
                                  <Lock className="w-4 h-4 md:w-6 md:h-6" />
                                ) : (
                                  <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" />
                                  </svg>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* LEARNING COPIES */}
                    <div className="space-y-4 md:space-y-6 pt-8">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h4 className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Learning Copies</h4>
                        <button 
                          onClick={() => setIsLearningCopiesOpen(true)}
                          className="px-4 py-2 bg-north-gold text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-sm flex items-center gap-2"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Learning Copy
                        </button>
                      </div>
                      
                      {customPacks.filter(p => p.working === selectedWorking).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {customPacks.filter(p => p.working === selectedWorking).map((pack) => (
                            <button 
                              key={pack.pack_id}
                              onClick={() => {
                                setSelectedPackId(pack.pack_id);
                                setSelectedWorking(pack.working || Working.NORTHUMBERLAND);
                              }}
                              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition-all text-left flex items-center justify-between group w-full"
                            >
                              <div>
                                <h4 className="text-sm font-black text-north-navy uppercase tracking-tight">{pack.pack_name}</h4>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{pack.lodge_name || 'Private Copy'}</p>
                              </div>
                              <div className="p-2 bg-slate-50 rounded-lg text-slate-300 group-hover:text-indigo-500 transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center space-y-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Learning Copies added yet.</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
          </>
        )}
        </div>
      ) : (
          <div className="max-w-4xl mx-auto px-5 py-6">
            {quickAccessType && !selectedSection && (
               <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="logo-text text-2xl md:text-5xl font-black text-north-navy uppercase">{quickAccessType}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-16">
                    {quickAccessSections.map((ritual) => (
                      <button key={ritual.id} onClick={() => handleSelectSection(ritual)} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl flex items-center space-x-4 group text-left">
                        <div className="bg-slate-100 p-3.5 rounded-xl text-north-navy group-hover:bg-north-gold group-hover:text-white transition-all">
                          {OFFICE_ICONS[ritual.office]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="logo-text text-base font-black text-north-navy leading-tight mb-1 truncate">{ritual.title}</h3>
                        </div>
                      </button>
                    ))}
                  </div>
               </div>
            )}

            {selectedDegree && !selectedOffice && !selectedSection && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="logo-text text-2xl md:text-5xl font-black text-north-navy uppercase">{selectedDegree}</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {availableOfficesForDegree.map((off) => (
                    <button key={off} onClick={() => setSelectedOffice(off)} className="bg-white p-6 rounded-[2rem] border border-slate-200 hover:shadow-xl hover:border-north-gold transition-all flex flex-col items-center justify-center space-y-3 group">
                      <div className="bg-slate-50 p-4 rounded-2xl text-north-navy group-hover:bg-north-gold group-hover:text-white transition-all">
                        {OFFICE_ICONS[off]}
                      </div>
                      <span className="logo-text text-[10px] font-black text-north-navy uppercase text-center leading-none tracking-tighter">
                        {off}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedOffice && !selectedSection && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-3 text-north-navy mb-2">
                    {OFFICE_ICONS[selectedOffice]}
                    <h2 className="logo-text text-2xl md:text-4xl font-black uppercase">{selectedOffice}</h2>
                  </div>
                  <p className="text-slate-500 font-bold uppercase text-[8px] tracking-[0.3em]">{selectedDegree}</p>
                </div>
                
                {officeRituals.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-16">
                    {officeRituals.map((ritual: any) => (
                      <button key={ritual.id} onClick={() => handleSelectSection(ritual.section)} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl flex items-center justify-between group text-left">
                        <div>
                          <h3 className="logo-text text-base font-black text-north-navy leading-tight">{ritual.title}</h3>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{ritual.count} Blocks</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl group-hover:bg-north-gold group-hover:text-white transition-all">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="max-w-md mx-auto p-12 bg-white rounded-[2.5rem] border border-slate-100 text-center space-y-6 shadow-sm">
                    <div className="p-6 bg-slate-50 rounded-full inline-block text-slate-300">
                      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <p className="text-slate-500 font-medium">No sample rituals found for this officer in the {selectedDegree}.</p>
                    <button 
                      onClick={() => setIsCreatorOpen(true)}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-north-navy text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Create Ritual</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {selectedSection && (
               <div className="h-full flex flex-col animate-in fade-in duration-700 relative">
                  {/* Updated prominent 'Blue Box' header for Ritual View */}
                  <div className="bg-north-navy shadow-lg border-b border-white/10 p-4 flex flex-col items-center justify-center sticky top-0 z-30">
                    <div className="flex flex-col items-center gap-1 mb-1">
                      <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[8px] font-black uppercase tracking-widest rounded border border-indigo-500/30 flex items-center gap-1">
                        {selectedSection.isCustom ? (
                          <><User className="w-2 h-2" /> Learning Copy</>
                        ) : (
                          <><Lock className="w-2 h-2" /> Core Ritual</>
                        )}
                      </span>
                      <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">
                        {selectedSection.isCustom ? "Private practice copy" : "Immutable provincial standard"}
                      </p>
                    </div>
                    <h3 className="logo-text font-black text-white uppercase text-[12px] md:text-base text-center tracking-tight leading-tight">
                        {selectedSection.title}
                    </h3>
                    <div className="h-[1px] w-24 bg-north-gold/40 mt-1"></div>
                  </div>
                  <div className="flex-1 min-h-[400px]">
                    <Memorizer section={selectedSection} settings={settings} setSettings={setSettings} selectedOffice={selectedOffice} />
                  </div>
                  <div className="px-4 py-6 flex flex-col items-center pb-24">
                    <div className="flex flex-wrap justify-center gap-2.5 mb-4">
                      {Object.values(RevealLevel).map((level) => (
                        <button key={level} onClick={() => setSettings({...settings, revealLevel: level})} className={`px-5 py-2.5 rounded-xl text-[7px] font-black uppercase tracking-widest transition-all border-2 ${settings.revealLevel === level ? 'bg-north-navy text-white border-north-navy shadow-lg' : 'bg-white text-north-navy border-slate-200'}`}>
                          {level}
                        </button>
                      ))}
                    </div>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest text-center max-w-xs leading-relaxed">
                      {settings.revealLevel === RevealLevel.FIRST_LETTERS ? 
                        "Shows the first letter of each word and masks the rest. Punctuation and spacing are preserved." :
                        settings.revealLevel === RevealLevel.BLIND ?
                        "Hides all text for pure audio-based memorisation. Focus on the cadence." :
                        "Full text display for initial study and reference."
                      }
                    </p>
                  </div>
               </div>
            )}
          </div>
        )}
      </main>

      {isLearningCopiesOpen && (
        <GovernanceDashboard 
          existingPacks={customPacks}
          onConfirmSave={handleSavePack}
          onCancel={() => setIsLearningCopiesOpen(false)}
        />
      )}

      {isSettingsOpen && (
        <SettingsOverlay 
          settings={settings} 
          setSettings={setSettings} 
          customRituals={customRituals}
          onImport={handleImportRituals}
          onReset={handleResetSettings}
          onClose={() => handleSaveSettings(settings)} 
        />
      )}
      
      {isCreatorOpen && selectedWorking && (
        <RitualCreator 
          working={selectedWorking}
          onSave={saveCustomRitual} 
          onClose={() => setIsCreatorOpen(false)} 
        />
      )}

      {showUnlockModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-north-navy/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 md:p-10 text-center space-y-6 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-north-gold/10 rounded-full flex items-center justify-center mx-auto">
              <Key className="w-8 h-8 text-north-gold" />
            </div>
            <div className="space-y-2">
              <h2 className="logo-text text-2xl font-black text-north-navy uppercase">Unlock Progression</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enter your degree unlock code</p>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!handleUnlockLevel(unlockCode)) {
                setUnlockError(true);
                setTimeout(() => setUnlockError(false), 2000);
              }
            }} className="space-y-4">
              <input 
                type="text"
                value={unlockCode}
                onChange={(e) => setUnlockCode(e.target.value)}
                placeholder="UNLOCK CODE"
                className={`w-full bg-slate-50 border ${unlockError ? 'border-red-500' : 'border-slate-200'} rounded-xl py-4 px-4 text-center font-black text-north-navy placeholder:text-slate-300 focus:outline-none focus:border-north-gold transition-all uppercase tracking-widest`}
              />
              {unlockError && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Invalid Unlock Code</p>}
              
              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowUnlockModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-north-navy text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:brightness-110 transition-all shadow-lg"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showStartupNotice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-north-navy/95 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 md:p-10 text-center space-y-8 animate-in zoom-in duration-500 border border-white/20">
            <div className="w-20 h-20 bg-north-navy rounded-full flex items-center justify-center mx-auto shadow-xl border-4 border-north-gold/20">
              <svg className="w-10 h-10 text-north-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="logo-text text-2xl md:text-3xl font-semibold text-north-navy uppercase tracking-wide leading-none">
                  Ritual Studio Ready
                </h2>
                <div className="flex flex-col gap-1 mt-2">
                  <span className="text-xs text-zinc-500 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" /> Core rituals: Protected
                  </span>
                  <span className="text-xs text-zinc-500 flex items-center justify-center gap-1">
                    <Upload className="w-3 h-3" /> Learning copies: Enabled
                  </span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="h-0.5 w-16 bg-north-gold/40 mx-auto rounded-full mb-3"></div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Northumberland Edition · Version 4.0
                </p>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                  Ritual Studio
                </p>
              </div>

              <div className="pt-2 space-y-4">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-snug">
                  This platform is proprietary intellectual property <br />
                  owned by Carl Birkenshaw / Birkenshaw Ltd.
                </p>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-snug">
                  Access is restricted to authorised users only. <br />
                  Unauthorised duplication or distribution is prohibited.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowStartupNotice(false)}
              className="w-full py-5 bg-north-navy text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl active:scale-95"
            >
              Enter Secure Portal
            </button>
          </div>
        </div>
      )}

      {/* Global Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8 px-6 text-center space-y-2">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
          © 2026 Carl Birkenshaw / Birkenshaw Ltd. All rights reserved.
        </p>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-md mx-auto">
          {FULL_BRAND}™ is proprietary licensed software.
          Unauthorised copying, reverse engineering, or distribution is prohibited.
        </p>
      </footer>
      </div>
    </ErrorBoundary>
  );
};

export default App;
