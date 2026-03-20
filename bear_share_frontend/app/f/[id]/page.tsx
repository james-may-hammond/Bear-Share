"use client";

import { use, useState } from "react";

// Inline SVGs (since lucide-react npm install failed)
const DownloadCloud = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>;
const Lock = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;

export default function DownloadPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const [password, setPassword] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const backendUrl = `${apiUrl}/f/${id}`;
  
  // Construct the final download URL including the password query if provided
  const finalDownloadUrl = password 
    ? `${backendUrl}?password=${encodeURIComponent(password)}`
    : backendUrl;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4 selection:bg-blue-500/30 font-sans">
      <main className="w-full max-w-sm relative z-10 flex flex-col gap-6">
        
        {/* Header */}
        <div className="text-center space-y-1 mb-2">
          <div className="inline-flex items-center justify-center p-2 mb-2">
            <DownloadCloud className="w-8 h-8 text-[#0073ea]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            BearShare
          </h1>
          <p className="text-slate-500 text-sm">Download your secure file.</p>
        </div>

        {/* Dynamic Card */}
        <div className="bg-white border border-slate-200 p-6 rounded-md shadow-sm transition-all duration-300 space-y-5">
          
          <div className="text-center">
            <h2 className="text-lg font-semibold text-slate-900">Unlock File</h2>
            <p className="text-xs text-slate-500 mt-1">If this file is protected, enter the password below.</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="Password (if set)"
                className="w-full bg-white border border-slate-300 rounded-md py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:border-[#0073ea] focus:ring-1 focus:ring-[#0073ea] transition-all placeholder:text-slate-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <a
            href={finalDownloadUrl}
            className="w-full flex items-center justify-center gap-2 relative overflow-hidden rounded-md py-2.5 font-medium text-sm transition-all duration-300 bg-[#0073ea] hover:bg-blue-700 text-white shadow-sm cursor-pointer"
          >
            <DownloadCloud className="w-4 h-4" />
            Download File
          </a>
          
          <div className="text-center mt-2">
            <p className="text-xs text-slate-500">
              Downloads go straight to your browser. You might see an error page if it is expired or max downloaded.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
