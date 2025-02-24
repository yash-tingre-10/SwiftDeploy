import React from 'react';

export function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <div
        className="absolute w-[300px] h-[300px] rounded-full blur-[70px] animate-blob-main"
        style={{
          background: 'linear-gradient(45deg, rgb(30 143 33), rgb(15 71 16))',
        }}
      />
      <div
        className="absolute w-[250px] h-[250px] rounded-full blur-[80px] animate-blob-secondary"
        style={{
          background: 'linear-gradient(225deg, rgba(30, 143, 33, 0.4), rgba(15, 71, 16, 0.1))',
          mixBlendMode: 'screen',
        }}
      />
      <div
        className="absolute w-[200px] h-[200px] rounded-full blur-[60px] animate-blob-tertiary"
        style={{
          background: 'radial-gradient(circle, rgba(30, 143, 33, 0.3), rgba(15, 71, 16, 0.05))',
          mixBlendMode: 'screen',
        }}
      />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0icmdiYSgwLCAyNTUsIDAsIDAuMDIpIi8+PC9zdmc+')] opacity-20" />
    </div>
  );
}