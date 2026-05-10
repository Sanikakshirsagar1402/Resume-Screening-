import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Users, FileCheck, FileX, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const [counts, setCounts] = useState({
    total: 0,
    shortlisted: 0,
    rejected: 0,
  });

  useEffect(() => {
    async function fetchCounts() {
      try {
        const { data } = await API.get("/api/resumes/dashboard/st");
        setCounts(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchCounts();
  }, []);

  const stats = [
    { 
      label: "Total Resumes", 
      value: counts.total, 
      icon: Users, 
      color: "bg-indigo-500", 
      lightColor: "bg-indigo-50",
      textColor: "text-indigo-600"
    },
    { 
      label: "Shortlisted", 
      value: counts.shortlisted, 
      icon: FileCheck, 
      color: "bg-emerald-500", 
      lightColor: "bg-emerald-50",
      textColor: "text-emerald-600"
    },
    { 
      label: "Rejected", 
      value: counts.rejected, 
      icon: FileX, 
      color: "bg-rose-500", 
      lightColor: "bg-rose-50",
      textColor: "text-rose-600"
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* ===== PAGE HEADER ===== */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Recruiter Dashboard
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Welcome back! Here's an overview of your recruitment pipeline.
        </p>
      </div>

      {/* ===== METRIC CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.lightColor} p-3 rounded-xl`}>
                <stat.icon className={stat.textColor} size={28} />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-bold">
                <TrendingUp size={12} />
                +12%
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <h2 className="text-4xl font-bold text-gray-900 mt-1">
                {stat.value}
              </h2>
            </div>
            <div className="mt-6 h-2 w-full bg-gray-50 rounded-full overflow-hidden">
              <div 
                className={`h-full ${stat.color} rounded-full transition-all duration-1000`} 
                style={{ width: stat.value > 0 ? "70%" : "0%" }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== RECENT ACTIVITY / PLACEHOLDER ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Applications</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold">
                  {String.fromCharCode(65 + i)}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">Candidate #{i+1}</h4>
                  <p className="text-sm text-gray-500">Applied for Full Stack Developer</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">92% Match</span>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="bg-indigo-50 p-6 rounded-full mb-6 text-indigo-600">
            <TrendingUp size={48} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Platform Growth</h3>
          <p className="text-gray-500 max-w-xs mx-auto">
            Your candidate pool has grown by 24% this month. Post more jobs to attract top talent!
          </p>
          <button className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}

