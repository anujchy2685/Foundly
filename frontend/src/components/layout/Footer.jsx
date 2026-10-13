import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-[#dfe5df] bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">

        {/* Brand */}
        <div>
          <Link
            to="/"
            className="text-lg font-bold text-[#173d2b]"
          >
            Foundly
          </Link>

          <p className="mt-1 text-sm text-[#778279]">
            Helping belongings find their way home.
          </p>
        </div>

      

        {/* Copyright */}
        <p className="text-sm text-[#8a938c]">
          © {new Date().getFullYear()} Foundly
        </p>

      </div>
    </footer>
  );
}