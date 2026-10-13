import React from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";

const reports = [
  {
    id: 1,
    type: "Lost",
    category: "Wallets",
    title: "Brown Leather Wallet",
    location: "Durbar Marg, Kathmandu",
    date: "Sep 18, 2026",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    type: "Found",
    category: "Electronics",
    title: "Black Mobile Phone",
    location: "Ratna Park, Kathmandu",
    date: "Sep 20, 2026",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    type: "Found",
    category: "Keys",
    title: "Keys With Blue Tag",
    location: "Patan Museum, Lalitpur",
    date: "Sep 19, 2026",
    image:
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    type: "Lost",
    category: "Bags",
    title: "Navy Canvas Backpack",
    location: "Central Library, Kirtipur",
    date: "Sep 17, 2026",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
  },
];

export default function RecentReportsSection() {
  return (
    <section
      id="reports"
      className="mx-auto max-w-7xl px-6 py-20"
    >
      {/* Section Header */}
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-[#4c8863]">
            Latest Community Reports
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-[#193729] md:text-4xl">
            Recently Reported Items
          </h2>
        </div>

        <Link
          to="/lostitems"
          className="hidden items-center gap-2 text-sm font-semibold text-[#397454] transition hover:text-[#285d41] sm:flex"
        >
          View All

          <ArrowRight size={17} />
        </Link>
      </div>

      {/* Reports Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reports.map((report) => (
          <article
            key={report.id}
            className="group overflow-hidden rounded-2xl border border-[#e0e6e0] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Image */}
            <div className="relative h-52 overflow-hidden bg-[#edf1ed]">
              <img
                src={report.image}
                alt={report.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              {/* Lost / Found Badge */}
              <span
                className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${
                  report.type === "Lost"
                    ? "bg-[#fff0ed] text-[#b4503d]"
                    : "bg-[#eaf6ed] text-[#32724a]"
                }`}
              >
                {report.type}
              </span>
            </div>

            {/* Card Content */}
            <div className="p-5">
              {/* Category */}
              <p className="text-xs font-semibold uppercase tracking-wide text-[#819087]">
                {report.category}
              </p>

              {/* Title */}
              <h3 className="mt-2 text-lg font-bold text-[#1d3528]">
                {report.title}
              </h3>

              {/* Location */}
              <div className="mt-4 flex items-center gap-2 text-sm text-[#68766d]">
                <MapPin size={15} />

                <span>{report.location}</span>
              </div>

              {/* Date */}
              <div className="mt-3 text-xs text-[#8b958e]">
                {report.date}
              </div>

              {/* View Details */}
              <Link
                to={report.type === "Lost" ? "/lostitems" : "/founditems"}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#dbe3dc] py-2.5 text-sm font-semibold text-[#315d43] transition hover:bg-[#f1f6f2]"
              >
                View Details

                <ArrowRight size={15} />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Mobile View All */}
      <Link
        to="/lostitems"
        className="mx-auto mt-8 flex w-fit items-center gap-2 text-sm font-semibold text-[#397454] sm:hidden"
      >
        View All

        <ArrowRight size={17} />
      </Link>
    </section>
  );
}