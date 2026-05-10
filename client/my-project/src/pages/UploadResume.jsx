import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { UploadCloud, FileText, CheckCircle2, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const navigate = useNavigate();

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Only PDF or Word files allowed.");
      return;
    }

    setFile(selectedFile);
    toast.success(`${selectedFile.name} selected!`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a resume first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    const toastId = toast.loading("Uploading and analyzing resume...");

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => (prev < 90 ? prev + 10 : prev));
      }, 200);

      await API.post("/api/resumes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast.success("Resume analyzed successfully!", { id: toastId });
      setTimeout(() => {
        navigate("/resume-analysis");
      }, 1500);
    } catch (e) {
      console.error("UPLOAD ERROR:", e);
      const errorMsg = e.response?.data?.message || "Upload failed. Please try again.";
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* ===== HEADER SECTION ===== */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Upload Your <span className="text-indigo-600">Resume</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
          Get instant AI-powered feedback and optimize your resume for modern hiring systems.
        </p>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            dragActive
              ? "border-indigo-600 bg-indigo-50"
              : "border-gray-200 hover:border-indigo-300"
          }`}
        >
          <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
            <UploadCloud size={40} />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {file ? "File Selected" : "Drag & Drop Resume"}
          </h3>
          <p className="text-gray-500 mb-8 text-sm">
            {file ? file.name : "Supports PDF, DOC, and DOCX formats"}
          </p>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFile(e.target.files[0])}
            className="hidden"
            id="fileUpload"
          />

          <label
            htmlFor="fileUpload"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <FileText size={18} />
            Choose File
          </label>
        </div>

        {loading && (
          <div className="mt-8 space-y-3">
            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span>Analyzing content...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="w-full mt-10 bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-100 active:scale-95"
        >
          {loading ? <Spinner /> : <><CheckCircle2 size={20} /> Process Resume</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "ATS Friendly", desc: "Optimized for modern tracking systems.", icon: <CheckCircle2 className="text-emerald-500" /> },
          { title: "Skill Extraction", desc: "Automatically identifies your top talents.", icon: <ShieldCheck className="text-indigo-500" /> },
          { title: "Instant Score", desc: "Get immediate feedback on your profile.", icon: <AlertCircle className="text-amber-500" /> }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              {item.icon}
            </div>
            <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
            <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
