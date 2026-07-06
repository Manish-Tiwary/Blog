import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Manish Blog",
  description: "Next.js & Headless Django Platform",
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
            <nav>
              <ul className="flex items-center gap-6 font-medium">
                <li><Link href="/" className="hover:text-[#00adb5] transition-colors">Home</Link></li>
                <li>
                  <a href="http://localhost:8000/admin/" target="_blank" rel="noreferrer" className="bg-[#00adb5] hover:bg-cyan-400 text-white font-bold py-2 px-4 rounded transition-all">
                    Admin Portal
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* View Component Slot Execution Node */}
        {children}
      </body>
    </html>
  );
}
