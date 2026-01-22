import { ProductCard } from "@/components/product-card";
import { bestSellers } from "@/lib/mock-data";

export default function ShopPage() {
  return (
    <div className="section">
      <div className="container">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-brand-900">Shop Pillaa</h1>
            <p className="mt-2 text-sm text-brand-600">
              Filter the best black leather office shoes with cushioning, grip, and premium finish.
            </p>
          </div>
          <div className="flex gap-3">
            <select className="rounded-full border border-brand-200 px-4 py-2 text-sm">
              <option>Sort: Best Selling</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
              <option>Rating</option>
            </select>
          </div>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-[260px_1fr]">
          <aside className="space-y-6 rounded-2xl border border-brand-100 bg-brand-50 p-5 text-sm text-brand-700">
            <div>
              <h2 className="font-semibold text-brand-900">Filters</h2>
              <p className="mt-1 text-xs text-brand-500">Use filters to narrow by size, price, and use-case.</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase text-brand-500">Price</h3>
              <div className="mt-2 space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> ₹1500 - ₹2500
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> ₹2500 - ₹3500
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> ₹3500+
                </label>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase text-brand-500">Size</h3>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {[
                  "6",
                  "7",
                  "8",
                  "9",
                  "10",
                  "11",
                  "12",
                  "13",
                ].map((size) => (
                  <button key={size} className="rounded-lg border border-brand-200 px-2 py-1">
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase text-brand-500">Use-case</h3>
              <div className="mt-2 space-y-2">
                {[
                  "Office",
                  "Security",
                  "Hospitality",
                  "Travel",
                ].map((use) => (
                  <label key={use} className="flex items-center gap-2">
                    <input type="checkbox" /> {use}
                  </label>
                ))}
              </div>
            </div>
          </aside>
          <div>
            <div className="grid gap-6 md:grid-cols-3">
              {bestSellers.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
            <div className="mt-10 flex justify-center gap-2">
              {[
                1,
                2,
                3,
              ].map((page) => (
                <button key={page} className="h-9 w-9 rounded-full border border-brand-200 text-sm">
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
