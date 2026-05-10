import { useState } from "react";

export default function JobDescription() {
  const [jobDesc, setJobDesc] = useState("");
  const [message, setMessage] = useState("");

  const handleAnalyze = (e) => {
    e.preventDefault();

    if (jobDesc.trim() === "") {
      setMessage("Please enter a job description.");
      return;
    }

    // Temporary action (later connect API)
    setMessage("Job Description analyzed successfully!");
    console.log("Job Description:", jobDesc);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">

        <h2 className="text-xl font-bold text-indigo-600 mb-4">
          Enter Job Description
        </h2>

        <form onSubmit={handleAnalyze}>
          <textarea
            rows="6"
            placeholder="Paste job description here..."
            className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          ></textarea>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Analyze
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-green-600">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}
