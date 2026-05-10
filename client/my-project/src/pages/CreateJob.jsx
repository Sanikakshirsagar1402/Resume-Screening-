import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function CreateJob() {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      setMessage("Job posted successfully!");
      setTimeout(() => navigate("/manage-jobs"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to post job");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6">Post New Job</h2>

        <form onSubmit={handlePost}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Job Title</label>
            <input
              type="text"
              placeholder="e.g. Full Stack Developer"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Company Name</label>
            <input
              type="text"
              placeholder="e.g. TechCorp Solutions"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Location</label>
            <input
              type="text"
              placeholder="e.g. Mumbai, India"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Job Description</label>
            <textarea
              rows="6"
              placeholder="Paste job description here..."
              className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-bold"
          >
            Post Job
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center font-semibold ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
