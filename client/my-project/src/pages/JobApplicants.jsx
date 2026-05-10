import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { Mail, Phone, FileText, CheckCircle, XCircle, Calendar, Clock, MapPin, X, Download } from "lucide-react";
import API from "../services/api";

export default function JobApplicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState({
    date: "",
    time: "",
    location: ""
  });
  const [updateLoading, setUpdateLoading] = useState(null); // applicationId

  const fetchApplicants = async () => {
    try {
      const res = await API.get(`/api/applications/job-applicants/${jobId}`);
      setApplicants(res.data);
    } catch (err) {
      console.error("Error fetching applicants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const handleUpdateStatus = async (applicationId, status, details = null) => {
    setUpdateLoading(applicationId);
    const toastId = toast.loading(`Updating status to ${status}...`);
    try {
      await API.put(`/api/applications/status/${applicationId}`, { 
        status, 
        interviewDetails: details 
      });
      toast.success(`Application ${status} successfully!`, { id: toastId });
      fetchApplicants();
      if (status === 'shortlisted') {
        setShowModal(false);
        setSelectedApp(null);
        setInterviewDetails({
          date: "",
          time: "",
          location: ""
        });
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status.", { id: toastId });
    } finally {
      setUpdateLoading(null);
    }
  };

  const openShortlistModal = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">Applicants List</h1>
      
      {loading ? (
        <p className="text-center text-gray-500">Loading applicants...</p>
      ) : applicants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicants.map((app) => (
            <div key={app._id} className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${
              app.status === "shortlisted" ? "border-green-500" : 
              app.status === "rejected" ? "border-red-500" : "border-indigo-500"
            }`}>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">{app.candidateId?.name || "Candidate"}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  app.status === "shortlisted" ? "bg-green-100 text-green-700" : 
                  app.status === "rejected" ? "bg-red-100 text-red-700" : "bg-indigo-100 text-indigo-700"
                }`}>
                  {app.status}
                </span>
              </div>

              <div className="space-y-1 mb-4">
                <p className="flex items-center gap-2 text-gray-600 text-sm">
                  <Mail size={14} />
                  {app.candidateId?.email || "N/A"}
                </p>
                <p className="flex items-center gap-2 text-gray-600 text-sm">
                  <Phone size={14} />
                  {app.candidateId?.phone || "N/A"}
                </p>
              </div>
              <p className="text-indigo-600 font-semibold mb-1 text-sm">Category: {app.resumeId?.category || "General"}</p>
              <p className="text-gray-600 font-medium text-sm">Match Score: {app.matchScore}%</p>
              
              <div className="flex flex-col gap-2 mt-6">
                {app.resumeId && (
                  <a
                    href={`http://localhost:5000/api/resumes/download/${app.resumeId._id}?token=${localStorage.getItem("token")}`}
                    className="flex-1 text-center bg-gray-900 text-white py-2.5 rounded-lg hover:bg-black transition text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Download size={14} />
                    Download Full Resume
                  </a>
                )}
                
                {app.status === "applied" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openShortlistModal(app)}
                      disabled={updateLoading === app._id}
                      className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {updateLoading === app._id ? <Spinner /> : <><CheckCircle size={14} /> Shortlist</>}
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(app._id, "rejected")}
                      disabled={updateLoading === app._id}
                      className="flex-1 bg-red-50 text-red-600 py-2 rounded hover:bg-red-100 transition text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {updateLoading === app._id ? <Spinner /> : <><XCircle size={14} /> Reject</>}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl shadow">
          <p className="text-gray-500 text-lg">No candidates have applied for this job yet.</p>
          <p className="text-gray-400 text-sm mt-2">Use the "Search Candidates" page to find matches from the existing database.</p>
        </div>
      )}

      {/* ===== SHORTLIST MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-10 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-400" />
            </button>

            <h3 className="text-2xl font-black text-gray-900 mb-2">Schedule Interview</h3>
            <p className="text-gray-500 mb-8">Set the interview details for {selectedApp?.candidateId?.name}</p>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Interview Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="date"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-indigo-500 outline-none"
                    value={interviewDetails.date}
                    onChange={(e) => setInterviewDetails({...interviewDetails, date: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Interview Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="time"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-indigo-500 outline-none"
                    value={interviewDetails.time}
                    onChange={(e) => setInterviewDetails({...interviewDetails, time: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Location / Meet Link</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="e.g. Google Meet link or Office address"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-indigo-500 outline-none"
                    value={interviewDetails.location}
                    onChange={(e) => setInterviewDetails({...interviewDetails, location: e.target.value})}
                  />
                </div>
              </div>

              <button
                onClick={() => handleUpdateStatus(selectedApp._id, "shortlisted", interviewDetails)}
                disabled={!interviewDetails.date || !interviewDetails.time || !interviewDetails.location}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
              >
                Confirm & Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
