// LostItem.jsx — lost items page (self-contained). Opens from the navbar "Lost items" link.
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, MapPin, Calendar, ArrowRight, Filter, PackageSearch } from "lucide-react";
import { getItemImageUrl } from "../utils/itemImages";
import { getLostItems } from "../services/itemsService";
import Pagination, { PAGE_SIZE } from "../components/common/Pagination";

// Map one backend record to what the card needs (change field names here only)
const normalize = (r) => ({
  id: r._id || r.id,
  title: r.title || r.name || r.itemName,
  category: r.category?.name || r.category || "Other",
  location: r.lostLocation || r.location || r.place || "",
  date: r.lostDate || r.date || r.createdAt,
  status: (r.status || "active").toLowerCase(), // active | claimed | closed
  image: getItemImageUrl(r.image || r.images?.[0] || r.photo || ""),
});

const STATUS = {
  active: { label: "Active", cls: "bg-blue-50 text-blue-700 border-blue-100", dot: "bg-blue-600" },
  claimed: { label: "Claimed", cls: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  closed: { label: "Closed", cls: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400" },
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

function ItemCard({ item }) {
  const s = STATUS[item.status] || STATUS.active;
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-48 bg-slate-100">
        {item.image ? (
          <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <PackageSearch size={48} />
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold uppercase text-blue-700">
          lost
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-slate-500">{item.category}</p>
            <h3 className="mt-1 truncate text-lg font-semibold text-slate-900" title={item.title}>{item.title}</h3>
          </div>
          <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${s.cls}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>
        </div>
        <ul className="mt-4 space-y-2.5 text-slate-500">
          <li className="flex items-center gap-2.5"><MapPin size={18} className="shrink-0" /> <span className="truncate">{item.location || "—"}</span></li>
          <li className="flex items-center gap-2.5"><Calendar size={18} className="shrink-0" /> {fmtDate(item.date)}</li>
        </ul>
        <Link
          to={`/lostitems/${item.id}`}
          className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-medium text-slate-900 transition hover:bg-slate-50"
        >
          View details <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  );
}

export default function LostItem() {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState(() => searchParams.get("search") || "");
  const [category, setCategory] = useState(() => searchParams.get("category") || "");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const listTopRef = useRef(null);

  useEffect(() => {
    setQ(searchParams.get("search") || "");
    setCategory(searchParams.get("category") || "");
    setPage(1);
  }, [searchParams]);

  const updateFilter = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  useEffect(() => {
    let cancelled = false;
    getLostItems()
      .then((list) => {
        if (!cancelled) setItems(list.map(normalize));
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const categories = useMemo(() => [...new Set(items.map((i) => i.category))], [items]);
  const locations = useMemo(() => [...new Set(items.map((i) => i.location).filter(Boolean))], [items]);

  const visible = useMemo(
    () =>
      items
        .filter((i) => !q || i.title?.toLowerCase().includes(q.toLowerCase()))
        .filter((i) => !category || i.category === category)
        .filter((i) => !location || i.location === location)
        .filter((i) => !status || i.status === status)
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [items, q, category, location, status]
  );

  const pages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const paged = visible.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const from = visible.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const to = Math.min(safePage * PAGE_SIZE, visible.length);

  const handlePageChange = (next) => {
    setPage(next);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const select = "h-14 rounded-xl border border-slate-200 bg-white px-4 text-slate-700 outline-none focus:border-blue-500";

  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-380 flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:py-12">
          <div>
            <p className="text-sm font-semibold tracking-widest text-slate-600">COMMUNITY REPORTS</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-900 md:text-5xl">Lost Items</h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">Browse items people are trying to recover. A matching report could help reunite someone with their belongings.</p>
          </div>
          <Link to="/lost-items/report" className="shrink-0 rounded-xl bg-blue-600 px-6 py-4 text-center font-semibold text-white hover:bg-blue-700">
            Report lost item
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-380 px-6 py-10">
        <div className="grid gap-4 rounded-2xl border border-slate-200 p-5 sm:grid-cols-2 xl:grid-cols-[1fr_220px_220px_220px]">
          <label className="flex h-14 items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-blue-500 sm:col-span-2 xl:col-span-1">
            <Search size={20} className="shrink-0 text-slate-500" />
            <input value={q} onChange={updateFilter(setQ)} placeholder="Search lost items" className="w-full bg-transparent outline-none" />
          </label>
          <select className={select} value={category} onChange={updateFilter(setCategory)}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className={select} value={location} onChange={updateFilter(setLocation)}>
            <option value="">All locations</option>
            {locations.map((l) => <option key={l}>{l}</option>)}
          </select>
          <select className={select} value={status} onChange={updateFilter(setStatus)}>
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="claimed">Claimed</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div ref={listTopRef} className="mt-8 flex scroll-mt-24 flex-wrap items-center justify-between gap-2 text-slate-500">
          <p>
            {visible.length === 0 ? (
              <>No reports found</>
            ) : (
              <>Showing <b className="text-slate-900">{from}–{to}</b> of <b className="text-slate-900">{visible.length}</b> reports</>
            )}
          </p>
          <span className="flex items-center gap-2"><Filter size={18} /> Newest first</span>
        </div>

        {loading && <p className="mt-10 text-slate-500">Loading reports…</p>}
        {error && (
          <p className="mt-10 rounded-xl bg-red-50 p-4 text-red-700">
            Couldn't load reports: {error}. Check that the backend is running and API_URL is correct.
          </p>
        )}
        {!loading && !error && visible.length === 0 && (
          <p className="mt-10 text-slate-500">No reports match your filters. Try clearing a filter.</p>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {paged.map((item) => <ItemCard key={item.id} item={item} />)}
        </div>

        <Pagination page={safePage} pages={pages} onChange={handlePageChange} />
      </div>
    </main>
  );
}
