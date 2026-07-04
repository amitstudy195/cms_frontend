import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Image,
  FolderOpen,
  Plus,
  Clock,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { api } from "../services/api";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { AnalyticsGrid } from "../components/dashboard/AnalyticsGrid";

export const Dashboard = () => {
  const [stats, setStats] = useState({
    pagesCount: 0,
    bannersCount: 0,
    mediaCount: 0,
    pendingApproval: 0
  });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [contentRes, media] = await Promise.all([
          api.getContent(null, 1, 100),
          api.getMedia()
        ]);
        
        const allContent = contentRes.data || [];
        const pages = allContent.filter(item => item.type === "page");
        const banners = allContent.filter(item => item.type === "banner");
        const pending = allContent.filter(item => item.status === "Pending Approval");

        setStats({
          pagesCount: pages.length,
          bannersCount: banners.length,
          mediaCount: media.length,
          pendingApproval: pending.length
        });

        // Get 4 most recently modified items
        const sorted = [...allContent].sort(
          (a, b) => new Date(b.lastModified) - new Date(a.lastModified)
        );
        setRecentItems(sorted.slice(0, 4));
      } catch (err) {
        console.error("Dashboard data failed to fetch", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const statCards = [
    {
      title: "Content Pages",
      value: stats.pagesCount,
      icon: FileText,
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-400 border-emerald-500/25",
      link: "/pages"
    },
    {
      title: "Active Banners",
      value: stats.bannersCount,
      icon: Image,
      color: "from-sky-500/10 to-blue-500/10 text-sky-400 border-sky-500/25",
      link: "/banners"
    },
    {
      title: "Media Assets",
      value: stats.mediaCount,
      icon: FolderOpen,
      color: "from-indigo-500/10 to-purple-500/10 text-indigo-400 border-indigo-500/25",
      link: "/media"
    },
    {
      title: "Pending Approval",
      value: stats.pendingApproval,
      icon: Clock,
      color: "from-amber-500/10 to-orange-500/10 text-amber-400 border-amber-500/25",
      link: "/pages"
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="z-10">
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-wide">
            Welcome to CMS Workspace
          </h1>
          <p className="text-sm text-gray-400 mt-1 max-w-xl">
            Create, manage, and schedule landing pages and media assets. Real-time updates and role-based permissions are enabled.
          </p>
        </div>
        <div className="flex gap-3 z-10">
          <Link to="/content/new/page">
            <Button variant="primary" size="sm" className="cursor-pointer">
              <Plus className="h-4 w-4" />
              New Page
            </Button>
          </Link>
          <Link to="/content/new/banner">
            <Button variant="secondary" size="sm" className="cursor-pointer">
              <Plus className="h-4 w-4" />
              New Banner
            </Button>
          </Link>
        </div>
        
        {/* Background blobs */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-20 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className={`glass-panel glass-panel-hover p-5.5 rounded-2xl border flex items-center justify-between group ${card.color}`}
            >
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 group-hover:text-gray-300">
                  {card.title}
                </p>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  {loading ? (
                    <span className="inline-block w-8 h-6 bg-slate-800 animate-pulse rounded" />
                  ) : (
                    card.value
                  )}
                </h3>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/40">
                <Icon className="h-5.5 w-5.5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Advanced Graphic Analytics Charts */}
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
          Performance Analytics
        </h3>
        <AnalyticsGrid />
      </div>

      {/* Bottom Activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Items Panel */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide pb-4 border-b border-slate-800/60 flex items-center justify-between">
              <span>Recent Content Modifications</span>
              <span className="text-[10px] text-gray-400 font-mono">Live updates</span>
            </h3>
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {loading ? (
                Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex gap-3 animate-pulse p-3 bg-slate-900/10 rounded-xl">
                      <div className="w-10 h-10 bg-slate-800 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-800 rounded w-3/4" />
                        <div className="h-2 bg-slate-800 rounded w-1/2" />
                      </div>
                    </div>
                  ))
              ) : recentItems.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8 col-span-2">
                  No recent activities recorded.
                </p>
              ) : (
                recentItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between p-3.5 rounded-xl bg-slate-900/35 border border-slate-800/40 hover:border-slate-700/50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          item.featuredImage ||
                          "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=100"
                        }
                        alt=""
                        className="h-10 w-10 object-cover rounded-lg bg-slate-800 border border-slate-800/60"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-gray-200 truncate max-w-[150px]">
                          {item.title}
                        </h4>
                        <p className="text-[9px] text-gray-500 mt-1 font-mono uppercase">
                          {item.type} • {item.author.split(" ")[0]}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={item.status}>{item.status}</Badge>
                      <Link
                        to={`/content/edit/${item.id}`}
                        className="text-[9px] text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-0.5"
                      >
                        Edit <ArrowRight className="h-2.5 w-2.5" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/60">
            <Link
              to="/pages"
              className="w-full flex items-center justify-between text-xs text-gray-400 hover:text-white transition-colors"
            >
              <span>Browse and filter all CMS documents</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* System Security/Audit Summary Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wide pb-4 border-b border-slate-800/60 flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
              <span>Security Audit Logs</span>
            </h3>
            
            <div className="space-y-3.5">
              <div className="flex items-start gap-2.5 text-xs text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">PAGE_UPDATE logged</p>
                  <p className="text-[9px] text-gray-500 font-mono mt-0.5">Today at 18:05 • Jane D.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">MEDIA_UPLOAD logged</p>
                  <p className="text-[9px] text-gray-500 font-mono mt-0.5">Today at 17:42 • Alex R.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">PAGE_DELETE logged</p>
                  <p className="text-[9px] text-gray-500 font-mono mt-0.5">Yesterday at 14:15 • Jane D.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/60 text-[10px] text-gray-500 leading-tight">
            Security audits automatically preserve logs. TTL expiration indexes are set to clean up after 90 days.
          </div>
        </div>
      </div>
    </div>
  );
};
