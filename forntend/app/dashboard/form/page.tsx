"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authenticatedFetch } from "../../utils/auth";

function FormContent() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit"); // Checks for an '?edit=ID' query suffix

  useEffect(() => {
    // If editId parameter exists, pre-populate state metrics from backend data cache
    if (editId) {
      fetch("http://127.0.0")
        .then((res) => res.json())
        .then((data) => {
          const post = data.find((p) => p.id === parseInt(editId));
          if (post) {
            setTitle(post.title);
            setSlug(post.slug);
            setContent(post.content);
          }
        });
    }
  }, [editId]);

  // Handle live automated slug generations as titles are written out
  const handleTitleChange = (e) => {
    const rawTitle = e.target.value;
    setTitle(rawTitle);
    if (!editId) {
      setSlug(rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Use Multipart FormData to send physical file streams across endpoints safely
    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("content", content);
    if (image) {
      formData.append("featured_image", image);
    }

    const endpoint = editId
      ? `http://127.0.0edit/${editId}/`
      : "http://127.0.0create/";

    try {
      const res = await authenticatedFetch(endpoint, {
        method: "POST",
        body: formData, // Browser assigns multipart header settings automatically
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert("Action processing error. Please verify authorization payload fields.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">
          {editId ? "✏️ Edit Article Layout" : "✍️ Write New Article"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Article Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              className="w-full p-3 border border-slate-200 rounded-md focus:outline-none focus:border-[#00adb5]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">URL Slug Path</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-md bg-slate-50 text-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Featured Cover Image Banner</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Article Body Text Content</label>
            <textarea
              required
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Supports structural text formatting paragraphs and Markdown strings..."
              className="w-full p-3 border border-slate-200 rounded-md focus:outline-none focus:border-[#00adb5] font-sans"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#00adb5] hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving Content..." : "Publish Post Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

// Next.js App Router requires Suspense for components using useSearchParams at compile time
export default function ArticleForm() {
  return (
    <Suspense fallback={<p className="text-center py-12">Loading form modules...</p>}>
      <FormContent />
    </Suspense>
  );
}
