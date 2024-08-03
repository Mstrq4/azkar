// components/ThemeLanguageProvider.tsx
'use client';

import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeLanguageProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}