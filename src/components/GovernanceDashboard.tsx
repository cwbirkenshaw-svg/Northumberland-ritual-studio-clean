import React, { useState, useRef } from 'react';
import { RitualPack } from '../src/types';
import { validatePack } from '../services/governanceService';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, CheckCircle, AlertCircle, FileText, Lock, User, Info, ArrowLeft, X } from 'lucide-react';

interface GovernanceDashboardProps {
  onConfirmSave: (pack: RitualPack) => void;
  onCancel: () => void;
  existingPacks: RitualPack[];
}

const GovernanceDashboard: React.FC<GovernanceDashboardProps> = ({ onConfirmSave, onCancel, existingPacks }) => {
  const [view, setView] = useState<'list' | 'upload'>('list');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [uploadedJson, setUploadedJson] = useState<string>('');
  const [validationResult, setValidationResult] = useState<{ pass: boolean; errors: string[] } | null>(null);
  const [previewPack, setPreviewPack] = useState<RitualPack | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const customPacks = existingPacks.filter(p => p.pack_type === 'CUSTOM');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setUploadedJson(content);
      processUpload(content);
    };
    reader.readAsText(file);
  };

  const processUpload = (json: string) => {
    try {
      const pack = JSON.parse(json);
      const result = validatePack(pack);
      setValidationResult(result);
      if (result.pass) {
        setPreviewPack(pack as RitualPack);
      } else {
        setPreviewPack(null);
      }
      setStep(2);
    } catch (e) {
      setValidationResult({ pass: false, errors: ["Invalid file format"] });
      setPreviewPack(null);
      setStep(2);
    }
  };

  const handleConfirm = () => {
    if (previewPack) {
      onConfirmSave(previewPack);
      setStep(3);
    }
  };

  return (
    <div className="fixed inset-0 bg-north-navy/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden flex flex-col shadow-2xl border border-white/20"
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 rounded-xl">
              {view === 'list' ? <FileText className="w-6 h-6 text-indigo-600" /> : <Upload className="w-6 h-6 text-indigo-600" />}
            </div>
            <div>
              <h2 className="text-xl font-black text-north-navy uppercase tracking-tight">
                {view === 'list' ? "My Learning Copies" : step === 1 ? "Add a Learning Copy" : step === 2 ? "Review Learning Copy" : "Learning Copy Saved"}
              </h2>
            </div>
          </div>
          {(view === 'list' || step !== 3) && (
            <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-8 md:p-10 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {view === 'list' ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {customPacks.length > 0 ? (
                  <div className="space-y-3">
                    {customPacks.map((pack) => (
                      <div key={pack.pack_id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-black text-north-navy uppercase tracking-tight">{pack.pack_name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{pack.lodge_name || 'Private Copy'}</p>
                        </div>
                        <div className="p-2 bg-white rounded-lg text-indigo-500 shadow-sm">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                      <FileText size={32} />
                    </div>
                    <p className="text-sm font-medium text-slate-500">You have not added any Learning Copies yet.</p>
                  </div>
                )}

                <button
                  onClick={() => {
                    setStep(1);
                    setView('upload');
                  }}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Add Learning Copy
                </button>
              </motion.div>
            ) : step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Upload your lodge or province wording to create a private learning copy.
                  </p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    Core rituals remain unchanged.
                  </p>
                </div>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 flex flex-col items-center justify-center gap-4 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer group"
                >
                  <div className="p-4 bg-indigo-50 rounded-full text-indigo-600 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-black text-north-navy uppercase tracking-widest">Upload File</span>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                    accept=".json" 
                    className="hidden" 
                  />
                </div>
              </motion.div>
            ) : step === 2 ? (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {validationResult?.pass ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                      <span className="text-sm font-black text-emerald-700 uppercase tracking-tight">File accepted</span>
                    </div>

                    {previewPack && (
                      <div className="bg-slate-50 rounded-[2rem] p-6 space-y-6 border border-slate-100">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Pack Name</p>
                            <p className="text-sm text-north-navy font-bold">{previewPack.pack_name}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Lodge</p>
                            <p className="text-sm text-north-navy font-bold">{previewPack.lodge_name || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Sections</p>
                            <p className="text-sm text-north-navy font-bold">{previewPack.sections.length}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Officers</p>
                            <p className="text-sm text-north-navy font-bold">{previewPack.roles.length}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={handleConfirm}
                      className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl active:scale-95"
                    >
                      Save Learning Copy
                    </button>
                    
                    <button 
                      onClick={() => setStep(1)}
                      className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                    >
                      Upload a different file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 text-center py-8">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500 mb-4">
                      <AlertCircle size={40} />
                    </div>
                    <h3 className="text-lg font-black text-north-navy uppercase tracking-tight">
                      This file could not be read.
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                      Please check the format and try again.
                    </p>
                    <button 
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-slate-100 text-north-navy rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all mt-4"
                    >
                      <ArrowLeft className="w-4 h-4" /> Try Again
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8 text-center py-4"
              >
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 mb-2">
                  <CheckCircle size={40} />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-north-navy uppercase tracking-tight">Learning Copy Saved</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    This copy is stored on your account and does not change the Core rituals.
                  </p>
                </div>

                <div className="space-y-3 pt-4">
                  <button 
                    onClick={onCancel}
                    className="w-full py-5 bg-north-navy text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl active:scale-95"
                  >
                    Open Copy
                  </button>
                  <button 
                    onClick={() => setView('list')}
                    className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Back to Learning Copies
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default GovernanceDashboard;
