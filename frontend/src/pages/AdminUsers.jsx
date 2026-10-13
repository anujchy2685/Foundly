
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAdminUsers,
  toggleAdminUserStatus,
  deleteAdminUser,
} from "../services/adminService";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      setUsers(await getAdminUsers());
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load users");
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const toggleStatus = async (user) => {
    try {
      await toggleAdminUserStatus(user._id);
      loadUsers();
    } catch (err) {
      alert(err.message || "Unable to update user");
    }
  };

  const removeUser = async (user) => {
    if (!window.confirm(`Delete account for ${user.name}?`)) return;

    try {
      await deleteAdminUser(user._id);
      loadUsers();
    } catch (err) {
      alert(err.message || "Unable to delete user");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <Link to="/admindashboard" className="text-indigo-700">
        ← Dashboard
      </Link>
      <h1 className="my-6 text-2xl font-bold">Manage Users</h1>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">
                  {user.isActive ? "Active" : "Inactive"}
                </td>
                <td className="space-x-2 p-4">
                  {user.role !== "admin" && (
                    <>
                      <button
                        onClick={() => toggleStatus(user)}
                        className="rounded bg-indigo-100 px-3 py-1 text-indigo-700"
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => removeUser(user)}
                        className="rounded bg-red-100 px-3 py-1 text-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default AdminUsers;