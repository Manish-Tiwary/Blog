"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authenticatedFetch } from "../utils/auth";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://127.0.0")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching articles:", err));
  }, [router]);

  const handleDeletePost = async (id) => {
    if (!confirm("Are you completely sure you want to delete this article? This step cannot be undone.")) return;

    try {
      const res = await authenticatedFetch(`http://127.0.0delete/${id}/`, {
        method: "DELETE", // Uses our custom authenticated view routing pathway
      });

      if (res.ok) {
        // Filter deleted item out of frontend active component state arrays
        setPosts(posts.filter((post) => post.id !== id));
      } else {
        alert("Failed to delete post. Check permissions verification parameters.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center py-24 font-semibold text-slate-500">Verifying session data...</p>;

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Management Dashboard</h1>
        <button 
          onClick={() => router.push("/dashboard/form")} 
          className="bg-[#00adb5] hover:bg-cyan-500 text-white font-bold py-2.5 px-5 rounded-md transition-all shadow-sm"
        >
          + Write New Article
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
              <th className="p-4">Title</th>
              <th className="p-4">Author</th>
              <th className="p-4">Published</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-bold text-slate-800">{post.title}</td>
                <td className="p-4 text-slate-500">{post.author}</td>
                <td className="p-4 text-slate-500">{post.created_on}</td>
                <td className="p-4 text-center space-x-4 font-semibold">
                  <button 
                    onClick={() => router.push(`/dashboard/form?edit=${post.id}`)}
                    className="text-cyan-600 hover:text-cyan-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeletePost(post.id)}
                    className="text-red-500 hover:text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && (
          <p className="text-center text-slate-400 py-12">No database entries currently found.</p>
        )}
      </div>
    </main>
  );
}
