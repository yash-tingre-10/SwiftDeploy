import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

interface CelebrationEffectProps {
  deployUrl: string;
}

export function CelebrationEffect({ deployUrl }: CelebrationEffectProps) {
  return (
    <div className="relative w-full max-w-2xl">
      <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-blue-500/20 rounded-2xl blur-xl animate-pulse" />
      <div className="relative bg-black/50 border border-purple-500/30 rounded-xl p-8 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-celebration-particle"
              style={{
                width: '2px',
                height: '2px',
                background: '#8B64FF',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                boxShadow: '0 0 4px #8B64FF',
              }}
            />
          ))}
        </div>
        
        <div className="relative flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8 text-purple-400 animate-spin-slow absolute" />
          <Zap className="w-8 h-8 text-purple-400 animate-pulse" />
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
          Deployment Successful! 🚀
        </h2>
        
        <p className="text-center text-gray-300 mb-6">
          Your project is now live and ready to explore
        </p>
        
        <a
          href={deployUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-3 px-6 rounded-lg bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-blue-500/20 border border-purple-500/30 hover:border-purple-500/50 transition-all group"
        >
          <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent font-semibold group-hover:opacity-80 transition-opacity">
            View Deployment
          </span>
        </a>
      </div>
    </div>
  );
}