import React, { useState, useEffect } from "react";
import { Trash2, Check, FileCheck, Film, Image as ImageIcon, FileText } from "lucide-react";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { useNotification } from "../../context/NotificationContext";
import { RoleGuard } from "../auth/RoleGuard";
import { Button } from "../common/Button";

export const MediaGrid = ({
  onSelect = null,
  selectedUrl = "",
  selectMode = false
}) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const { showSuccess, showError } = useNotification();

  const loadMedia = async () => {
    try {
      setLoading(true);
      const data = await api.getMedia();
      setMedia(data);
    } catch (err) {
      showError(`Failed to fetch media assets: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  // Filter media based on dropdown selection
  const filteredMedia = media.filter((item) => {
    if (filterType === "all") return true;
    if (filterType === "image") return item.type.startsWith("image/");
    if (filterType === "document") return item.type.includes("pdf") || item.type.includes("document");
    return true;
  });

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // prevent select action when deleting
    
    // Optimistic Delete
    const originalMedia = [...media];
    setMedia(media.filter((item) => item.id !== id));
    showSuccess("Media asset deleted. (Optimistic)");

    try {
      await api.deleteMedia(id);
    } catch (err) {
      setMedia(originalMedia);
      showError(`Failed to delete media asset: ${err.message}`);
    }
  };

  const getMediaIcon = (mimeType) => {
    if (mimeType.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-emerald-400" />;
    if (mimeType.startsWith("video/")) return <Film className="h-5 w-5 text-indigo-400" />;
    return <FileText className="h-5 w-5 text-sky-400" />;
  };

  return (
    <div className="space-y-4">
      {/* Filters header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
          Library Assets ({filteredMedia.length})
        </span>
        <div className="flex gap-1.5">
          {["all", "image", "document"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize cursor-pointer ${
                filterType === type
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 font-bold"
                  : "bg-slate-900/40 text-gray-400 border-slate-800/40 hover:text-white"
              }`}
            >
              {type}s
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="aspect-square bg-slate-800 animate-pulse rounded-xl" />
            ))}
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-xs">
          No media files found.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredMedia.map((item) => {
            const isSelected = selectedUrl === item.url;
            return (
              <div
                key={item.id}
                onClick={() => onSelect && onSelect(item)}
                className={`relative group aspect-square rounded-xl overflow-hidden glass-panel border cursor-pointer select-none transition-all flex flex-col justify-end ${
                  isSelected
                    ? "border-emerald-500 ring-2 ring-emerald-500/20"
                    : "border-slate-800/80 hover:border-slate-700/60"
                }`}
              >
                {/* Media Image or Icon */}
                {item.type.startsWith("image/") ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60">
                    {getMediaIcon(item.type)}
                  </div>
                )}

                {/* Checked Overlay */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 p-1 bg-emerald-500 text-slate-950 rounded-full">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                )}

                {/* Hover actions and filename label */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent p-3 pt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end gap-1">
                  <p className="text-[10px] text-gray-200 truncate font-semibold">
                    {item.name}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-gray-400 font-mono">{item.size}</span>
                    
                    {/* Delete button (Admins only, or if not inside selector popup) */}
                    {!selectMode && (
                      <RoleGuard allowedRoles={["Admin"]}>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-1 rounded bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors cursor-pointer"
                          title="Delete permanently"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </RoleGuard>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
