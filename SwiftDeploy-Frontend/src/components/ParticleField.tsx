import React, { useEffect, useState } from 'react';

interface ParticleFieldProps {
  count?: number;
}

export function ParticleField({ count = 50 }: ParticleFieldProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float-particle"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            background: `rgb(${139 + Math.random() * 20}, ${100 + Math.random() * 20}, ${255})`,
            left: `${mousePosition.x + (Math.random() - 0.5) * 100}px`,
            top: `${mousePosition.y + (Math.random() - 0.5) * 100}px`,
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 0 4px rgba(139, 100, 255, 0.8)',
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
}