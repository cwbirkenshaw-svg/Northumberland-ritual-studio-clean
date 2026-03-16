
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Key, ChevronRight } from 'lucide-react';
import { APP_ACCESS_CODE } from '../constants';

interface AccessGateProps {
  onGrantAccess: () => void;
}

export const AccessGate: React.FC<AccessGateProps> = ({ onGrantAccess }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().toUpperCase() === APP_ACCESS_CODE) {
      onGrantAccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-6">
            <Shield className="w-10 h-10 text-white/80" />
          </div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-3 uppercase">
            Secure Portal
          </h1>
          <p className="text-white/40 text-sm uppercase tracking-[0.2em]">
            Restricted Access • Authorized Personnel Only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-white/20" />
            </div>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ENTER ACCESS CODE"
              className={`w-full bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-white/30 transition-all uppercase tracking-widest text-center`}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black py-4 rounded-xl font-semibold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
          >
            Enter Secure Portal
            <ChevronRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-12 pt-12 border-t border-white/5 text-center">
          <p className="text-white/20 text-[10px] uppercase tracking-widest leading-relaxed">
            This application contains sensitive ritual content.<br />
            Unauthorized access is strictly prohibited.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
