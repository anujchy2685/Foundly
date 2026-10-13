import React from "react";
import { Link } from "react-router-dom";
import { HeartHandshake, ArrowRight } from "lucide-react";

export default function SafetyCTA() {
  return (
    <section
      id="safety"
      className="mx-auto max-w-5xl px-6 py-20"
    >
      <div className="relative overflow-hidden rounded-3xl bg-[#173d2b] px-7 py-14 text-center text-white md:px-16 md:py-16">

        {/* Background Decoration */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#3e7958] opacity-30 blur-3xl" />

        <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#2f6849] opacity-20 blur-3xl" />

        {/* Content */}
        <div className="relative">

          {/* Icon */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <HeartHandshake size={28} />
          </div>

          {/* Heading */}
          <h2 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">
            Helping belongings find their way home.
          </h2>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#c9d9cf]">
            Foundly makes it easier to reconnect people with
            the things that matter, while keeping the return
            process safe and private.
          </p>

          {/* CTA Button */}
          <Link
            to="/signup"
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-[#214e36] transition hover:bg-[#edf5ef]"
          >
            Get Started

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