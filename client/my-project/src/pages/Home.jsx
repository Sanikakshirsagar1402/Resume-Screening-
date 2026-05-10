
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  Search, 
  UserCheck, 
  Cpu, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  BarChart3, 
  Zap,
  Globe,
  ShieldCheck,
  ChevronRight,
  LogOut,
  LayoutDashboard
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const dashboardPath = role === "recruiter" ? "/dashboard" : "/candidate-dashboard";
  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* ================= BACKGROUND DECORATION ================= */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      {/* ================= NAVBAR ================= */}
      <nav className="relative z-50 flex justify-between items-center px-8 py-6 backdrop-blur-md bg-[#0f172a]/50 border-b border-white/5 sticky top-0">
        <div className="flex items-center gap-3 group">
          <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
            <Cpu className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-white">
            Resume<span className="text-indigo-500">IQ</span>
          </h1>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">How it Works</a>
            <a href="#contact" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-4">
            {token ? (
              <>
                <Link
                  to={dashboardPath}
                  className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white transition-colors"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600/10 text-red-500 border border-red-500/20 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-red-600 hover:text-white transition-all active:scale-95 flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-bold text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative z-10 pt-24 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8 animate-bounce">
              <Zap size={14} />
              Smart AI Screening
            </div>
            
            <h2 className="text-6xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[1.1]">
              Find Your Next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">
                Star Candidate
              </span>
            </h2>

            <p className="text-gray-400 text-xl max-w-xl mb-12 leading-relaxed">
              Stop manually reviewing hundreds of resumes. Our AI-powered platform 
              uses semantic matching to find the perfect fit for your roles in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {token ? (
                <Link
                  to={dashboardPath}
                  className="group bg-indigo-600 text-white px-10 py-5 rounded-2xl text-lg font-black flex items-center gap-3 hover:bg-indigo-500 transition-all hover:translate-y-[-2px] active:scale-95 shadow-2xl shadow-indigo-600/20 w-full sm:w-auto justify-center"
                >
                  Go to Dashboard
                  <LayoutDashboard className="group-hover:rotate-6 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group bg-white text-[#0f172a] px-10 py-5 rounded-2xl text-lg font-black flex items-center gap-3 hover:bg-indigo-50 transition-all hover:translate-y-[-2px] active:scale-95 shadow-2xl shadow-white/10 w-full sm:w-auto justify-center"
                  >
                    Start Hiring Now
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    className="group px-10 py-5 rounded-2xl text-lg font-black flex items-center gap-3 border-2 border-white/10 hover:bg-white/5 transition-all w-full sm:w-auto justify-center"
                  >
                    Candidate Login
                    <ChevronRight size={20} className="text-gray-500 group-hover:text-white transition-colors" />
                  </Link>
                </>
              )}
            </div>

            {/* Stats Preview */}
            <div className="mt-16 grid grid-cols-2 gap-6 max-w-md">
              {[
                { label: "AI Accuracy", value: "99.8%" },
                { label: "Time Saved", value: "85%" },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
                  <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image Container */}
          <div className="relative group hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 blur-3xl group-hover:blur-[100px] transition-all duration-500 rounded-full"></div>
            <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl transform rotate-3 group-hover:rotate-0 transition-all duration-700">
              <img 
                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop" 
                alt="Resume Screening AI" 
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60"></div>
              
              {/* Floating Element */}
              <div className="absolute bottom-10 left-10 right-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-black">
                    A+
                  </div>
                  <div>
                    <div className="text-white font-black">Top Talent Found</div>
                    <div className="text-gray-400 text-xs">AI Match Score: 98.4%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section id="features" className="relative z-10 py-32 px-6 bg-[#0f172a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-4xl md:text-5xl font-black text-white mb-6">
              Supercharge Your Workflow
            </h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our advanced NLP engine goes beyond keywords to understand intent, experience, and potential.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="text-indigo-400" />,
                title: "Semantic Search",
                desc: "Find candidates based on concepts and context, not just matching keywords."
              },
              {
                icon: <BarChart3 className="text-purple-400" />,
                title: "ATS Scoring",
                desc: "Every resume is ranked with an ATS-friendly score based on structure and content."
              },
              {
                icon: <Mail className="text-blue-400" />,
                title: "Auto Notifications",
                desc: "Automatically notify shortlisted candidates with personalized interview details."
              },
              {
                icon: <UserCheck className="text-green-400" />,
                title: "Smart Ranking",
                desc: "Instant ranking of applicants from highest to lowest match for any job description."
              },
              {
                icon: <Globe className="text-orange-400" />,
                title: "Global Search",
                desc: "Access a diverse database of candidates across various industries and locations."
              },
              {
                icon: <ShieldCheck className="text-pink-400" />,
                title: "Secure Data",
                desc: "Enterprise-grade security for your candidate data and recruitment processes."
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-500">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500">
                  {feature.icon}
                </div>
                <h4 className="text-2xl font-black text-white mb-4">
                  {feature.title}
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-8">
                Ready to Hire <br /> Smarter?
              </h3>
              <ul className="space-y-6">
                {[
                  "Upload Job Description",
                  "Import Resumes in Bulk",
                  "Review AI Match Scores",
                  "Schedule Interviews Instantly"
                ].map((step, i) => (
                  <li key={i} className="flex items-center gap-4 text-white/90 font-bold">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
                      {i + 1}
                    </div>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <div className="space-y-4">
                <div className="h-4 w-3/4 bg-white/20 rounded-full animate-pulse"></div>
                <div className="h-4 w-1/2 bg-white/20 rounded-full animate-pulse delay-75"></div>
                <div className="h-4 w-5/6 bg-white/20 rounded-full animate-pulse delay-150"></div>
                <div className="mt-8 p-4 bg-white/10 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-400"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/2 bg-white/20 rounded-full"></div>
                    <div className="h-2 w-1/4 bg-white/20 rounded-full"></div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-400/20 text-green-400 text-[10px] font-black uppercase">
                    98% Match
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section id="contact" className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-8">
                Get in Touch
              </h3>
              <p className="text-gray-400 text-lg mb-12">
                Have questions about how our AI can transform your recruitment? Our team is here to help.
              </p>
              
              <div className="space-y-8">
                {[
                  { icon: <Mail />, text: "support@resumeiq.com" },
                  { icon: <Phone />, text: "+91 98765 43210" },
                  { icon: <MapPin />, text: "Tech Hub, Pune, MH, India" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                      {item.icon}
                    </div>
                    <span className="text-xl font-bold text-gray-300 group-hover:text-white transition-colors">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 backdrop-blur-sm">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2">Name</label>
                    <input type="text" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-indigo-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2">Email</label>
                    <input type="email" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-indigo-500 outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2">Message</label>
                  <textarea rows="4" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-indigo-500 outline-none transition-all"></textarea>
                </div>
                <button className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Cpu className="text-indigo-600" size={24} />
            <span className="text-xl font-black tracking-tighter">ResumeIQ</span>
          </div>
          
          <div className="text-gray-500 text-sm font-medium">
            © {new Date().getFullYear()} ResumeIQ Screening System. Built with ❤️ for recruiters.
          </div>

          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}




