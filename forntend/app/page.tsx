import Link from "next/link";

async function getBlogPosts() {
  const res = await fetch("http://127.0.0.1:8000/api/posts/", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to pull backend post parameters");
  return res.json();
}

// Strips HTML tags from rich-text content and trims it down to a short excerpt
function makeExcerpt(html: string, maxLength = 140) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

// Deterministic accent color per author so avatars stay visually distinct but stable
const AVATAR_COLORS = ["#00adb5", "#6366f1", "#f97316", "#ec4899", "#22c55e", "#eab308"];
function avatarColor(name: string) {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function AuthorBadge({ author, date }: { author: string; date: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
        style={{ backgroundColor: avatarColor(author) }}
      >
        {author.charAt(0).toUpperCase()}
      </div>
      <div className="leading-tight">
        <p className="text-xs font-semibold text-slate-700">{author}</p>
        <p className="text-[11px] text-slate-400">Updated on: {date}</p>
      </div>
    </div>
  );
}

export default async function Home() {
  const posts = await getBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6 tracking-tight">Recent Post</h1>
      <div className="h-px bg-slate-200 mb-10" />

      {posts.length === 0 && (
        <p className="text-center text-slate-500 py-24">No posts published yet!</p>
      )}

      {/* Featured story — largest and most recent post, image left / text right */}
      {featured && (
        <Link href={`/posts/${featured.slug}`} className="group grid md:grid-cols-2 gap-8 mb-14">
          <div className="rounded-lg overflow-hidden bg-slate-100 aspect-[4/3]">
            {featured.featured_image ? (
              <img
                src={featured.featured_image}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 font-semibold">
                No image
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              {featured.created_on}
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 leading-snug mb-4 group-hover:text-[#00adb5] transition-colors">
              {featured.title}
            </h2>
            <p className="text-slate-500 leading-relaxed mb-6">
              {makeExcerpt(featured.content, 220)}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-900 group-hover:text-[#00adb5] transition-colors">
              Read Article
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </Link>
      )}

      {/* Remaining posts as a card grid */}
      {rest.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="group bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >
              <div className="aspect-[16/10] bg-slate-100">
                {post.featured_image ? (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm font-semibold">
                    No image
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col gap-3 flex-1">
                <h3 className="text-lg font-bold text-slate-800 leading-snug group-hover:text-[#00adb5] transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">
                  {makeExcerpt(post.content, 100)}
                </p>
                <AuthorBadge author={post.author} date={post.created_on} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}