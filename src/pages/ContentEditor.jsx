import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Globe,
  Image as ImageIcon,
  AlertCircle,
  CloudLightning,
  RefreshCw
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useAutosave } from "../hooks/useAutosave";
import { useNotification } from "../context/NotificationContext";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { MediaGrid } from "../components/media/MediaGrid";
import { MediaUpload } from "../components/media/MediaUpload";

export const ContentEditor = () => {
  const { id, type } = useParams(); // id is present in Edit mode. type is present in Create mode
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const { showSuccess, showError, showWarning } = useNotification();

  const isEditMode = !!id;
  const [contentType, setContentType] = useState(type || "page");
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    status: "Draft",
    featuredImage: "",
    seoTitle: "",
    seoDescription: ""
  });

  // UI state
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [draftAvailable, setDraftAvailable] = useState(false);

  // Autosave configuration key
  const autosaveKey = `cms_autosave_draft_${id || "new"}`;
  
  // Custom hook: triggers draft autosave every 30 seconds to localStorage if form is modified/dirty
  const { lastSaved, isDirty, forceSave } = useAutosave(formData, autosaveKey, 30000);

  // Load Content Details for Edit Mode
  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true);
        let loadedData = null;
        
        if (isEditMode) {
          const item = await api.getContentById(id);
          loadedData = {
            title: item.title,
            slug: item.slug,
            content: item.content,
            status: item.status,
            featuredImage: item.featuredImage || "",
            seoTitle: item.seoTitle || "",
            seoDescription: item.seoDescription || ""
          };
          setContentType(item.type);
          setFormData(loadedData);
        }

        // Check if an unsaved local draft exists
        const savedDraft = localStorage.getItem(autosaveKey);
        if (savedDraft) {
          const parsedDraft = JSON.parse(savedDraft);
          // Only show restore prompt if local draft differs from baseline/DB data
          if (loadedData) {
            const hasDiff = JSON.stringify(loadedData) !== JSON.stringify(parsedDraft);
            if (hasDiff) setDraftAvailable(true);
          } else {
            // New page draft exists
            const hasContent = Object.values(parsedDraft).some(val => val !== "");
            if (hasContent) setDraftAvailable(true);
          }
        }
      } catch (err) {
        showError(`Failed to load content details: ${err.message}`);
        navigate(contentType === "banner" ? "/banners" : "/pages");
      } finally {
        setLoading(false);
      }
    };
    loadItem();
  }, [id, isEditMode]);

  // Restore draft state
  const restoreLocalDraft = () => {
    try {
      const savedDraft = localStorage.getItem(autosaveKey);
      if (savedDraft) {
        setFormData(JSON.parse(savedDraft));
        setDraftAvailable(false);
        showSuccess("Unsaved local draft restored successfully.");
      }
    } catch (err) {
      showError("Failed to restore draft.");
    }
  };

  // Handle Input Changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug from title in Create Mode
      if (field === "title" && !isEditMode) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
      }
      
      return updated;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.content.trim()) newErrors.content = "Content body is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      showError("Please fill out all required fields.");
      return;
    }

    setSaving(true);
    const authorName = isEditMode
      ? formData.author
      : `${currentUser?.name} (${currentUser?.role})`;

    const submissionPayload = {
      ...formData,
      type: contentType,
      author: authorName || "System"
    };

    try {
      if (isEditMode) {
        await api.updateContent(id, submissionPayload);
        showSuccess(`"${formData.title}" updated successfully.`);
      } else {
        await api.createContent(submissionPayload);
        showSuccess(`"${formData.title}" created successfully.`);
      }
      
      // Clear autosave cache on successful db publish/save
      localStorage.removeItem(autosaveKey);
      
      navigate(contentType === "banner" ? "/banners" : "/pages");
    } catch (err) {
      showError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Handle Media Selection from Modal
  const handleSelectMedia = (mediaItem) => {
    handleInputChange("featuredImage", mediaItem.url);
    setMediaModalOpen(false);
    showSuccess(`Selected image: ${mediaItem.name}`);
  };

  const isPublishedToggleOn = formData.status === "Published" || formData.status === "Pending Approval";

  const handlePublishToggle = (checked) => {
    if (checked) {
      const nextStatus = isAdmin ? "Published" : "Pending Approval";
      handleInputChange("status", nextStatus);
      if (!isAdmin) {
        showWarning("As an Editor, your changes will require Admin approval.");
      }
    } else {
      handleInputChange("status", "Draft");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <svg className="animate-spin h-8 w-8 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm text-gray-400">Loading workspace files...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-6">
      {/* Draft Restore Notification Prompt */}
      {draftAvailable && (
        <div className="flex items-center justify-between p-3.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs rounded-xl font-medium animate-fade-in">
          <span className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-indigo-400 animate-spin-reverse" />
            <span>We found a newer unsaved local draft for this {contentType}. Would you like to restore it?</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setDraftAvailable(false)}
              className="px-2.5 py-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Dismiss
            </button>
            <button
              onClick={restoreLocalDraft}
              className="px-3 py-1 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-400 transition-colors cursor-pointer"
            >
              Restore Draft
            </button>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to={contentType === "banner" ? "/banners" : "/pages"}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              {isEditMode ? "Modify Content" : `Create ${contentType}`}
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5 font-bold">
              Type: {contentType}
            </p>
          </div>
        </div>

        {/* Save button and status feedback */}
        <div className="flex items-center gap-4">
          {lastSaved && (
            <span className="text-xs text-emerald-400/80 flex items-center gap-1.5 font-medium">
              <CloudLightning className="h-3.5 w-3.5" />
              Draft saved at {lastSaved}
            </span>
          )}
          {!lastSaved && isDirty && (
            <span className="text-[10px] text-gray-500 font-mono animate-pulse">Unsaved modifications...</span>
          )}
          
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={saving}
            className="cursor-pointer"
          >
            <Save className="h-4.5 w-4.5" />
            {isEditMode ? "Save Changes" : "Create Item"}
          </Button>
        </div>
      </div>

      {/* Editor Form Columns */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Workspace Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-xs font-semibold text-gray-300">
                Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder={`Enter ${contentType} title...`}
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm glass-input font-medium ${
                  errors.title ? "border-rose-500" : ""
                }`}
              />
              {errors.title && (
                <span className="text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.title}
                </span>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label htmlFor="slug" className="text-xs font-semibold text-gray-300">
                URL Slug <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-mono">
                  /{contentType === "banner" ? "banner" : "page"}/
                </span>
                <input
                  id="slug"
                  type="text"
                  placeholder="permalink-path"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  className={`w-full pl-24 pr-4 py-2.5 rounded-xl text-sm font-mono glass-input ${
                    errors.slug ? "border-rose-500" : ""
                  }`}
                />
              </div>
              {errors.slug && (
                <span className="text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.slug}
                </span>
              )}
            </div>

            {/* Body Text Editor */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="content" className="text-xs font-semibold text-gray-300">
                  Content Body <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-gray-500 font-mono">Supports Plain Text / Markdown</span>
              </div>
              <textarea
                id="content"
                rows="10"
                placeholder="Type your structured content here..."
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl text-sm glass-input font-medium resize-y ${
                  errors.content ? "border-rose-500" : ""
                }`}
              />
              {errors.content && (
                <span className="text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.content}
                </span>
              )}
            </div>
          </div>

          {/* SEO Metadata Form Card */}
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            <div className="border-b border-slate-800/60 pb-3 flex items-center gap-2 text-white">
              <h3 className="text-sm font-semibold tracking-wide">SEO & Meta Options</h3>
            </div>
            
            <div className="space-y-4">
              {/* SEO Title */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="seoTitle" className="text-xs font-semibold text-gray-300">
                    SEO Meta Title
                  </label>
                  <span className="text-[9px] text-gray-500">
                    {formData.seoTitle.length}/60 chars
                  </span>
                </div>
                <input
                  id="seoTitle"
                  type="text"
                  placeholder="Appears in search engine results"
                  value={formData.seoTitle}
                  onChange={(e) => handleInputChange("seoTitle", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm glass-input font-medium"
                />
              </div>

              {/* SEO Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="seoDescription" className="text-xs font-semibold text-gray-300">
                    SEO Meta Description
                  </label>
                  <span className="text-[9px] text-gray-500">
                    {formData.seoDescription.length}/160 chars
                  </span>
                </div>
                <textarea
                  id="seoDescription"
                  rows="3"
                  placeholder="Short summarizing description for search engines"
                  value={formData.seoDescription}
                  onChange={(e) => handleInputChange("seoDescription", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm glass-input font-medium resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings Column */}
        <div className="space-y-6">
          {/* Publish Settings Card */}
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            <div className="border-b border-slate-800/60 pb-3">
              <h3 className="text-sm font-semibold text-white tracking-wide">Publish Settings</h3>
            </div>
            
            {/* Status Info */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <span className="text-xs text-gray-400 font-semibold">Active Status:</span>
              <span className="inline-block">
                {formData.status === "Published" && (
                  <span className="px-2.5 py-0.5 text-xs rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                    Published
                  </span>
                )}
                {formData.status === "Pending Approval" && (
                  <span className="px-2.5 py-0.5 text-xs rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400">
                    Pending Approval
                  </span>
                )}
                {formData.status === "Draft" && (
                  <span className="px-2.5 py-0.5 text-xs rounded-full border border-slate-500/20 bg-slate-500/10 text-slate-400">
                    Draft
                  </span>
                )}
                {formData.status === "Scheduled" && (
                  <span className="px-2.5 py-0.5 text-xs rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                    Scheduled
                  </span>
                )}
              </span>
            </div>

            {/* Publishing Approval Toggle */}
            <div className="flex items-start justify-between gap-4 py-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-200 block">
                  {isAdmin ? "Publish Content" : "Request Publish"}
                </label>
                <p className="text-[10px] text-gray-400 leading-tight">
                  {isAdmin
                    ? "Go live directly on the site"
                    : "Submit draft for Admin authorization"}
                </p>
              </div>
              
              {/* Premium Toggle Switch */}
              <button
                type="button"
                onClick={() => handlePublishToggle(!isPublishedToggleOn)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isPublishedToggleOn ? "bg-emerald-500" : "bg-slate-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                    isPublishedToggleOn ? "translate-x-5 bg-white" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Status Selector dropdown */}
            <div className="space-y-1.5 pt-2">
              <label htmlFor="statusSelect" className="text-xs font-semibold text-gray-300">
                Change Status Manually
              </label>
              <select
                id="statusSelect"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-xs glass-input font-semibold cursor-pointer"
              >
                <option value="Draft">Draft</option>
                {isAdmin ? (
                  <>
                    <option value="Published">Published</option>
                    <option value="Scheduled">Scheduled</option>
                  </>
                ) : (
                  <>
                    <option value="Pending Approval">Pending Approval</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Featured Image Selection Card */}
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            <div className="border-b border-slate-800/60 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white tracking-wide">Featured Image</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMediaModalOpen(true)}
                className="text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded-lg"
              >
                Select
              </Button>
            </div>

            {formData.featuredImage ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800/80 group">
                <img
                  src={formData.featuredImage}
                  alt="Featured Media Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleInputChange("featuredImage", "")}
                  className="absolute top-2 right-2 p-1.5 bg-slate-950/80 hover:bg-rose-600 text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                  title="Remove image selection"
                >
                  <AlertCircle className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setMediaModalOpen(true)}
                className="w-full py-10 border-2 border-dashed border-slate-855 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-slate-700/80 bg-slate-900/10 cursor-pointer select-none text-gray-500 hover:text-gray-300 transition-all"
              >
                <ImageIcon className="h-8 w-8 text-gray-500" />
                <span className="text-xs font-semibold">Select Featured Media</span>
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Media Library Selection Modal */}
      <Modal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        title="Select Featured Asset"
        size="lg"
      >
        <div className="space-y-6">
          <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl">
            <p className="text-xs text-gray-300 font-semibold mb-2">Upload New Media Asset</p>
            <MediaUpload onUploadSuccess={() => {}} />
          </div>
          
          <MediaGrid
            selectMode={true}
            onSelect={handleSelectMedia}
            selectedUrl={formData.featuredImage}
          />
        </div>
      </Modal>
    </div>
  );
};
