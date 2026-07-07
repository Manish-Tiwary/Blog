"use client"; // This marks it as a Client Component

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {

    const token = localStorage.getItem("token"); 
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {

    localStorage.removeItem("token");
    setIsLoggedIn(false);

    window.location.href = "/";
  };

  return (
    <nav>
      <ul className="flex items-center gap-6 font-medium">
        <li>
          <Link href="/" className="hover:text-[#00adb5] transition-colors">
            Home
          </Link>
        </li>
        <li>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-all"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-[#00adb5] hover:bg-cyan-400 text-white font-bold py-2 px-4 rounded transition-all"
            >
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}