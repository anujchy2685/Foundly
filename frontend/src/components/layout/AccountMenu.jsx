// AccountMenu.jsx — avatar dropdown shared by the public navbar and the dashboard.
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User as UserIcon, ChevronDown, LayoutDashboard } from "lucide-react";
import {
  getStoredUser,
  onStoredUserChange,
  getAvatarUrl,
  getInitial,
} from "../../utils/user";
import { logout as logoutRequest } from "../../services/authServices";

export default function AccountMenu() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getStoredUser());
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => onStoredUserChange(() => setUser(getStoredUser())), []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  const logout = () => {
    logoutRequest();
    setMenuOpen(false);
    navigate("/login");
  };

  const avatar = getAvatarUrl(user);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        className="flex items-center gap-1 rounded-xl p-1 transition hover:bg-black/5"
      >
        {avatar ? (
          <img
            src={avatar}
            alt={user?.name || "Profile"}
            className="h-10 w-10 rounded-full border border-slate-200 object-cover"
          />
        ) : (
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#285d41] font-bold text-white">
            {user ? getInitial(user) : <UserIcon size={20} />}
          </span>
        )}
        <ChevronDown size={16} className="text-slate-500" />
      </button>

      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg"
        >
          <div className="border-b border-slate-100 px-4 py-2.5">
            <p className="truncate text-sm font-semibold text-slate-900">
              {user?.name || "Account"}
            </p>
            <p className="truncate text-xs text-slate-500">{user?.email || ""}</p>
          </div>
          <Link
            to="/userdashboard"
            onClick={() => setMenuOpen(false)}
            role="menuitem"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            role="menuitem"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <UserIcon size={16} /> Profile
          </Link>
          <button
            onClick={logout}
            role="menuitem"
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
