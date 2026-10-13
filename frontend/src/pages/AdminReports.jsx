
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getContentReports,
  reviewContentReport,
} from "../services/adminService";

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  const loadReports = useCallback(async () => {
    try {
      setReports(await getContentReports());
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load reports");
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const updateStatus = async (report, status) => {
    try {
      await reviewContentReport(report._id, status);
      loadReports();
    } catch (err) {
      alert(err.message || "Unable to update report");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <Link to="/admindashboard" className="text-indigo-700">
        ← Dashboard
      </Link>
      <h1 className="my-6 text-2xl font-bold">Review Content Reports</h1>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <div className="space-y-4">
        {reports.map((report) => (
          <article key={report._id} className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap justify-between gap-2">
              <h2 className="font-bold capitalize">
                {report.reason.replace("_", " ")} report
              </h2>
              <span className="text-sm capitalize text-gray-500">
                Status: {report.status}
              </span>
            </div>

            <p className="mt-2">
              Item: {report.item?.title || "Item no longer exists"}
            </p>
            <p className="text-sm text-gray-600">
              Type: {report.itemType}
            </p>
            <p className="text-sm text-gray-600">
              Submitted by: {report.reportedBy?.name || "Unknown"}
            </p>
            <p className="mt-2">{report.details || "No additional details"}</p>

            {report.status === "pending" && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => updateStatus(report, "reviewed")}
                  className="rounded bg-indigo-100 px-4 py-2 text-indigo-700"
                >
                  Mark Reviewed
                </button>
                <button
                  onClick={() => updateStatus(report, "dismissed")}
                  className="rounded bg-gray-200 px-4 py-2 text-gray-700"
                >
                  Dismiss
                </button>
              </div>
            )}
          </article>
        ))}

        {reports.length === 0 && !error && (
          <p className="text-gray-500">No content reports found.</p>
        )}
      </div>
    </main>
  );
}

export default AdminReports;