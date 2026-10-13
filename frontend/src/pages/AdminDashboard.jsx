
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getOverview } from "../services/adminService";
import { logout } from "../services/authServices";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getOverview()
      .then((data) => setStats(data))
      .catch((err) => setError(err.message || "Unable to load dashboard"));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const cards = [
    ["Total Users", stats?.totalUsers],
    ["Active Users", stats?.activeUsers],
    ["Lost Items", stats?.totalLostItems],
    ["Found Items", stats?.totalFoundItems],
    ["All Items", stats?.totalItems],
    ["Pending Reports", stats?.pendingReports],
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center justify-between bg-indigo-700 px-6 py-4 text-white">
        <h1 className="text-xl font-bold">Foundly Admin</h1>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-white px-4 py-2 text-indigo-700"
        >
          Logout
        </button>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        <h2 className="mb-6 text-2xl font-bold">Platform Overview</h2>

        {error && <p className="mb-4 text-red-600">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(([label, value]) => (
            <div key={label} className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-gray-500">{label}</p>
              <p className="mt-2 text-3xl font-bold">
                {value ?? "..."}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Link
            to="/admin/users"
            className="rounded-xl bg-white p-5 font-semibold shadow-sm hover:bg-indigo-50"
          >
            Manage Users →
          </Link>
          <Link
            to="/admin/items"
            className="rounded-xl bg-white p-5 font-semibold shadow-sm hover:bg-indigo-50"
          >
            Manage Items →
          </Link>
          <Link
            to="/admin/reports"
            className="rounded-xl bg-white p-5 font-semibold shadow-sm hover:bg-indigo-50"
          >
            Review Reports →
          </Link>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;