import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShieldCheck, ArrowRight } from "lucide-react";

export default function HeroSection() {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const query = e.currentTarget.search.value.trim();

    if (!query) return;

    navigate(`/lostitems?search=${encodeURIComponent(query)}`);
  };

  return (
    <section className="relative overflow-hidden bg-[#f7f8f5]">

      {/* Background Decorations */}
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#dcebdd] blur-3xl" />

      <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#e5eee4] blur-3xl" />

      {/* Hero Content */}
      <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-24 text-center md:pt-32">

        {/* Badge */}
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[#d8e3da] bg-white px-4 py-2 text-sm font-medium text-[#3e5f4a] shadow-sm">

          <ShieldCheck size={16} />

          <span>A safer way to reconnect</span>

        </div>


        {/* Heading */}
        <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight text-[#163526] md:text-7xl">

          Lost something?

          <br />

          <span className="text-[#3b805d]">
            Let&apos;s help you find it.
          </span>

        </h1>


        {/* Description */}
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#647269]">

          Search community reports, share what you lost or found,
          and verify a safe return — all in one trusted place.

        </p>


        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 rounded-2xl border border-[#dfe6df] bg-white p-2 shadow-[0_15px_45px_rgba(32,65,44,0.08)] sm:flex-row"
        >

          {/* Input */}
          <div className="flex flex-1 items-center gap-3 px-4">

            <Search
              size={21}
              className="shrink-0 text-[#718076]"
            />

            <input
              type="text"
              name="search"
              placeholder="Search for an item..."
              className="w-full bg-transparent py-3 text-base outline-none placeholder:text-[#9aa59d]"
            />

          </div>


          {/* Search Button */}
          <button
            type="submit"
            className="rounded-xl bg-[#285d41] px-8 py-3.5 font-semibold text-white transition hover:bg-[#1f4c34]"
          >
            Search
          </button>

        </form>


        {/* Action Buttons */}
        <div
          id="report"
          className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"
        >

          {/* Lost Item */}
          <Link
            to="/lost-items/report"
            className="group inline-flex items-center justify-center gap-2 rounded-xl border border-[#b8cbbd] bg-white px-6 py-3.5 font-semibold text-[#285d41] transition hover:border-[#285d41] hover:bg-[#f0f6f1]"
          >

            Report Lost Item

            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />

          </Link>


          {/* Found Item */}
          <Link
            to="/found-items/report"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#285d41] px-6 py-3.5 font-semibold text-white transition hover:bg-[#1f4c34]"
          >

            Report Found Item

            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />

          </Link>

        </div>

      </div>
    </section>
  );
}