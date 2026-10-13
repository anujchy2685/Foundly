// UserDashboard.jsx — layout only: top navbar + the page for the current route.
import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate, useOutlet } from "react-router-dom";
import {
   HeartHandshake, Search, PackageCheck,
  ArrowRight, Link2, ShieldCheck, MapPin, Sparkles,
} from "lucide-react";
import { getItemImageUrl } from "../utils/itemImages";
import { getLostItems, getFoundItems } from "../services/itemsService";
import AccountMenu from "../components/layout/AccountMenu";

/* ── CONFIG: same values as LostItem.jsx / FoundItem.jsx ── */
const getUserName = () => {
  try { return JSON.parse(localStorage.getItem("user"))?.name?.split(" ")[0] || "there"; }
  catch { return "there"; }
};

const normalize = (r, type) => ({
  id: r._id || r.id,
  type,
  title: r.title || r.name || r.itemName,
  category: r.category?.name || r.category || "Other",
  location: r.lostLocation || r.foundLocation || r.location || r.place || "",
  date: r.lostDate || r.foundDate || r.date || r.createdAt,
  status: (r.status || "active").toLowerCase(),
  image: getItemImageUrl(r.image || r.images?.[0] || r.photo || ""),
});

async function load(type) {
  const token = localStorage.getItem("token");
  if (!token) {
    const error = new Error("Authentication required");
    error.status = 401;
    throw error;
  }
  const list = type === "lost" ? await getLostItems() : await getFoundItems();
  return list.map((r) => normalize(r, type));
}

const same = (a, b) => a?.trim().toLowerCase() === b?.trim().toLowerCase();
const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "");

function Thumb({ item }) {
  return (
    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
      {item.image && <img src={item.image} alt="" className="h-full w-full object-cover" />}
    </div>
  );
}

/* ── Home screen: shown at /dashboard when no other page is open ── */
function DashboardHome() {
  const navigate = useNavigate();
  const [lost, setLost] = useState([]);
  const [found, setFound] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
      return () => { cancelled = true; };
    }

    Promise.allSettled([load("lost"), load("found")]).then(([l, f]) => {
      if (cancelled) return;
      if ([l, f].some((result) => result.status === "rejected" && result.reason.status === 401)) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }
      if (l.status === "fulfilled") setLost(l.value);
      if (f.status === "fulfilled") setFound(f.value);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [navigate]);

  // A lost report and a found report in the same category AND place are a likely match
  const matches = useMemo(() => {
    const out = [];
    lost.filter((l) => l.status === "active").forEach((l) => {
      const f = found.find((x) => x.status === "active" && same(x.category, l.category) && same(x.location, l.location));
      if (f) out.push({ lost: l, found: f });
    });
    return out.slice(0, 3);
  }, [lost, found]);

  const latest = useMemo(
    () => [...lost, ...found].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    [lost, found]
  );
  const reunited = [...lost, ...found].filter((i) => i.status === "claimed" || i.status === "closed").length;

  const stats = [
    { label: "Lost reports", value: lost.length, to: "/lostitems" },
    { label: "Found reports", value: found.length, to: "/founditems" },
    { label: "Reunited or closed", value: reunited },
  ];

  return (
    <main className="mx-auto max-w-380 space-y-8 px-6 py-10">
      {/* Welcome */}
      <section className="flex flex-col justify-between gap-8 rounded-3xl bg-blue-600 p-10 text-white md:flex-row md:items-center">
        <div>
          <h1 className="text-4xl font-bold">Welcome back, {getUserName()}</h1>
          <p className="mt-3 max-w-xl text-lg text-blue-100">
            Someone in your community may be looking for what you found, or holding what you lost.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/lost-items/report" className="flex items-center gap-2 rounded-xl bg-white px-6 py-4 font-semibold text-blue-700 hover:bg-blue-50">
            <Search size={20} /> I lost something
          </Link>
          <Link to="/found-items/report" className="flex items-center gap-2 rounded-xl border border-white/40 px-6 py-4 font-semibold text-white hover:bg-white/10">
            <PackageCheck size={20} /> I found something
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((s) => {
          const Card = s.to ? Link : "div";
          return (
            <Card key={s.label} to={s.to} className="rounded-2xl border border-slate-200 p-6 hover:border-blue-300">
              <p className="text-slate-500">{s.label}</p>
              <p className="mt-1 text-4xl font-bold text-slate-900">{loading ? "–" : s.value}</p>
            </Card>
          );
        })}
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Possible matches */}
        <section className="rounded-2xl border border-slate-200 p-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
            <Sparkles size={20} className="text-blue-600" /> Possible matches
          </h2>
          <p className="mt-1 text-slate-500">Lost and found reports with the same category and location.</p>

          <div className="mt-5 space-y-4">
            {matches.length === 0 && !loading && (
              <p className="rounded-xl bg-slate-50 p-5 text-slate-500">
                No matches yet. When a found report lines up with a lost one, it will show up here.
              </p>
            )}
            {matches.map(({ lost: l, found: f }) => (
              <div key={l.id + f.id} className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
                <Thumb item={l} />
                <div className="flex flex-1 items-center gap-2 text-blue-500">
                  <span className="h-px flex-1 border-t-2 border-dashed border-blue-300" />
                  <Link2 size={20} />
                  <span className="h-px flex-1 border-t-2 border-dashed border-blue-300" />
                </div>
                <Thumb item={f} />
                <div className="ml-2 hidden min-w-0 flex-1 sm:block">
                  <p className="truncate font-medium text-slate-900">{l.title}</p>
                  <p className="flex items-center gap-1 truncate text-sm text-slate-500"><MapPin size={14} /> {l.location}</p>
                </div>
                <Link to={`/founditems/${f.id}`} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                  Review
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Latest reports */}
        <section className="rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900">Latest reports</h2>
          <ul className="mt-4 divide-y divide-slate-100">
            {latest.length === 0 && !loading && <li className="py-3 text-slate-500">No reports yet. Be the first to post one.</li>}
            {latest.map((i) => (
              <li key={i.type + i.id}>
                <Link to={`/${i.type}items/${i.id}`} className="flex items-center gap-3 py-3 hover:opacity-80">
                  <Thumb item={i} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900">{i.title}</p>
                    <p className="truncate text-sm text-slate-500">{i.location} · {fmt(i.date)}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${i.type === "lost" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"}`}>
                    {i.type}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Safety */}
      <section className="flex items-start gap-4 rounded-2xl bg-slate-50 p-6">
        <ShieldCheck className="mt-0.5 shrink-0 text-blue-600" size={26} />
        <div>
          <p className="font-semibold text-slate-900">Verify before you hand over</p>
          <p className="mt-1 text-slate-600">
            Ask the claimer to describe something only the owner would know, and meet in a public place.
            Never share ID numbers or card details in chat.
          </p>
          <Link to="/#safety" className="mt-3 inline-flex items-center gap-1.5 font-medium text-blue-600 hover:underline">
            Read safety tips <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}

const links = [
  { to: "/userdashboard", label: "Home", end: true },
  { to: "/lostitems", label: "Lost items" },   // opens LostItem.jsx
  { to: "/founditems", label: "Found items" }, // opens FoundItem.jsx
  { to: "/how-it-works", label: "How it works" },
];

export default function UserDashboard() {
  const outlet = useOutlet(); // child page (report form, profile...) or null at /userdashboard

  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-20 max-w-380 flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 md:h-20 md:flex-nowrap md:px-6 md:py-0">
          <Link to="/userdashboard" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-white">
              <HeartHandshake size={24} />
            </span>
            <span className="text-xl font-bold text-slate-900">Foundly</span>
          </Link>

          <nav className="order-3 flex w-full items-center gap-1 overflow-x-auto md:order-0 md:w-auto md:gap-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-xl px-4 py-2.5 text-[15px] font-medium transition-colors ${
                    isActive ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="order-2 ml-auto flex items-center gap-2 md:order-0">
            <AccountMenu />
          </div>
        </div>
      </header>

      {/* Home screen at /dashboard, otherwise the page for the current route */}
      {outlet || <DashboardHome />}
    </div>
  );
}