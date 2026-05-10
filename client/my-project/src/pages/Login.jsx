import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { Mail, Lock, LogIn, ArrowRight, Briefcase, User, AlertCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Logging in...");
    try {
      const { data } = await API.post("/api/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      toast.success("Login successful!", { id: toastId });
      
      if (data.role === "recruiter") {
        navigate("/search");
      } else {
        navigate("/upload");
      }
    } catch (err) {
      console.error("LOGIN ERROR DETAILS:", err);
      toast.error(err.response?.data?.message || "Invalid credentials", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 overflow-hidden flex flex-col md:flex-row border border-indigo-50">
        
        {/* Left Side: Branding/Visual */}
        <div className="md:w-1/2 bg-gradient-to-br from-indigo-600 to-violet-700 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <Briefcase size={32} />
              </div>
              <h1 className="text-3xl font-black tracking-tighter italic">ResumeIQ</h1>
            </div>
            
            <h2 className="text-5xl font-black leading-tight mb-6 tracking-tight">
              Unlock Your <br />
              <span className="text-indigo-200 underline decoration-indigo-400/50 underline-offset-8">Career Potential</span>
            </h2>
            <p className="text-indigo-100 text-lg leading-relaxed max-w-sm">
              Our AI-powered platform connects top talent with industry leaders through semantic matching.
            </p>
          </div>

          <div className="relative z-10 pt-12">
            <div className="flex -space-x-4 mb-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-indigo-600 bg-gray-200 overflow-hidden shadow-xl">
                  <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="User" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-indigo-600 bg-indigo-500 flex items-center justify-center text-xs font-bold shadow-xl">
                +2k
              </div>
            </div>
            <p className="text-sm font-bold text-indigo-200 uppercase tracking-widest">Joined by 2000+ professionals</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-12 md:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Welcome Back</h3>
            <p className="text-gray-500 font-medium">Please enter your details to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  type="email"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-gray-700 font-medium"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" size={20} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline decoration-indigo-200 underline-offset-4">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  type="password"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-gray-700 font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-gray-200 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? <Spinner /> : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-gray-500 font-medium">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-black hover:text-indigo-700 underline decoration-indigo-200 underline-offset-4">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

