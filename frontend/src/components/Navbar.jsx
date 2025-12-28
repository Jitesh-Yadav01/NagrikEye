import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../firebase/auth";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="bg-black border-b border-zinc-800 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="text-lg font-bold">
            MyApp
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="hover:text-zinc-300">
              Dashboard
            </Link>
            <Link to="/profile" className="hover:text-zinc-300">
              Profile
            </Link>
            {user && (
              <button
                onClick={logout}
                className="rounded bg-red-500 px-3 py-1 text-sm"
              >
                Logout
              </button>
            )}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1"
          >
            <span className="h-0.5 w-6 bg-white"></span>
            <span className="h-0.5 w-6 bg-white"></span>
            <span className="h-0.5 w-6 bg-white"></span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-zinc-800 bg-black px-4 py-3 space-y-3">
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className="block"
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="block"
          >
            Profile
          </Link>

          {user && (
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="block w-full rounded bg-red-500 px-3 py-2 text-left"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
