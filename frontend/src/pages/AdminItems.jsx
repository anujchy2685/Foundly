
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAdminItems,
  updateAdminItem,
  deleteAdminItem,
} from "../services/adminService";

function AdminItems() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const loadItems = useCallback(async () => {
    try {
      setItems(await getAdminItems());
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load items");
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const editItem = async (item) => {
    const title = window.prompt("Edit item title:", item.title);
    if (title === null || !title.trim()) return;

    const description = window.prompt(
      "Edit item description:",
      item.description
    );
    if (description === null || !description.trim()) return;

    try {
      await updateAdminItem(item.itemType, item._id, {
        title: title.trim(),
        description: description.trim(),
      });

      alert("Item updated successfully");
      loadItems();
    } catch (err) {
      alert(err.message || "Unable to update item");
    }
  };

  const deleteItem = async (item) => {
    if (!window.confirm(`Remove "${item.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteAdminItem(item.itemType, item._id);

      loadItems();
    } catch (err) {
      alert(err.message || "Unable to delete item");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <Link to="/admindashboard" className="text-indigo-700">
        ← Dashboard
      </Link>
      <h1 className="my-6 text-2xl font-bold">Manage Lost & Found Items</h1>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article key={`${item.itemType}-${item._id}`} className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold">{item.title}</h2>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs capitalize text-indigo-700">
                {item.itemType}
              </span>
            </div>

            <p className="mt-2 text-gray-600">{item.description}</p>
            <p className="mt-2 text-sm text-gray-500">
              Category: {item.category}
            </p>
            <p className="text-sm text-gray-500">
              Location: {item.lostLocation || item.foundLocation || "Not provided"}
            </p>
            <p className="text-sm text-gray-500">
              Reported by: {item.reportedBy?.name || "Unknown"}
            </p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => editItem(item)}
                className="rounded bg-indigo-100 px-4 py-2 text-indigo-700"
              >
                Edit
              </button>
              <button
                onClick={() => deleteItem(item)}
                className="rounded bg-red-100 px-4 py-2 text-red-700"
              >
                Remove
              </button>
            </div>
          </article>
        ))}

        {items.length === 0 && !error && (
          <p className="text-gray-500">No item reports found.</p>
        )}
      </div>
    </main>
  );
}

export default AdminItems;