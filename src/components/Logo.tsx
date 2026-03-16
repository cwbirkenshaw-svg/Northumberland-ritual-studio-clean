
import React from 'react';
import { PLATFORM, EDITION } from '../config/editionConfig';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'icon';
}

const Logo: React.FC<LogoProps> = ({ className = "", variant = 'full' }) => {
  const icon = (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
      {/* Compass */}
      <path d="M50 15 L80 85 L75 85 L50 25 L25 85 L20 85 Z" />
      <circle cx="50" cy="15" r="5" />
      {/* Square */}
      <path d="M25 50 L50 75 L75 50 L85 60 L50 95 L15 60 Z" />
      {/* Detailing on the square */}
      <rect x="35" y="58" width="5" height="15" transform="rotate(-45 35 58)" opacity="0.3" />
      <rect x="60" y="58" width="5" height="15" transform="rotate(45 60 58)" opacity="0.3" />
    </svg>
  );

  if (variant === 'icon') return <div className={`${className}`}>{icon}</div>;

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-8 h-8 text-north-gold drop-shadow-md">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="logo-text text-sm md:text-lg font-black text-north-navy leading-none tracking-tight">{EDITION.shortName}</span>
          <span className="logo-text text-[10px] md:text-xs font-bold text-north-gold leading-none tracking-[0.1em] drop-shadow-sm">{PLATFORM.name}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <div className="w-24 h-24 md:w-40 md:h-40 text-north-gold mb-4 md:mb-6 drop-shadow-2xl brightness-110">
        {icon}
      </div>
      
      <h1 className="logo-text text-3xl md:text-6xl text-white mb-0 leading-tight drop-shadow-md">{EDITION.name}</h1>
      <h2 className="logo-text text-3xl md:text-6xl text-north-gold mb-6 md:mb-8 leading-none drop-shadow-lg">{PLATFORM.name}</h2>
      
      {/* Elegant Divider with increased opacity and contrast */}
      <div className="flex items-center w-full max-w-[280px] md:max-w-md mb-6">
        <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-north-gold/60 to-north-gold"></div>
        <div className="mx-4 text-north-gold scale-125 drop-shadow-lg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" />
          </svg>
        </div>
        <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent via-north-gold/60 to-north-gold"></div>
      </div>
      
      <p className="text-[10px] md:text-xs font-black text-north-gold/90 tracking-[0.4em] uppercase drop-shadow-sm">
        Learning at your speed
      </p>
    </div>
  );
};

export default Logo;
