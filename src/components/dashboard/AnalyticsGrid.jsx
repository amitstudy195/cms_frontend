import React from "react";
import { TrendingUp, Cloud, Activity, CheckCircle, BarChart2 } from "lucide-react";

export const AnalyticsGrid = () => {
  // Mock Data for rendering premium SVG visuals
  const publishTrends = [25, 40, 35, 60, 55, 80, 95];
  const monthlyBandwidth = [
    { month: "Jan", size: 120 },
    { month: "Feb", size: 240 },
    { month: "Mar", size: 190 },
    { month: "Apr", size: 340 },
    { month: "May", size: 280 },
    { month: "Jun", size: 450 },
    { month: "Jul", size: 520 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* Visual Line Chart Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
          <div>
            <h4 className="text-xs font-semibold text-gray-400">Pages Publishing Frequency</h4>
            <p className="text-sm font-bold text-white mt-0.5">Cumulative Publications</p>
          </div>
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>

        {/* SVG Sparkline Graph */}
        <div className="h-48 mt-4 flex items-end justify-between relative">
          <svg className="absolute inset-0 w-full h-full p-1" viewBox="0 0 100 40" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Smooth Spline Area */}
            <path
              d="M 0 40 Q 15 25 30 20 T 60 10 T 90 2 T 100 0 L 100 40 Z"
              fill="url(#areaGrad)"
            />
            {/* Graph Line */}
            <path
              d="M 0 40 Q 15 25 30 20 T 60 10 T 90 2 T 100 0"
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {/* Months label offsets */}
          <div className="absolute inset-x-0 bottom-0 flex justify-between px-1 text-[9px] text-gray-500 font-mono">
            <span>Jan</span>
            <span>Mar</span>
            <span>May</span>
            <span>Jul</span>
          </div>
        </div>
      </div>

      {/* Visual Bar Chart Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
          <div>
            <h4 className="text-xs font-semibold text-gray-400">Media CDN Bandwidth</h4>
            <p className="text-sm font-bold text-white mt-0.5">5.2 GB Total Transferred</p>
          </div>
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <Cloud className="h-4 w-4" />
          </div>
        </div>

        {/* Custom styled SVG Bar chart */}
        <div className="h-48 mt-4 flex items-end justify-between px-2 relative pt-4">
          {monthlyBandwidth.map((item, idx) => {
            // Calculate percentage height
            const pct = (item.size / 600) * 100;
            return (
              <div key={idx} className="flex flex-col items-center gap-2 w-full group">
                {/* Custom Tooltip */}
                <span className="opacity-0 group-hover:opacity-100 absolute -top-1 bg-slate-900 border border-slate-800 text-[8px] text-gray-300 px-1 py-0.5 rounded transition-opacity duration-150 select-none">
                  {item.size}MB
                </span>
                
                {/* Bar element */}
                <div className="w-4 bg-slate-800 rounded-t-md overflow-hidden h-32 flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-purple-400 rounded-t-md transition-all duration-500 ease-out"
                    style={{ height: `${pct}%` }}
                  />
                </div>
                <span className="text-[9px] text-gray-500 font-mono">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Donut Chart Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
          <div>
            <h4 className="text-xs font-semibold text-gray-400">CMS Action Audits</h4>
            <p className="text-sm font-bold text-white mt-0.5">CRUD Modifications split</p>
          </div>
          <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
            <Activity className="h-4 w-4" />
          </div>
        </div>

        {/* Custom Circle/Donut SVG chart */}
        <div className="mt-4 flex items-center justify-around h-48">
          <div className="relative flex items-center justify-center">
            <svg className="w-32 h-32" viewBox="0 0 36 36">
              {/* Background circle */}
              <path
                className="text-slate-800"
                stroke="currentColor"
                strokeWidth="3.5"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Segment 1: Creations (emerald, 55%) */}
              <path
                className="text-emerald-500"
                strokeDasharray="55, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Segment 2: Updates (indigo, 30%, offset by 55%) */}
              <path
                className="text-indigo-400"
                strokeDasharray="30, 100"
                strokeDashoffset="-55"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Segment 3: Deletes (rose, 15%, offset by 85%) */}
              <path
                className="text-rose-400"
                strokeDasharray="15, 100"
                strokeDashoffset="-85"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-base font-extrabold text-white">85</span>
              <span className="text-[8px] text-gray-500 font-semibold uppercase tracking-wider">Logs</span>
            </div>
          </div>

          {/* Chart Legends */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-semibold">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Create (55%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-semibold">
              <div className="w-2 h-2 rounded-full bg-indigo-400" />
              <span>Update (30%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-semibold">
              <div className="w-2 h-2 rounded-full bg-rose-400" />
              <span>Delete (15%)</span>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default AnalyticsGrid;
