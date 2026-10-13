/** @format */

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { reportItem } from "../../services/itemsService";

function ReportItem() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const itemType = pathname.startsWith("/found-items/") ? "found" : "lost";
  const isFound = itemType === "found";
  const locationField = isFound ? "foundLocation" : "lostLocation";
  const dateField = isFound ? "foundDate" : "lostDate";
  const listPath = isFound ? "/founditems" : "/lostitems";

  // Lost/found dates can only be today or earlier — never in the future.
  // Built from local time so the cap is correct in every timezone.
  const todayStr = (() => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  })();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    lostLocation: "",
    lostDate: "",
    foundLocation: "",
    foundDate: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => images.forEach(({ preview }) => URL.revokeObjectURL(preview));
  }, [images]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files || []);

    if (selectedImages.length > 5) {
      alert("You can upload a maximum of 5 images");
      e.target.value = "";
      setImages([]);
      return;
    }

    if (selectedImages.some((image) => image.size > 5 * 1024 * 1024)) {
      alert("Each image must be 5MB or smaller");
      e.target.value = "";
      setImages([]);
      return;
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (selectedImages.some((image) => !allowedTypes.includes(image.type))) {
      alert("Only JPG, JPEG, PNG and WEBP images are allowed");
      e.target.value = "";
      setImages([]);
      return;
    }

    setImages(
      selectedImages.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form[dateField] && form[dateField] > todayStr) {
      alert(`${isFound ? "Found" : "Lost"} date cannot be in the future`);
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append(locationField, form[locationField]);
      formData.append(dateField, form[dateField]);

      images.forEach(({ file }) => {
        formData.append("images", file);
      });

      await reportItem(itemType, formData);

      alert(`${isFound ? "Found" : "Lost"} item reported successfully`);

      navigate(listPath);
    } catch (error) {
      console.error(error);

      alert(error.message || `Failed to report ${itemType} item`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Community report
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Report a {itemType} item
          </h1>

          <p className="mt-2 text-slate-500">
            Provide accurate information to help someone return your belongings.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="space-y-6">
            <div>
              <label className="mb-2 block font-medium text-slate-700">
                Item name
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder=""
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-slate-700">
                Category
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                required
              >
                <option value="">Select category</option>
                <option value="Wallets">Wallets</option>
                <option value="Bags">Bags</option>
                <option value="Documents">Documents</option>
                <option value="Electronics">Electronics</option>
                <option value="Keys">Keys</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the item, color, brand, identifying marks..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-slate-700">
                {isFound ? "Found location" : "Lost location"}
              </label>

              <input
                type="text"
                name={locationField}
                value={form[locationField]}
                onChange={handleChange}
                placeholder=""
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-slate-700">
                {isFound ? "Found date" : "Lost date"}
              </label>

              <input
                type="date"
                name={dateField}
                value={form[dateField]}
                onChange={handleChange}
                max={todayStr}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                required
              />

              <p className="mt-2 text-sm text-slate-400">
                Only today or a past date can be selected.
              </p>
            </div>

            <div>
              <label className="mb-2 block font-medium text-slate-700">
                Photos
              </label>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageChange}
                name="images"
                className="block w-full rounded-xl border border-slate-200 p-3"
              />

              <p className="mt-2 text-sm text-slate-400">
                You can upload up to 5 images. Maximum 5MB each.
              </p>

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {images.map(({ preview }, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-xl border"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-32 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t pt-6">
              <button
                type="button"
                onClick={() => navigate(listPath)}
                className="rounded-xl border border-slate-200 px-6 py-3 font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Reporting..." : `Report ${itemType} item`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportItem;
