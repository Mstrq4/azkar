// components/RadialBackground.tsx
'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const RadialBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const { left, top, width, height } = container.getBoundingClientRect();
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;

      container.style.setProperty('--mouse-x', `${x}`);
      container.style.setProperty('--mouse-y', `${y}`);
    };

    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent"
        style={{
          background: `radial-gradient(circle at calc(var(--mouse-x, 0.5) * 100%) calc(var(--mouse-y, 0.5) * 100%), rgba(var(--primary-rgb), 0.2), transparent 50%)`,
        }}
      />
    </motion.div>
  );
};