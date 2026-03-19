"use client";

import { use, useState } from "react";

// Inline SVGs (since lucide-react npm install failed)
const DownloadCloud = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>;
const Lock = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;

export default function DownloadPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const [password, setPassword] = useState("");

  const backendUrl = `http://localhost:8080/f/${id}`;
  
  // Construct the final download URL including the password query if provided
  const finalDownloadUrl = password 
    ? `${backendUrl}?password=${encodeURIComponent(password)}`
    : backendUrl;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-neutral-200 flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30 font-sans">
      {/* Background Orbs for Premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />

      <main className="w-full max-w-sm relative z-10 flex flex-col gap-6">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-4">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-md mb-2">
            <DownloadCloud className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-indigo-400">
            BearShare
          </h1>
          <p className="text-neutral-400 text-sm">Download your secure file.</p>
        </div>

        {/* Dynamic Card */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl shadow-2xl transition-all duration-500 ease-out hover:border-white/20 space-y-6">
          
          <div className="text-center">
            <h2 className="text-lg font-semibold text-white">Unlock File</h2>
            <p className="text-xs text-neutral-400 mt-1">If this file is protected, enter the password below.</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="password"
                placeholder="Password (if set)"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-neutral-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <a
            href={finalDownloadUrl}
            className="w-full flex items-center justify-center gap-2 relative overflow-hidden group rounded-xl py-3 font-semibold text-sm transition-all duration-300 bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] cursor-pointer"
          >
            <DownloadCloud className="w-4 h-4" />
            Download File
          </a>
          
          <div className="text-center mt-4">
            <p className="text-xs text-neutral-500">
              Downloads go straight to your browser. You might see an error page if it is expired or max downloaded.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
