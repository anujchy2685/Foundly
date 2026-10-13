// ItemDetail.jsx — single lost/found report. Rendered at /lostitems/:id and /founditems/:id.
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Tag, User as UserIcon, PackageSearch } from "lucide-react";
import { getItemImageUrl } from "../utils/itemImages";
import { getAvatarUrl } from "../utils/user";
import { getLostItem, getFoundItem } from "../services/itemsService";

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

export default function ItemDetail({ type }) {
  const { id } = useParams();
  const isFound = type === "found";
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const fetchItem = type === "found" ? getFoundItem : getLostItem;
    fetchItem(id)
      .then((data) => {
        if (!cancelled) setItem(data);
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id, type]);

  const listPath = isFound ? "/founditems" : "/lostitems";
  const location = item?.foundLocation || item?.lostLocation || item?.location || "";
  const date = item?.foundDate || item?.lostDate || item?.date || item?.createdAt;
  const image = getItemImageUrl(item?.images?.[0] || item?.image || "");
  const reporter = item?.reportedBy || null;
  const reporterAvatar = reporter ? getAvatarUrl(reporter) : "";

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Link
        to={listPath}
        className="inline-flex items-center gap-2 font-medium text-blue-600 hover:underline"
      >
        <ArrowLeft size={16} /> Back to {isFound ? "found" : "lost"} items
      </Link>

      {loading && <p className="mt-10 text-slate-500">Loading report…</p>}

      {error && (
        <p className="mt-10 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>
      )}

      {!loading && !error && item && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative h-64 bg-slate-100 sm:h-80">
            {image ? (
              <img
                src={image}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-300">
                <PackageSearch size={64} />
              </div>
            )}
            <span
              className={`absolute left-4 top-4 rounded-full px-3 py-1 text-sm font-semibold uppercase ${
                isFound
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              {isFound ? "found" : "lost"}
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-slate-900">{item.title}</h1>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-slate-600">
              <span className="flex items-center gap-2">
                <Tag size={16} /> {item.category || "Other"}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={16} /> {location || "—"}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={16} /> {fmtDate(date)}
              </span>
            </div>

            {item.description && (
              <p className="mt-6 leading-7 text-slate-700">{item.description}</p>
            )}

            {item.images?.length > 1 && (
              <div className="mt-6 grid grid-cols-3 gap-3">
                {item.images.slice(1).map((src, i) => (
                  <img
                    key={i}
                    src={getItemImageUrl(src)}
                    alt={`${item.title} ${i + 2}`}
                    loading="lazy"
                    className="h-28 w-full rounded-xl border border-slate-200 object-cover"
                  />
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-slate-50 p-5 sm:flex-row sm:items-center">
              {reporterAvatar ? (
                <img
                  src={reporterAvatar}
                  alt={reporter?.name || "Reporter"}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <span className="grid h-12 w-12 place-items-center rounded-full bg-blue-600 font-bold text-white">
                  {reporter?.name?.trim()?.charAt(0)?.toUpperCase() || (
                    <UserIcon size={20} />
                  )}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">
                  {reporter?.name || "Community member"}
                </p>
                <p className="truncate text-sm text-slate-500">
                  Reported this {isFound ? "found" : "lost"} item
                </p>
              </div>
              <Link
                to={isFound ? "/lost-items/report" : "/found-items/report"}
                className="shrink-0 rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
              >
                {isFound ? "I lost this item" : "I found this item"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
