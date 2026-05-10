import BlogEditor from "@/components/admin/BlogEditor";

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">เขียนบทความใหม่</h1>
      <BlogEditor />
    </div>
  );
}
