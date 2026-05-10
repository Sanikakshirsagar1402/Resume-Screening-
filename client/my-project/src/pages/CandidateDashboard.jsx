import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { UploadCloud, FileText, BarChart3, Briefcase, ArrowRight, CheckCircle2, Clock, Zap } from "lucide-react";

export default function CandidateDashboard() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await API.get("/api/resumes");
        if (res.data.length > 0) {
          setResume(res.data[0]);
        }
      } catch (error) {
        console.error("Error fetching resume:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* ===== WELCOME SECTION ===== */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left space-y-4 max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Welcome back, <span className="text-indigo-600">Future Leader!</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium leading-relaxed">
            Everything you need to optimize your career path is right here. Start by analyzing your resume or exploring new job opportunities.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
            <button
              onClick={() => navigate(resume ? "/resume-analysis" : "/upload")}
              className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold text-base flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
            >
              {resume ? "View AI Analysis" : "Upload Your Resume"}
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate("/jobs")}
              className="px-8 py-3.5 rounded-xl font-bold text-base border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
            >
              Browse Available Jobs
            </button>
          </div>
        </div>

        {/* Simplified Status Card */}
        <div className="w-full md:w-72 bg-indigo-50 rounded-2xl p-6 border border-indigo-100 text-center">
          <p className="text-indigo-600 text-xs font-black uppercase tracking-widest mb-4">Resume Health</p>
          <div className="text-5xl font-black text-indigo-900 mb-2">
            {resume ? `${resume.resumeScore}%` : "0%"}
          </div>
          <p className="text-sm font-bold text-indigo-400 mb-6">ATS Match Score</p>
          <div className="h-2 w-full bg-indigo-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
              style={{ width: resume ? `${resume.resumeScore}%` : "0%" }}
            ></div>
          </div>
        </div>
      </div>

      {/* ===== ACTIONS GRID ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Update Resume",
            icon: <UploadCloud className="text-indigo-600" />,
            desc: "Refresh your profile with latest skills",
            path: "/upload",
            bgColor: "bg-indigo-50"
          },
          {
            title: "AI Analysis",
            icon: <BarChart3 className="text-emerald-600" />,
            desc: "See how AI ranks your profile",
            path: "/resume-analysis",
            bgColor: "bg-emerald-50"
          },
          {
            title: "Job Matching",
            icon: <Briefcase className="text-amber-600" />,
            desc: "Roles tailored to your skills",
            path: "/jobs",
            bgColor: "bg-amber-50"
          },
          {
            title: "Profile Settings",
            icon: <FileText className="text-rose-600" />,
            desc: "Manage your account details",
            path: "/candidate-profile",
            bgColor: "bg-rose-50"
          }
        ].map((action, i) => (
          <button
            key={i}
            onClick={() => navigate(action.path)}
            className="group p-6 rounded-2xl bg-white border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-300 text-left"
          >
            <div className={`w-12 h-12 ${action.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-1">{action.title}</h4>
            <p className="text-gray-500 text-xs leading-relaxed">{action.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}