import Link from "next/link";

async function getSinglePost(slug) {
  const res = await fetch(`http://127.0.0{slug}/`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function PostDetail({ params }) {
  const { slug } = params;
  const post = await getSinglePost(slug);

  if (!post) {
    return (
      <main className="text-center py-24">
        <h1 className="text-2xl font-bold text-slate-800">404 - Article Not Found</h1>
        <Link href="/" className="text-[#00adb5] mt-4 inline-block font-semibold hover:underline">&larr; Back to home</Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <article className="bg-white p-8 rounded-lg shadow-sm border border-slate-100">
        <h1 className="text-4xl font-extrabold text-slate-900 leading-tight mb-4">{post.title}</h1>
        <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6 pb-4 border-b border-slate-100">
          Published: {post.created_on} by <span className="text-slate-600">{post.author}</span>
        </div>

        {post.featured_image && (
          <img 
            src={post.featured_image} 
            alt={post.title} 
            className="w-full max-h-[450px] object-cover rounded-lg mb-6"
          />
        )}

        {/* Text Area Parser Layout Wrapper block node */}
        <div className="prose max-w-none text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </article>

      <div className="mt-8">
        <Link href="/" className="text-[#00adb5] font-bold inline-flex items-center hover:translate-x-[-4px] transition-transform">
          &larr; Back to Home Feed
        </Link>
      </div>
    </main>
  );
}
