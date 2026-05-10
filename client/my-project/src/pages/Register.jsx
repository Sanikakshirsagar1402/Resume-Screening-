import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { Mail, Lock, User, UserPlus, ArrowRight, Briefcase, ShieldCheck, Phone, AlertCircle } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "candidate",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const { email, password, phone } = formData;
    
    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return false;
    }

    // Password validation: At least 8 chars, one uppercase, one lowercase, one number, one special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error("Password must be 8+ chars with uppercase, lowercase, number and special char");
      return false;
    }

    // Phone validation: Exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    const toastId = toast.loading("Creating account...");
    try {
      await API.post("/api/auth/register", formData);
      toast.success("Registration successful! Please log in.", { id: toastId });
      navigate("/login");
    } catch (err) {
      console.error("REGISTER ERROR DETAILS:", err);
      toast.error(err.response?.data?.message || "Registration failed!", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 overflow-hidden flex flex-col md:flex-row-reverse border border-indigo-50">
        
        {/* Left Side: Branding/Visual */}
        <div className="md:w-1/2 bg-gradient-to-br from-violet-600 to-indigo-700 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <Briefcase size={32} />
              </div>
              <h1 className="text-3xl font-black tracking-tighter italic">ResumeIQ</h1>
            </div>
            
            <h2 className="text-5xl font-black leading-tight mb-6 tracking-tight">
              Start Your <br />
              <span className="text-violet-200 underline decoration-violet-400/50 underline-offset-8">Journey Today</span>
            </h2>
            <p className="text-violet-100 text-lg leading-relaxed max-w-sm">
              Join thousands of professionals and recruiters using AI to revolutionize the hiring process.
            </p>
          </div>

          <div className="relative z-10 pt-12">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="text-violet-300" size={20} />
                <p className="text-sm font-bold uppercase tracking-widest text-violet-200">AI Verified Matching</p>
              </div>
              <p className="text-sm text-violet-100">Our semantic matching algorithm ensures 98% accuracy in candidate-job alignment.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-12 md:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Create Account</h3>
            <p className="text-gray-500 font-medium">Join the future of recruitment</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors" size={18} />
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 transition-all outline-none text-gray-700 font-medium"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors" size={18} />
                <input
                  type="email"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 transition-all outline-none text-gray-700 font-medium"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors" size={18} />
                <input
                  type="tel"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 transition-all outline-none text-gray-700 font-medium"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors" size={18} />
                <input
                  type="password"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 transition-all outline-none text-gray-700 font-medium"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">I am a...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "candidate" })}
                  className={`py-3 rounded-2xl font-bold border-2 transition-all ${
                    formData.role === "candidate" 
                      ? "bg-violet-50 border-violet-500 text-violet-700 shadow-lg shadow-violet-100" 
                      : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                  }`}
                >
                  Candidate
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "recruiter" })}
                  className={`py-3 rounded-2xl font-bold border-2 transition-all ${
                    formData.role === "recruiter" 
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-lg shadow-indigo-100" 
                      : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                  }`}
                >
                  Recruiter
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-gray-200 active:scale-[0.98] disabled:opacity-50 mt-4"
            >
              {loading ? <Spinner /> : (
                <>
                  Create Account
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-600 font-black hover:text-violet-700 underline decoration-violet-200 underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

