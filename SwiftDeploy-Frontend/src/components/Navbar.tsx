import React from 'react';
import { Github, Zap } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="sticky top-0 backdrop-blur-md bg-black/30 border-b border-green-500/20 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-green-500" />
          <span className="text-xl font-bold bg-gradient-to-r from-green-500 to-green-200 bg-clip-text text-transparent">
            SwiftDeploy
          </span>
        </div>
        <a
          href="https://github.com/yash-tingre-10/SwiftDeploy"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-green-500/30 hover:bg-green-500/10 transition-all"
        >
          <Github className="w-5 h-5" />
          <span>GitHub</span>
        </a>
      </div>
    </nav>
  );
}