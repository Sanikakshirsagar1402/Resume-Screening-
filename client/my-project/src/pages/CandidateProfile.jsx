import { useEffect, useState } from "react";
import API from "../services/api";
// import { useNavigate } from "react-router-dom";


import { 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  User, 
  Mail, 
  Briefcase, 
  Code,
  Phone,
  Building2,
  ShieldCheck
} from "lucide-react";

export default function CandidateProfile() {
  const [resume, setResume] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await API.get("/api/auth/me");
        setUser(userRes.data);

        if (userRes.data.role === "candidate") {
          const resumeRes = await API.get("/api/resumes");
          if (resumeRes.data.length > 0) {
            setResume(resumeRes.data[0]);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // RECRUITER PROFILE UI
  if (user?.role === "recruiter") {
    return (
      <div className="max-w-4xl mx-auto pb-20 space-y-10 animate-in fade-in duration-700">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck size={14} />
            Recruiter Profile
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Account <span className="text-indigo-600">Details</span>
          </h1>
        </div>

        <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-indigo-100 border border-indigo-50 flex flex-col items-center">
          <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white mb-8 shadow-xl shadow-indigo-200">
            <User size={48} />
          </div>
          
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 flex items-center gap-3">
                <User size={18} className="text-indigo-500" />
                {user.name}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 flex items-center gap-3">
                <Mail size={18} className="text-indigo-500" />
                {user.email}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Company Name</label>
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 flex items-center gap-3">
                <Building2 size={18} className="text-indigo-500" />
                {user.company || "Not Provided"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 flex items-center gap-3">
                <Phone size={18} className="text-indigo-500" />
                {user.phone || "Not Provided"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CANDIDATE WITHOUT RESUME
  if (!resume && user?.role === "candidate") {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <div className="bg-white p-12 rounded-[2rem] shadow-xl border border-indigo-50">
          <FileText size={64} className="mx-auto text-gray-200 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Resume Found</h2>
          <p className="text-gray-500 mb-8">Please upload your resume to see your profile details and ATS analysis.</p>
          <a href="/upload" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
            Upload Now
          </a>
        </div>
      </div>
    );
  }

  // CANDIDATE PROFILE UI
  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-10 animate-in fade-in duration-700">
      {/* ===== HEADER ===== */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Profile</h1>
          <p className="text-gray-500 mt-2 text-lg">AI-powered ATS Resume Analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ===== LEFT COL: SCORE & FEEDBACK ===== */}
        <div className="lg:col-span-1 space-y-8">
          {/* ATS SCORE CARD */}
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-indigo-100/50 border border-indigo-50 text-center">
            <div className="relative inline-block mb-6">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-gray-100"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * resume.resumeScore) / 100}
                  className={`${
                    resume.resumeScore >= 80 ? 'text-emerald-500' : 
                    resume.resumeScore >= 50 ? 'text-amber-500' : 'text-rose-500'
                  } transition-all duration-1000 ease-out`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-gray-900">{resume.resumeScore}%</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">ATS Score</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {resume.resumeScore >= 80 ? 'Excellent!' : resume.resumeScore >= 50 ? 'Good' : 'Needs Work'}
            </h3>
            <p className="text-gray-500 text-sm">
              Your resume is {resume.resumeScore}% optimized for Applicant Tracking Systems.
            </p>
          </div>

          {/* ATS FEEDBACK */}
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-indigo-100/50 border border-indigo-50">
            <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <AlertCircle size={20} className="text-indigo-600" />
              ATS Optimization
            </h4>
            <div className="space-y-4">
              {resume.atsFeedback && resume.atsFeedback.length > 0 ? (
                resume.atsFeedback.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-rose-50 rounded-xl border border-rose-100">
                    <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-white">!</span>
                    </div>
                    <p className="text-sm text-rose-700 font-medium leading-tight">{tip}</p>
                  </div>
                ))
              ) : (
                <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                  <p className="text-sm text-emerald-700 font-medium">Your resume structure looks great!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== RIGHT COL: DETAILS ===== */}
        <div className="lg:col-span-2 space-y-8">
          {/* CORE DETAILS */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-indigo-100/50 border border-indigo-50">
            <div className="flex items-center gap-4 mb-10 pb-10 border-b border-gray-100">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <User size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{user?.name || resume.originalname}</h3>
                <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs mt-1">{resume.category || "General"}</p>
                <div className="flex gap-4 mt-2">
                  <span className="flex items-center gap-1 text-sm text-gray-500 font-medium">
                    <Mail size={14} />
                    {user?.email || resume.email || "N/A"}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-500 font-medium">
                    <Phone size={14} />
                    {user?.phone || resume.phone || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-3">Key Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.map((skill, i) => (
                      <span key={i} className="px-4 py-2 bg-gray-50 text-gray-700 rounded-xl font-bold text-sm border border-gray-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-3">Education</label>
                  <div className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                    <Award className="text-indigo-600" size={24} />
                    <span className="font-bold text-gray-900">{resume.education}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-3">Professional Experience</label>
                  <div className="flex items-center gap-3 p-4 bg-violet-50/50 rounded-2xl border border-violet-100/50">
                    <Briefcase className="text-violet-600" size={24} />
                    <span className="font-bold text-gray-900">{resume.experienceYears} Years</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-3">Project Count</label>
                  <div className="flex items-center gap-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                    <Code className="text-emerald-600" size={24} />
                    <span className="font-bold text-gray-900">{resume.projects} Projects Identified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI SUMMARY BOX */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200">
            <h4 className="text-xl font-bold mb-4 flex items-center gap-3">
              <Briefcase size={24} />
              AI Career Recommendation
            </h4>
            <p className="text-indigo-50 leading-relaxed text-lg italic">
              "Based on your profile as a <span className="font-bold text-white underline decoration-indigo-400">{resume.category}</span>, you have strong foundations in <span className="font-bold text-white">{resume.skills.slice(0, 2).join(" and ")}</span>. To increase your ATS score, consider {resume.atsFeedback[0]?.toLowerCase() || "adding more specific technical certifications"}."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}