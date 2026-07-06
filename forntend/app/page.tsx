import Link from "next/link";

async function getBlogPosts() {
  const res = await fetch("http://127.0.0", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to pull backend post parameters");
  return res.json();
}

export default async function Home() {
  const posts = await getBlogPosts();

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-8 tracking-tight">Latest Articles</h1>
      
      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            {post.featured_image && (
              <img 
                src={post.featured_image} 
                alt={post.title} 
                className="w-full h-64 object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-2xl font-bold text-slate-800 hover:text-[#00adb5] transition-colors mb-2">
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </h2>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              By {post.author} | {post.created_on}
            </div>
          </article>
        ))}

        {posts.length === 0 && (
          <p className="text-center text-slate-500 py-12">No posts published yet!</p>
        )}
      </div>
    </main>
  );
}
