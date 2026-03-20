"use client";

import { useState, useRef } from "react";

const Upload = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>;
const Lock = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const Clock = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const DownloadCloud = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>;
const LinkIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
const CheckCircle2 = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>;
const ChevronDown = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [expiry, setExpiry] = useState("24"); // Default 24 hours
  const [maxDownloads, setMaxDownloads] = useState("1"); // Default 1 download
  const [link, setLink] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    if (password) formData.append("password", password);
    if (expiry) formData.append("expiry", expiry);
    if (maxDownloads) formData.append("max_downloads", maxDownloads);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const text = await res.text();
      setLink(text);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Something went wrong during the upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-neutral-200 flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30 font-sans">
      {/* Background Orbs for Premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />

      <main className="w-full max-w-md relative z-10 flex flex-col gap-6">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-4">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-md mb-2">
            <Upload className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-emerald-400">
            BearShare
          </h1>
          <p className="text-neutral-400 text-sm">Secure, ephemeral file sharing.</p>
        </div>

        {/* Dynamic Card */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl shadow-2xl transition-all duration-500 ease-out hover:border-white/20">
          
          {/* Success State */}
          {link ? (
            <div className="flex flex-col items-center py-6 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Ready to share!</h3>
                <p className="text-sm text-neutral-400">Your link has been securely generated.</p>
              </div>
              
              <div className="w-full relative group">
                <input 
                  readOnly 
                  value={link}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-emerald-200 focus:outline-none placeholder:text-neutral-600 truncate"
                />
                <button 
                  onClick={copyToClipboard}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-neutral-300 hover:text-white"
                  title="Copy link"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>
              
              {copied && <p className="text-xs text-emerald-400 font-medium animate-pulse">Copied to clipboard!</p>}

              <button
                onClick={() => { setLink(""); setFile(null); setPassword(""); setExpiry("24"); setMaxDownloads("1"); }}
                className="mt-4 text-sm text-neutral-400 hover:text-white transition-colors underline decoration-white/20 underline-offset-4"
              >
                Upload another file
              </button>
            </div>
          ) : (
            /* Upload State */
            <div className="space-y-6">
              
              {/* Dropzone */}
              <div 
                className={`group relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden
                  ${file ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/10 hover:border-indigo-400/50 hover:bg-white/5'}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                
                {file ? (
                  <div className="flex flex-col items-center gap-2 text-center animate-in zoom-in-95 duration-300">
                    <div className="p-3 bg-indigo-500/20 text-indigo-300 rounded-xl">
                      <DownloadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-white max-w-[200px] truncate">{file.name}</p>
                    <p className="text-xs text-neutral-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-center">
                    <Upload className="w-8 h-8 text-neutral-500 group-hover:text-indigo-400 transition-colors duration-300" />
                    <div>
                      <p className="text-sm font-medium text-neutral-300">Choose a file or drag & drop</p>
                      <p className="text-xs text-neutral-500 mt-1">Up to 2GB supported</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="password"
                    placeholder="Set a password (optional)"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-neutral-600"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Expiry Dropdown */}
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 z-10" />
                    <select
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full appearance-none bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-sm text-neutral-300 focus:outline-none focus:border-indigo-500/50 transition-all cursor-pointer"
                    >
                      <option value="1">1 Hour</option>
                      <option value="24">24 Hours</option>
                      <option value="168">7 Days</option>
                      <option value="720">30 Days</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                  </div>

                  {/* Max Downloads Input */}
                  <div className="relative">
                    <DownloadCloud className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="number"
                      min="1"
                      placeholder="Max Dls"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-neutral-300 focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-neutral-600"
                      value={maxDownloads}
                      onChange={(e) => setMaxDownloads(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className={`w-full relative overflow-hidden group rounded-xl py-3 font-semibold text-sm transition-all duration-300 ${
                  !file || isUploading 
                    ? 'bg-white/5 text-neutral-500 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]'
                }`}
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading securely...
                    </>
                  ) : (
                    "Upload File"
                  )}
                </div>
              </button>

            </div>
          )}
        </div>
        
        {/* Footer info */}
        <div className="text-center">
          <p className="text-xs text-neutral-600">End-to-End Encrypted Transfer</p>
        </div>
      </main>
    </div>
  );
}