import Link from "next/link";

export default function BlogIndexPage() {
  return (
    <div className="section">
      <div className="container max-w-3xl">
        <h1 className="text-3xl font-semibold text-brand-900">Pillaa Journal</h1>
        <p className="mt-2 text-sm text-brand-600">
          Insights on workplace comfort, shoe care, and professional style.
        </p>
        <div className="mt-6 space-y-4">
          {[
            {
              title: "How to choose office shoes for 10-hour shifts",
              excerpt: "Key factors: cushioning, grip, and breathability.",
            },
            {
              title: "Leather shoe care tips for Indian weather",
              excerpt: "Keep your shoes shining in humid climates.",
            },
          ].map((post) => (
            <div key={post.title} className="rounded-2xl border border-brand-100 p-5">
              <h2 className="text-lg font-semibold text-brand-900">{post.title}</h2>
              <p className="mt-2 text-sm text-brand-600">{post.excerpt}</p>
              <Link href="/blog" className="mt-2 inline-flex text-sm text-brand-700 underline">
                Read more
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
