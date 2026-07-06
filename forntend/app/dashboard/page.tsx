"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login"); // Route guest users back to login
      return;
    }

    fetch("http://127.0.0")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, [router]);

  const handleDelete = async (id) => {
    if (!confirm("Are you absolutely sure you want to delete this post?")) return;

    // In a real environment, you would send a DELETE request to Django using your auth token
    alert("Post deletion workflow initialized for ID: " + id);
    setPosts(posts.filter(post => post.id !== id));
  };

  if (loading) return <p className="text-center py-24 font-semibold text-slate-500">Verifying session data...</p>;

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Management Dashboard</h1>
        <button className="bg-[#00adb5] hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded transition-all">
          + Write New Article
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white text-sm uppercase">
              <th className="p-4">Title</th>
              <th className="p-4">Author</th>
              <th className="p-4">Published</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-bold text-slate-800">{post.title}</td>
                <td className="p-4 text-slate-500">{post.author}</td>
                <td className="p-4 text-slate-500">{post.created_on}</td>
                <td className="p-4 text-center space-x-4">
                  <button className="text-cyan-600 font-bold hover:underline">Edit</button>
                  <button onClick={() => handleDelete(post.id)} className="text-red-500 font-bold hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
