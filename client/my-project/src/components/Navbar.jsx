import { useState, useRef, useEffect } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { 
  User, 
  LogOut, 
  Settings, 
  ChevronDown, 
  Briefcase, 
  LayoutDashboard, 
  Search, 
  Upload, 
  BarChart3, 
  UserCircle 
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) => 
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
      isActive 
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
        : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
    }`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Briefcase className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            ResumeIQ
          </h1>
        </Link>

        <div className="hidden lg:flex items-center gap-2">
          {role === "recruiter" && (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                <LayoutDashboard size={18} />
                Dashboard
              </NavLink>
              <NavLink to="/manage-jobs" className={navLinkClass}>
                <Briefcase size={18} />
                Manage Jobs
              </NavLink>
              <NavLink to="/search" className={navLinkClass}>
                <Search size={18} />
                Search Candidates
              </NavLink>
            </>
          )}
        </div>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <User size={20} />
          </div>
          <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4 border-b border-gray-50 bg-gray-50/50">
              <p className="text-sm font-bold text-gray-900">User Account</p>
              <p className="text-xs text-gray-500 capitalize">{role || "User"}</p>
            </div>
            <div className="p-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/candidate-profile");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all font-medium"
              >
                <User size={18} />
                See Profile Details
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/settings"); // Assuming there might be settings later
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all font-medium"
              >
                <Settings size={18} />
                Settings
              </button>
            </div>
            <div className="p-2 border-t border-gray-50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
