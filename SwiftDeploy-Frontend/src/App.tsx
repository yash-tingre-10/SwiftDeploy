import React, { useState, useEffect, useRef } from 'react';
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
    const [projectSlug, setProjectSlug] = useState<string | null>(null);
    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    const emojiLogRegex = /[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}]/u;  // Matches emojis (basic coverage)

    const startPollingLogs = (slug: string) => {
        pollingRef.current = setInterval(async () => {
            try {
                const res = await axios.get(`https://swiftdeploy.onrender.com/logs/${slug}`);
                const allLogs: string[] = res.data || [];

                // Filter logs: only keep ones with emojis
                const emojiLogs = allLogs
                    .map(log => log.replace(/^"|"$/g, ''))  // Remove surrounding quotes if any
                    .filter(log => emojiLogRegex.test(log)); // Only keep logs with emojis

                setLogs(emojiLogs);

                // Check for completion log
                if (emojiLogs.some(log => log.includes('🎉 Deployment process completed successfully!'))) {
                    clearInterval(pollingRef.current!);
                    setIsProcessing(false);
                    setDeployUrl(`https://swiftdeploy-1.onrender.com/index.html?deploy=${slug}`);
                }
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
        }, 5000); // poll every 5 seconds
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!githubUrl.trim()) return;

        setIsProcessing(true);
        setLogs(['🚀 Starting deployment process...']);
        setDeployUrl(null);

        try {
            const res = await axios.post( "https://swiftdeploy.onrender.com/project", { gitURL: githubUrl });
            console.log(res);
            const { projectSlug, url } = res.data.data;
            setProjectSlug(projectSlug);
            setDeployUrl(url);  // Optional: final URL, if needed
            startPollingLogs(projectSlug);
        } catch (error) {
            console.error('Error sending data:', error);
            setLogs(prev => [...prev, '❌ Failed to initiate deployment']);
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
            }
        };
    }, []);

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

export default App;
