"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://127.0.0", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid username or password configuration.");
      }

      const data = await res.json();
      
      // Save your authorization token keys securely in the browser workspace
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("username", username);

      // Forward user over into their management panel dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="max-w-md mx-auto mt-20 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md border border-slate-100">
        <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-6">Admin Sign In</h2>
        
        {error && (
          <p className="bg-red-50 text-red-500 text-sm p-3 rounded mb-4 text-center font-medium">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Username</label>
            <input 
              type="text" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded focus:outline-none focus:border-[#00adb5]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded focus:outline-none focus:border-[#00adb5]"
            />
          </div>

          <button type="submit" className="w-full bg-[#00adb5] hover:bg-cyan-500 text-white font-bold py-2.5 rounded transition-all mt-4">
            Login to Dashboard
          </button>
        </form>
      </div>
    </main>
  );
}
