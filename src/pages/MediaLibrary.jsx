import React, { useState, useRef } from "react";
import { FolderOpen } from "lucide-react";
import { MediaGrid } from "../components/media/MediaGrid";
import { MediaUpload } from "../components/media/MediaUpload";

export const MediaLibrary = () => {
  const [reloadKey, setReloadKey] = useState(0);

  const handleUploadSuccess = () => {
    // Increment the key to force re-render/re-fetch of the MediaGrid
    setReloadKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Info */}
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-wide">
          Media Assets Library
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Upload and manage images, promotional banners, and document assets. Admin role is required to delete assets.
        </p>
      </div>

      {/* Upload Zone Card */}
      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-sm font-semibold text-white tracking-wide mb-4">
          Upload New Assets
        </h3>
        <MediaUpload onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* Media Grid View */}
      <div className="glass-panel p-6 rounded-2xl">
        <MediaGrid key={reloadKey} selectMode={false} />
      </div>
    </div>
  );
};
