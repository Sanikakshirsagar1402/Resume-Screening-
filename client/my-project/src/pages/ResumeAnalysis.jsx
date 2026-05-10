import { useEffect, useState } from "react";
import API from "../services/api";
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  User,
  Mail,
  Briefcase,
  Code
} from "lucide-react";

export default function ResumeAnalysis() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await API.get("/api/resumes");
        if (res.data.length > 0) {
          setResume(res.data[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <div className="bg-white p-12 rounded-[2rem] shadow-xl border border-indigo-50">
          <FileText size={64} className="mx-auto text-gray-200 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Analysis Available</h2>
          <p className="text-gray-500 mb-8">Upload your resume to see your detailed AI-powered ATS score.</p>
          <a href="/upload" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
            Upload Now
          </a>
        </div>
      </div>
    );
  }

  // ATS Tips Logic
  const atsTips = [
    { id: 1, text: "Use standard section headers like 'Experience' and 'Education'.", type: "success" },
    { id: 2, text: "Avoid complex formatting, columns, or tables which can confuse ATS.", type: "warning" },
    { id: 3, text: "Incorporate keywords directly from the job description.", type: "info" },
    { id: 4, text: "Save and upload your resume as a PDF for best results.", type: "success" }
  ];

  const score = resume.resumeScore || 0;
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8 animate-in fade-in duration-500">
      {/* ===== HEADER ===== */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">AI Resume <span className="text-indigo-600">Analysis</span></h1>
          <p className="text-gray-500 mt-1 font-medium">Personalized feedback for your professional profile</p>
        </div>
        <div className="flex items-center gap-3 bg-indigo-50 px-5 py-2.5 rounded-xl border border-indigo-100">
          <CheckCircle2 size={18} className="text-indigo-600" />
          <span className="text-indigo-900 font-bold uppercase tracking-widest text-[10px]">Analysis Complete</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ===== LEFT COL: SCORE ===== */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="relative inline-block mb-6">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="65"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-gray-100"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="65"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={circumference}
                  style={{ strokeDashoffset: offset }}
                  strokeLinecap="round"
                  className="text-indigo-600 transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-gray-900">{score}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ATS Score</span>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2">Resume Rating</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              {score >= 80 ? "Your resume is highly optimized for ATS systems!" : 
               score >= 50 ? "Good start! Some improvements are needed for better reach." : 
               "Your resume needs optimization to pass modern ATS filters."}
            </p>
          </div>

          <div className="bg-gray-900 p-8 rounded-3xl text-white shadow-lg space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Quick Facts</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-gray-400 text-sm">Experience</span>
                <span className="font-bold">{resume.experienceYears} Years</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Projects</span>
                <span className="font-bold">{resume.projects} Detected</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== RIGHT COL: SKILLS & TIPS ===== */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-50">
              <Code size={20} className="text-indigo-600" />
              <h3 className="text-xl font-bold text-gray-900">Top Extracted Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, i) => (
                <span key={i} className="px-4 py-2 bg-gray-50 text-gray-700 rounded-xl font-bold text-xs border border-gray-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-50">
              <Award size={20} className="text-emerald-600" />
              <h3 className="text-xl font-bold text-gray-900">Optimization Checklist</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {atsTips.map((tip) => (
                <div key={tip.id} className="flex gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-gray-600 leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}