import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/api/jobs");
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-indigo-600">Manage Jobs</h1>
        <button
          onClick={() => navigate("/create-job")}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold"
        >
          Post New Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
              <p className="text-gray-600 font-medium">{job.company}</p>
              <p className="text-gray-500 text-sm mb-4">{job.location}</p>
            </div>
            <button
              onClick={() => navigate(`/job-applicants/${job._id}`)}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition font-semibold"
            >
              View Applicants
            </button>
          </div>
        ))}
      </div>

      {jobs.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No jobs posted yet.</p>
      )}
    </div>
  );
}
