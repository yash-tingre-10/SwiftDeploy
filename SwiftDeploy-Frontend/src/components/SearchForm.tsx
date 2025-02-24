import React from 'react';
import { Loader2 } from 'lucide-react';

interface SearchFormProps {
  githubUrl: string;
  isProcessing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (value: string) => void;
}

export function SearchForm({ githubUrl, isProcessing, onSubmit, onChange }: SearchFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 w-full max-w-2xl">
      <div className="relative group">
        <input
          type="text"
          placeholder="Enter GitHub Repository URL"
          value={githubUrl}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-black/50 border-2 border-green-500/30 rounded-xl px-6 py-4 text-lg focus:outline-none focus:border-green-500 transition-all backdrop-blur-sm"
          disabled={isProcessing}
        />
        <div className="absolute inset-0 -z-10 bg-green-500/5 blur-xl group-hover:bg-green-500/10 transition-all rounded-xl" />
        
        {/* Particle Animation Container */}
        <div className="absolute -inset-[2px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[-1]">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-particle"
              style={{
                width: '2px',
                height: '2px',
                background: '#22c55e',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                boxShadow: '0 0 2px #22c55e, 0 0 4px #22c55e',
              }}
            />
          ))}
        </div>
      </div>
      <button
        type="submit"
        disabled={isProcessing || !githubUrl.trim()}
        className={`w-full py-3 rounded-xl transition-all font-semibold text-lg flex items-center justify-center gap-2
          ${isProcessing 
            ? 'bg-green-500/20 text-green-500/50 cursor-not-allowed' 
            : githubUrl.trim() 
              ? 'bg-green-500/20 hover:bg-green-500/30 text-green-500' 
              : 'bg-green-500/10 text-green-500/50 cursor-not-allowed'
          }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          'Build Project'
        )}
      </button>
    </form>
  );
}