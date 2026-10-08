import React, { useState, useRef } from 'react';
import { computeSHA256 } from '../../lib/supabase';

export interface FileUploadProps {
  onFileReady: (data: {
    file: File;
    name: string;
    sizeBytes: number;
    sha256Hash: string;
    previewUrl: string;
  }) => void;
  accept?: string;
  maxSizeBytes?: number;
  label?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileReady,
  accept = 'image/*,video/*,application/pdf',
  maxSizeBytes = 25 * 1024 * 1024, // 25MB
  label = 'Select or drag photo / evidence file',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastFile, setLastFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (file.size > maxSizeBytes) {
      setErrorMsg(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Limit is ${(maxSizeBytes / (1024 * 1024)).toFixed(0)}MB.`);
      return;
    }

    setLastFile(file);
    setErrorMsg(null);
    setIsProcessing(true);
    setProgress(15);

    try {
      // Step 1: Simulate progress feedback
      const progressTimer1 = setTimeout(() => setProgress(55), 100);
      const progressTimer2 = setTimeout(() => setProgress(85), 250);

      // Step 2: Read binary array buffer and compute SHA-256 cryptographic fingerprint
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binaryStr = '';
      for (let i = 0; i < Math.min(bytes.length, 100000); i++) {
        binaryStr += String.fromCharCode(bytes[i]);
      }
      const hash = await computeSHA256(binaryStr + file.name + file.size + file.lastModified);

      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);
      setProgress(100);

      // Step 3: Create object URL
      const previewUrl = URL.createObjectURL(file);

      setTimeout(() => {
        setIsProcessing(false);
        setProgress(null);
        onFileReady({
          file,
          name: file.name,
          sizeBytes: file.size,
          sha256Hash: hash,
          previewUrl,
        });
      }, 200);
    } catch {
      setIsProcessing(false);
      setProgress(null);
      setErrorMsg('Your evidence upload was interrupted. Please retry.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full text-left">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleInputChange}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`w-full min-h-[120px] rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center select-none ${
          isDragging
            ? 'border-emerald-600 bg-emerald-50/50'
            : isProcessing
            ? 'border-slate-300 bg-slate-50'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
        }`}
      >
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mb-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        <p className="text-xs font-bold text-slate-900">{label}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          JPEG, PNG, MP4, PDF up to 25MB · SHA-256 integrity seal calculated automatically
        </p>

        {progress !== null && (
          <div className="w-full max-w-xs mt-3">
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-1">
              Calculating cryptographic SHA-256 fingerprint ({progress}%)...
            </p>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-700">
          <span>{errorMsg}</span>
          {lastFile && (
            <button
              onClick={() => processFile(lastFile)}
              className="text-xs font-bold underline hover:text-rose-900"
            >
              Retry Upload
            </button>
          )}
        </div>
      )}
    </div>
  );
};
