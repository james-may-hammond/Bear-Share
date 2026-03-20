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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4 selection:bg-blue-500/30 font-sans">
      <main className="w-full max-w-md relative z-10 flex flex-col gap-6">
        
        {/* Header */}
        <div className="text-center space-y-1 mb-2">
          <div className="inline-flex items-center justify-center p-2 mb-2">
            <Upload className="w-8 h-8 text-[#0073ea]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            BearShare
          </h1>
          <p className="text-slate-500 text-sm">Secure, ephemeral file sharing.</p>
        </div>

        {/* Dynamic Card */}
        <div className="bg-white border border-slate-200 p-6 rounded-md shadow-sm transition-all duration-300">
          
          {/* Success State */}
          {link ? (
            <div className="flex flex-col items-center py-6 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Ready to share!</h3>
                <p className="text-sm text-slate-500">Your secure link has been generated.</p>
              </div>
              
              <div className="w-full relative group">
                <input 
                  readOnly 
                  value={link}
                 className="w-full bg-slate-50 border border-slate-300 rounded-md py-2.5 pl-4 pr-12 text-sm text-slate-900 focus:outline-none placeholder:text-slate-500 truncate"
                />
                <button 
                  onClick={copyToClipboard}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-slate-600 hover:text-slate-900 shadow-sm"
                  title="Copy link"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>
              
              {copied && <p className="text-xs text-[#0073ea] font-medium animate-pulse">Copied to clipboard!</p>}

              <button
                onClick={() => { setLink(""); setFile(null); setPassword(""); setExpiry("24"); setMaxDownloads("1"); }}
                className="mt-2 text-sm text-slate-500 hover:text-[#0073ea] transition-colors font-medium"
              >
                Upload another file
              </button>
            </div>
          ) : (
            /* Upload State */
            <div className="space-y-5">
              
              {/* Dropzone */}
              <div 
                className={`group relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-md transition-all duration-300 cursor-pointer overflow-hidden
                  ${file ? 'border-[#0073ea] bg-blue-50/50' : 'border-slate-300 bg-slate-50 hover:border-[#0073ea] hover:bg-blue-50/30'}`}
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
                    <div className="p-2.5 bg-blue-100 text-[#0073ea] rounded-md">
                      <DownloadCloud className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900 max-w-[200px] truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Upload className="w-7 h-7 text-slate-400 group-hover:text-[#0073ea] transition-colors duration-300" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">Choose a file or drag & drop</p>
                      <p className="text-xs text-slate-500 mt-1">Up to 2GB supported</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Set a password (optional)"
                    className="w-full bg-white border border-slate-300 rounded-md py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:border-[#0073ea] focus:ring-1 focus:ring-[#0073ea] transition-all placeholder:text-slate-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Expiry Dropdown */}
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                    <select
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-300 rounded-md py-2.5 pl-10 pr-10 text-sm text-slate-900 focus:outline-none focus:border-[#0073ea] focus:ring-1 focus:ring-[#0073ea] transition-all cursor-pointer"
                    >
                      <option value="1">1 Hour</option>
                      <option value="24">24 Hours</option>
                      <option value="168">7 Days</option>
                      <option value="720">30 Days</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>

                  {/* Max Downloads Input */}
                  <div className="relative">
                    <DownloadCloud className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      min="1"
                      placeholder="Max Downloads"
                      className="w-full bg-white border border-slate-300 rounded-md py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:border-[#0073ea] focus:ring-1 focus:ring-[#0073ea] transition-all placeholder:text-slate-400"
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
                className={`w-full relative overflow-hidden flex items-center justify-center gap-2 rounded-md py-2.5 font-medium text-sm transition-all duration-300 ${
                  !file || isUploading 
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' 
                    : 'bg-[#0073ea] hover:bg-blue-700 text-white shadow-sm'
                }`}
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  "Upload File"
                )}
              </button>

            </div>
          )}
        </div>
        
        {/* Footer info */}
        <div className="text-center">
          <p className="text-xs text-slate-400 font-medium">End-to-End Encrypted Transfer</p>
        </div>
      </main>
    </div>
  );
}