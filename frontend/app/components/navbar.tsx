"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname(); 

  useEffect(() => {
   
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, [pathname]); 

  const handleLogout = () => {
  
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    
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
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-all cursor-pointer"
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