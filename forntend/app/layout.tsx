import "./globals.css";
import Link from "next/link";
import Navbar from "./components/navbar";

export const metadata = {
  title: "Manish Blog",
  description: "Next.js and Django log",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800 font-sans min-h-screen">
        {/* Universal Sticky Header Navigation bar */}
        <header className="bg-[#1a1a2e] text-white sticky top-0 z-50 shadow-md">
          <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-[#00adb5] text-2xl font-bold tracking-wide hover:opacity-80 transition-opacity">
              Manish Blog
            </Link>
            
            {/* Embedded client component logic */}
            <Navbar />
            
          </div>
        </header>

        {/* View Component Slot Execution Node */}
        {children}
      </body>
    </html>
  );
}