import React from 'react';

export const Logo = ({ className }: { className?: string }) => (
  <div className={`flex items-center ${className || ''}`}>
    <img src="/logo-p.png" alt="PaleChain" className="h-6 sm:h-7 w-auto select-none pointer-events-none" />
  </div>
);
