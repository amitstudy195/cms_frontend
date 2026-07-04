import React, { useState, useEffect, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Globe,
  Lock,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useDebounce } from "../hooks/useDebounce";
import { useNotification } from "../context/NotificationContext";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { RoleGuard } from "../components/auth/RoleGuard";

export const ContentList = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const { showSuccess, showError, showWarning } = useNotification();

  // Detect type (page or banner) based on active path
  const contentType = location.pathname.includes("banner") ? "banner" : "page";

  // State Management
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    page: 1,
    limit: 5,
    totalCount: 0,
    totalPages: 1
  });

  // Zod Debounced Search Value
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  // Modals state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Fetch Items matching Search, Filter, and Page parameters
  const loadItems = async () => {
    try {
      setLoading(true);
      const res = await api.getContent(
        contentType,
        currentPage,
        5, // limit per page
        debouncedSearchTerm,
        statusFilter
      );
      
      setItems(res.data);
      setPaginationMeta(res.pagination);
    } catch (err) {
      showError(`Failed to load ${contentType}s: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Reload data when active query bounds change
  useEffect(() => {
    loadItems();
  }, [contentType, currentPage, debouncedSearchTerm, statusFilter]);

  // Reset page pagination pointer when toggling searches or status tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [contentType, debouncedSearchTerm, statusFilter]);

  // Handle Publish / Request Approval Action (Optimistic UI Update)
  const handlePublish = async (item) => {
    const originalStatus = item.status;
    const isNewAdminPublish = isAdmin;
    const targetStatus = isNewAdminPublish ? "Published" : "Pending Approval";

    // 1. Optimistic Update on UI
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: targetStatus } : i))
    );

    if (isNewAdminPublish) {
      showSuccess(`"${item.title}" published successfully! (Optimistic)`);
    } else {
      showWarning(`Publish request submitted for admin approval.`);
    }

    try {
      // 2. Perform API Update
      await api.updateContent(item.id, { status: targetStatus });
    } catch (err) {
      // 3. Rollback on failure
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: originalStatus } : i))
      );
      showError(`Failed to update status: ${err.message}`);
    }
  };

  // Open Delete Modal
  const confirmDelete = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  // Execute Delete (Optimistic UI Update)
  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    const itemId = itemToDelete.id;
    const deletedItem = itemToDelete;

    // Close Modal and show loading indicator/toast
    setDeleteModalOpen(false);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    showSuccess(`"${deletedItem.title}" deleted. (Optimistic)`);

    try {
      await api.deleteContent(itemId);
      loadItems(); // Refresh pagination count indices
    } catch (err) {
      // Rollback on failure
      setItems((prev) => [...prev, deletedItem]);
      showError(`Failed to delete content: ${err.message}`);
    }
  };

  const formattedDate = (isoStr) => {
    const date = new Date(isoStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-wide capitalize">
            {contentType}s List
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Displaying all {contentType} templates. Search, status filters, and pagination controls are active.
          </p>
        </div>
        
        <Link to={`/content/new/${contentType}`}>
          <Button variant="primary" size="sm" className="cursor-pointer">
            <Plus className="h-4.5 w-4.5" />
            Add {contentType}
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 p-4 glass-panel rounded-2xl">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search by title or slug... (Debounced)`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10.5 pr-4 py-2.5 rounded-xl text-sm glass-input font-medium"
          />
        </div>
        
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {["All", "Published", "Draft", "Scheduled", "Pending Approval"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                statusFilter === status
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold"
                  : "bg-slate-900/30 text-gray-400 border-slate-800/60 hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Content Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/60 bg-slate-900/40 text-[10px] uppercase font-bold tracking-wider text-gray-400">
                <th className="py-4 px-6">Title</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Last Modified</th>
                <th className="py-4 px-4">Author</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs font-medium text-gray-300">
              {loading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-4 px-6">
                        <div className="h-3.5 bg-slate-800 rounded w-1/2 mb-1" />
                        <div className="h-2.5 bg-slate-800 rounded w-1/3" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-5 bg-slate-800 rounded-full w-16" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-3 bg-slate-800 rounded w-20" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-3 bg-slate-800 rounded w-24" />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="h-8 bg-slate-800 rounded-lg w-20 ml-auto" />
                      </td>
                    </tr>
                  ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400">
                    No {contentType}s found matching filters.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-900/35 transition-colors group"
                  >
                    {/* Title & Slug */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            item.featuredImage ||
                            "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=100"
                          }
                          alt=""
                          className="h-10 w-10 object-cover rounded-lg bg-slate-800 border border-slate-800/80 group-hover:border-slate-700/60 transition-all flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-sm font-semibold text-white truncate block">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-gray-400 block mt-0.5 font-mono">
                            /{item.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      <Badge variant={item.status} />
                    </td>

                    {/* Last Modified */}
                    <td className="py-4 px-4 text-gray-400 font-mono">
                      {formattedDate(item.lastModified)}
                    </td>

                    {/* Author */}
                    <td className="py-4 px-4 text-gray-300">
                      {item.author}
                    </td>

                    {/* Actions Menu */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Publish Button */}
                        {item.status !== "Published" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePublish(item)}
                            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 px-2 py-1 rounded-lg"
                          >
                            <Globe className="h-4 w-4" />
                            <span className="hidden sm:inline">Publish</span>
                          </Button>
                        )}

                        {/* Edit Action */}
                        <Link to={`/content/edit/${item.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 text-sky-400 hover:text-sky-300 hover:bg-sky-500/10"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </Link>

                        {/* Delete Action */}
                        <RoleGuard
                          allowedRoles={["Admin"]}
                          fallback={
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled
                              className="p-2 text-gray-600 cursor-not-allowed"
                            >
                              <Lock className="h-4 w-4" />
                            </Button>
                          }
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmDelete(item)}
                            className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </RoleGuard>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Reusable Pagination Controls Footer */}
        {paginationMeta.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4.5 border-t border-slate-800/80 bg-slate-900/20">
            <span className="text-xs text-gray-400">
              Showing page <span className="font-semibold text-white">{currentPage}</span> of{" "}
              <span className="font-semibold text-white">{paginationMeta.totalPages}</span> (
              <span className="font-semibold text-white">{paginationMeta.totalCount}</span> total items)
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="py-1 px-2.5 rounded-lg"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, paginationMeta.totalPages))}
                disabled={currentPage === paginationMeta.totalPages}
                className="py-1 px-2.5 rounded-lg"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Confirm Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-300">
          Are you sure you want to delete <span className="font-semibold text-white">"{itemToDelete?.title}"</span>? This action is permanent and cannot be undone in the database.
        </p>
      </Modal>
    </div>
  );
};
