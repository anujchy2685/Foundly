import React from "react";

const steps = [
  {
    number: "01",
    title: "Report the Item",
    description:
      "Share clear details about what you lost or found while keeping sensitive information private.",
  },
  {
    number: "02",
    title: "Discover a Match",
    description:
      "Search community reports and find potentially matching lost or found items.",
  },
  {
    number: "03",
    title: "Verify and Return",
    description:
      "Confirm ownership privately and safely arrange the return of the item.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="border-y border-[#dfe7df] bg-[#eef4ef]"
    >
      <div className="mx-auto max-w-7xl px-6 py-20">

        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-[#4c8863]">
            Simple and Secure
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-[#193729] md:text-4xl">
            How It Works
          </h2>

          <p className="mt-4 text-base leading-7 text-[#69776e]">
            Foundly makes the process of finding and returning
            lost belongings simple, transparent, and safe.
          </p>

        </div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-3">

          {steps.map((step) => (
            <div
              key={step.number}
              className="group rounded-2xl border border-[#dce5dd] bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >

              {/* Step Number */}
              <div className="flex items-center justify-between">

                <span className="text-sm font-bold tracking-wider text-[#6a9678]">
                  STEP {step.number}
                </span>

                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef6ef] text-sm font-bold text-[#397454] transition group-hover:bg-[#285d41] group-hover:text-white">
                  {step.number}
                </span>

              </div>

              {/* Title */}
              <h3 className="mt-7 text-xl font-bold text-[#1c3829]">
                {step.title}
              </h3>

              {/* Description */}
              <p className="mt-3 leading-7 text-[#69776e]">
                {step.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}