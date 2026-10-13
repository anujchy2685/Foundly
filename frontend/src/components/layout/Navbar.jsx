/** @format */

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { onStoredUserChange } from "../../utils/user";
import AccountMenu from "./AccountMenu";

export default function Navbar() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    Boolean(localStorage.getItem("token"))
  );

  // Refresh on navigation (login/logout redirect) and on profile updates
  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("token")));
  }, [location.pathname]);
  useEffect(
    () =>
      onStoredUserChange(() =>
        setIsLoggedIn(Boolean(localStorage.getItem("token")))
      ),
    []
  );

  return (
    <header className="sticky top-0 z-40 border-b border-[#e2e7e2] bg-[#f7f8f5]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-[#173d2b]"
        >
          Foundly
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/lostitems"
            className="text-sm font-medium text-[#526157] transition hover:text-[#285d41]"
          >
            Browse Reports
          </Link>

          <a
            href="/#how-it-works"
            className="text-sm font-medium text-[#526157] transition hover:text-[#285d41]"
          >
            How It Works
          </a>

          <a
            href="/#safety"
            className="text-sm font-medium text-[#526157] transition hover:text-[#285d41]"
          >
            Safety
          </a>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <AccountMenu />
          ) : (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-[#285d41] transition hover:bg-[#eaf2eb] sm:block"
              >
                Log In
              </Link>

              {/* Sign Up */}
              <Link
                to="/signup"
                className="rounded-xl border border-[#285d41] px-4 py-2.5 text-sm font-semibold text-[#285d41] transition hover:bg-[#edf5ef]"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Report */}
          <Link
            to="/lost-items/report"
            className="hidden rounded-xl bg-[#173d2b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#24583e] lg:block"
          >
            Report an Item
          </Link>
        </div>
      </div>
    </header>
  );
}
