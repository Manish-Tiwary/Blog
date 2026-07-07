import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";

// 1. Data Fetcher leveraging your explicit Django API path layout
async function getSinglePost(slug: string) {
  const res = await fetch(`http://127.0.0.1:8000/api/posts/${slug}/`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

// 2. Main Page Render Component
export default async function PostDetail({ params }: { params: Promise<{ slug: string }> }) {
  // Await the dynamic parameters array from Next.js
  const resolvedParams = await params;
  const post = await getSinglePost(resolvedParams.slug);

  if (!post) {
    return (
      <main className="text-center py-24">
        <h1 className="text-2xl font-bold text-slate-800">404 - Article Not Found</h1>
        <Link href="/" className="text-[#00adb5] mt-4 inline-block font-semibold hover:underline">&larr; Back to home</Link>
      </main>
    );
  }

  // The editor stores rich HTML (headings, bold, inline images, links). Sanitize
  // before injecting it, since this is user-authored content rendered as raw markup.
  const safeContent = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "s", "u",
      "h1", "h2", "h3", "h4",
      "ul", "ol", "li",
      "blockquote", "a", "img", "code", "pre", "hr",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "class", "target", "rel"],
  });

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <article className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
        {post.featured_image && (
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full max-h-[450px] object-cover"
          />
        )}

        <div className="p-8">
          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight mb-4">{post.title}</h1>
          <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8 pb-4 border-b border-slate-100">
            Published: {post.created_on} by <span className="text-slate-600">{post.author}</span>
          </div>

          {/*
            Tailwind Typography's `prose` class styles raw HTML (headings, lists,
            links, images, blockquotes) into readable article formatting.
            Requires @tailwindcss/typography — see setup notes below.
          */}
          <div
            className="prose prose-slate prose-lg max-w-none prose-img:rounded-lg prose-a:text-[#00adb5] prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />
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