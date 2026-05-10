import React, { useState } from "react";
import API from "../services/api";
import { 
  Search, 
  FileText, 
  Download, 
  User, 
  X, 
  Briefcase, 
  Mail, 
  Award, 
  CheckCircle2, 
  Phone, 
  Zap, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function SearchCandidates() {
  const [jobDescription, setJobDescription] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    if (!token) {
      setError("You must be logged in to search candidates. Please log in again.");
      return;
    }

    setLoading(true);
    setSearched(false);
    setError("");
    try {
      const { data } = await API.post("/api/jobs/match", { jobDescription });
      setCandidates(data.candidates);
      setSearched(true);
    } catch (err) {
      console.error("SEARCH ERROR:", err);
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (err.code === 'ECONNABORTED') {
        setError("Search timed out. Please try a shorter description or try again later.");
      } else if (!err.response) {
        setError("Network error: Could not reach the server. Please check if the backend is running.");
      } else {
        setError(err.response?.data?.message || "Matching failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* ===== HEADER SECTION ===== */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 space-y-8">
        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Find the Best <span className="text-indigo-600">Candidates</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium leading-relaxed">
            Enter a job description below and our AI will semantically match the most qualified candidates from your database.
          </p>
        </div>

        <form onSubmit={handleSearch} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Job Description
            </label>
            <textarea
              className="w-full h-40 p-5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-gray-700 text-base placeholder:text-gray-400 resize-none"
              placeholder="e.g. We are looking for a Senior React Developer with 5+ years of experience in TypeScript and cloud architecture..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Search size={20} />
                Match Candidates
              </>
            )}
          </button>
        </form>
      </div>

      {/* ===== ERROR MESSAGE ===== */}
      {error && (
        <div className="p-4 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 flex items-center gap-3 font-bold">
          <X size={18} />
          {error}
        </div>
      )}

      {/* ===== RESULTS ===== */}
      {candidates.length > 0 ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold text-gray-900 px-2">
            Matched Candidates ({candidates.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <User size={24} />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-black tracking-widest ${
                    candidate.score >= 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {candidate.score}% MATCH
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{candidate.name || "Candidate"}</h3>
                    <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest">{candidate.category}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                    <Briefcase size={16} className="text-gray-400" />
                    <span>{candidate.experienceYears || 0} Years Experience</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {(candidate.skills || []).slice(0, 3).map((skill, i) => (
                      <span key={i} className="bg-gray-50 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold border border-gray-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCandidate(candidate)}
                  className="w-full mt-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all active:scale-95"
                >
                  View Full Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : searched && (
        <div className="py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-center max-w-2xl mx-auto">
          <Search size={48} className="mx-auto text-gray-200 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Candidates Matched</h2>
          <p className="text-gray-500 mb-0">Try adjusting your description or broadening your requirements.</p>
        </div>
      )}

      {/* ===== CANDIDATE MODAL ===== */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex justify-center items-center p-4 z-[60] animate-in fade-in duration-300">
          <div className="bg-white rounded-[3.5rem] w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-[0_40px_100px_-15px_rgba(0,0,0,0.3)] relative animate-in zoom-in-95 duration-500 border border-gray-100">
            <button
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-8 right-8 p-3 hover:bg-gray-100 rounded-2xl transition-all group active:scale-90"
            >
              <X size={28} className="text-gray-400 group-hover:text-gray-900" />
            </button>

            <div className="overflow-y-auto max-h-[90vh] p-12 md:p-16">
              <div className="flex flex-col md:flex-row items-start gap-10 mb-12">
                <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-2xl shadow-indigo-200 ring-8 ring-indigo-50">
                  <User size={64} />
                </div>
                <div className="space-y-4 pt-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em]">
                    <ShieldCheck size={14} className="fill-emerald-600" />
                    Verified AI Profile
                  </div>
                  <h2 className="text-5xl font-black text-gray-900 tracking-tight leading-none">
                    {selectedCandidate.name}
                  </h2>
                  <div className="flex flex-wrap gap-6 text-gray-500 font-bold">
                    <span className="flex items-center gap-2 hover:text-indigo-600 transition-colors cursor-default">
                      <Mail size={20} />
                      {selectedCandidate.email || "No Email"}
                    </span>
                    <span className="flex items-center gap-2 hover:text-indigo-600 transition-colors cursor-default">
                      <Phone size={20} />
                      {selectedCandidate.phone || "No Phone"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 flex flex-col justify-between">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Category</p>
                  <p className="text-2xl font-black text-gray-900">{selectedCandidate.category}</p>
                </div>
                <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 flex flex-col justify-between">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Experience</p>
                  <p className="text-2xl font-black text-gray-900">{selectedCandidate.experienceYears || 0} Years</p>
                </div>
                <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-200 flex flex-col justify-between text-white">
                  <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mb-4">Match Score</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black tracking-tighter">{selectedCandidate.score}</span>
                    <span className="text-xl font-bold opacity-60">%</span>
                  </div>
                </div>
              </div>

              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <Sparkles size={20} />
                  </div>
                  <h4 className="text-2xl font-black text-gray-900 tracking-tight">AI Detected Skills</h4>
                </div>
                <div className="flex flex-wrap gap-3">
                  {(selectedCandidate.skills || []).map((skill, i) => (
                    <span
                      key={i}
                      className="px-6 py-3 bg-gray-50 text-gray-900 rounded-2xl font-black text-sm border border-gray-100 hover:bg-white hover:border-indigo-500 hover:shadow-lg transition-all duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-gray-100">
                <a
                  href={`http://localhost:5000/api/resumes/download/${selectedCandidate.id}?token=${localStorage.getItem("token")}`}
                  className="flex-1 bg-gray-900 text-white py-5 rounded-[2rem] font-black text-xl hover:bg-black transition-all flex items-center justify-center gap-3 shadow-2xl shadow-gray-200 active:scale-[0.98]"
                >
                  <Download size={24} />
                  Download Full Resume
                </a>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="px-10 py-5 bg-gray-50 text-gray-500 rounded-[2rem] font-black text-xl hover:bg-gray-100 transition-all border border-gray-100"
                >
                  Return to List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}