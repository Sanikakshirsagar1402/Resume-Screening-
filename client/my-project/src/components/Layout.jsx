import Navbar from "./Navbar";
import bgImage from "../assets/bg.jpg";

export default function Layout({ children }) {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Global overlay */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* Navbar */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Page Content */}
      <main className="relative z-10 pt-20">
        {children}
      </main>
    </div>
  );
}
