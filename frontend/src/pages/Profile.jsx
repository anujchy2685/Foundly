// Profile.jsx — view and update your profile photo.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Camera, Loader2, User as UserIcon } from "lucide-react";
import { getMe, uploadProfilePicture } from "../services/authServices";
import { getStoredUser, getAvatarUrl } from "../utils/user";

export default function Profile() {
  const [user, setUser] = useState(() => getStoredUser());
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const fileRef = useRef(null);

  // Refresh from the server so the photo survives across devices/sessions
  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    getMe()
      .then((user) => {
        if (user) setUser(user);
      })
      .catch(() => {});
  }, []);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setNotice("");

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Photo must be 5MB or smaller.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in again.");
      return;
    }

    setUploading(true);
    try {
      const data = await uploadProfilePicture(file);
      setUser(data.user);
      setNotice("Profile photo updated.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not upload photo.");
    } finally {
      setUploading(false);
    }
  };

  const avatar = getAvatarUrl(user);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Link
        to="/userdashboard"
        className="inline-flex items-center gap-2 font-medium text-blue-600 hover:underline"
      >
        <ArrowLeft size={16} /> Back to dashboard
      </Link>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="relative mx-auto h-28 w-28">
          {avatar ? (
            <img
              src={avatar}
              alt={user?.name || "Profile"}
              className="h-28 w-28 rounded-full border border-slate-200 object-cover"
            />
          ) : (
            <span className="grid h-28 w-28 place-items-center rounded-full bg-blue-600 text-4xl font-bold text-white">
              {user?.name?.trim()?.charAt(0)?.toUpperCase() || (
                <UserIcon size={40} />
              )}
            </span>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            title="Change profile photo"
            className="absolute bottom-0 right-0 grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-slate-900 text-white transition hover:bg-slate-700 disabled:opacity-60"
          >
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
          </button>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFile}
        />

        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          {user?.name || "Your profile"}
        </h1>
        <p className="mt-1 text-slate-500">{user?.email || ""}</p>
        {user?.role && (
          <span className="mt-3 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">
            {user.role}
          </span>
        )}

        {notice && (
          <p role="status" className="mx-auto mt-5 max-w-md rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
            {notice}
          </p>
        )}
        {error && (
          <p role="alert" className="mx-auto mt-5 max-w-md rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "Change profile photo"}
        </button>
        <p className="mt-3 text-xs text-slate-400">
          JPG, PNG or WEBP, up to 5MB.
        </p>
      </div>
    </main>
  );
}
