import React, { useState, useRef } from "react";
import { UploadCloud, File, AlertCircle } from "lucide-react";
import { api } from "../../services/api";
import { useNotification } from "../../context/NotificationContext";

export const MediaUpload = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { showSuccess, showError } = useNotification();
  const fileInputRef = useRef(null);

  // Drag handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Simulate file upload with progression
  const processFile = async (file) => {
    // Only allow common image/doc types for demo
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      showError("File type not supported. Please upload PNG, JPG, GIF, or PDF.");
      return;
    }

    try {
      setUploading(true);
      setProgress(10);
      
      // Simulate progress bar movement
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 15;
        });
      }, 200);

      // Call API with raw File object
      await api.uploadMedia(file);
      
      setProgress(100);
      setTimeout(() => {
        showSuccess(`"${file.name}" uploaded successfully!`);
        setUploading(false);
        setProgress(0);
        if (onUploadSuccess) onUploadSuccess();
      }, 400);

    } catch (err) {
      showError(`Upload failed: ${err.message}`);
      setUploading(false);
      setProgress(0);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        multiple={false}
        onChange={handleFileInput}
        className="hidden"
        accept="image/png, image/jpeg, image/gif, application/pdf"
      />

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`w-full py-8 px-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 select-none text-center ${
          dragActive
            ? "border-emerald-500 bg-emerald-500/5"
            : "border-slate-800 hover:border-slate-700/80 bg-slate-900/10"
        } ${uploading ? "pointer-events-none opacity-80" : ""}`}
      >
        {uploading ? (
          <div className="w-full max-w-xs space-y-3.5 py-4">
            <div className="flex items-center justify-between text-xs text-gray-300 font-semibold px-1">
              <span className="flex items-center gap-1.5 animate-pulse">
                <File className="h-4 w-4 text-emerald-400" />
                Processing file...
              </span>
              <span>{progress}%</span>
            </div>
            {/* Custom premium Progress Bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-gray-400 group-hover:text-white">
              <UploadCloud className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-200">
                Drag and drop files here, or{" "}
                <span className="text-emerald-400 underline hover:text-emerald-300">
                  browse files
                </span>
              </p>
              <p className="text-[10px] text-gray-500 mt-1.5 font-medium">
                Supports JPG, PNG, GIF, or PDF (Max 5MB)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
