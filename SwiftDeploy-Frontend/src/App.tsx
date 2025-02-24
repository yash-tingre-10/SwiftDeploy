import React, { useState } from 'react';
import axios from 'axios';
import { Navbar } from './components/Navbar';
import { BackgroundBlobs } from './components/BackgroundBlobs';
import { SearchForm } from './components/SearchForm';
import { BuildLogs } from './components/BuildLogs';
import { CelebrationEffect } from './components/CelebrationEffect';

function App() {
  const [githubUrl, setGithubUrl] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl.trim()) return;

    setIsProcessing(true);


    const sendData = async () => {
      try {
        const res = await axios.post('/api/example', {
          gitURL: githubUrl,
        });
  
        setResponse(res.data);
      } catch (error) {
        console.error('Error sending data:', error);
      }
    };
    setLogs(prev => [...prev, `Cloning repository: ${githubUrl}`]);

    const processingSteps = [
      { message: 'Installing dependencies...', delay: 1500 },
      { message: 'Running security checks...', delay: 2000 },
      { message: 'Building project...', delay: 2500 },
      { message: 'Running tests...', delay: 2000 },
      { message: 'Optimizing build...', delay: 1500 },
      { message: 'Deployment complete! ✨', delay: 1000 }
    ];

    for (const step of processingSteps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      setLogs(prev => [...prev, step.message]);
    }

    setDeployUrl('https://your-project.netlify.app');
    setIsProcessing(false);
  };

  

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <BackgroundBlobs />
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-col items-center gap-8">
          <SearchForm
            githubUrl={githubUrl}
            isProcessing={isProcessing}
            onSubmit={handleSubmit}
            onChange={setGithubUrl}
          />
          <BuildLogs logs={logs} isProcessing={isProcessing} />
          {deployUrl && !isProcessing && (
            <CelebrationEffect deployUrl={deployUrl} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App