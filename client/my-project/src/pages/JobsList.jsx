import { useEffect, useState } from "react";
import API from "../services/api";
import { Briefcase, MapPin, Building2, Search, ArrowRight, CheckCircle2, Filter, Zap } from "lucide-react";
import toast from "react-hot-toast";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setJobsFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/api/jobs");
        setJobs(res.data);
        setJobsFiltered(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        toast.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter(job => 
      (job.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (job.company?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (job.location?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );
    setJobsFiltered(filtered);
  }, [searchTerm, jobs]);

  const handleApply = async (jobId) => {
    const toastId = toast.loading("Submitting application...");
    try {
      const res = await API.post("/api/applications/apply", { jobId });
      toast.success(res.data.message, { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8 animate-in fade-in duration-500">
      {/* ===== HEADER & SEARCH ===== */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 space-y-8">
        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Explore <span className="text-indigo-600">Opportunities</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium leading-relaxed">
            Find the perfect role that matches your AI-analyzed skill profile.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search by role, company, or location..."
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-gray-700 text-base placeholder:text-gray-400 shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100">
            <Filter size={20} />
            Filters
          </button>
        </div>
      </div>

      {/* ===== JOBS GRID ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div key={job._id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <Zap size={10} className="fill-emerald-600" />
                AI Match: 95%
              </div>
            </div>

            <div className="mb-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <Building2 size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 line-clamp-1">{job.title}</h2>
                <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest">{job.company}</p>
              </div>
            </div>

            <div className="space-y-3 mb-8 flex-1">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                <MapPin size={16} className="text-gray-400" />
                <span>{job.location}</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                {job.description}
              </p>
            </div>

            <button
              onClick={() => handleApply(job._id)}
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all active:scale-95 shadow-sm"
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-dashed border-gray-200 max-w-2xl mx-auto">
          <Briefcase size={48} className="mx-auto text-gray-200" />
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-gray-900">No Jobs Found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search criteria or clear filters.</p>
          </div>
          <button 
            onClick={() => setSearchTerm("")}
            className="text-indigo-600 font-bold text-sm hover:underline"
          >
            Clear all search
          </button>
        </div>
      )}
    </div>
  );
}
