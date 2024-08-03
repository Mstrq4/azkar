'use client';

import React, { useCallback } from 'react';

interface NoCopyTextProps {
  children: React.ReactNode;
  className?: string;
}

export default function NoCopyText({ children, className }: NoCopyTextProps) {
  const preventCopy = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div 
      className={`select-none ${className || ''}`} 
      onCopy={preventCopy}
      onCut={preventCopy}
      onPaste={preventCopy}
      style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
    >
      {children}
    </div>
  );
}