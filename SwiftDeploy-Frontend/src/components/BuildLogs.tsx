import React from 'react';

interface BuildLogsProps {
  logs: string[];
  isProcessing: boolean;
}

export function BuildLogs({ logs, isProcessing }: BuildLogsProps) {
  return (
    <div className="w-full max-w-2xl bg-black/50 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
      <h2 className="text-green-500 text-xl mb-4">Build Logs</h2>
      <div className="space-y-2 font-mono text-sm max-h-[300px] overflow-y-auto">
        {logs.map((log, index) => (
          <div 
            key={index} 
            className={`text-green-400 ${
              index === logs.length - 1 && isProcessing ? 'animate-pulse' : ''
            }`}
          >
            &gt; {log}
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-green-500/50 italic">
            Waiting for repository URL...
          </div>
        )}
      </div>
    </div>
  );
}