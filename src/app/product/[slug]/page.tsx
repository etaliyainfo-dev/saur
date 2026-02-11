import Link from "next/link";

const sizes = ["6", "7", "8", "9", "10", "11", "12"];

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = {
    title: "Pillaa Elite Black Leather",
    price: 2799,
    compareAtPrice: 3499,
    stock: 24,
    rating: 4.7,
    reviews: 128,
    highlights: ["Cushioned sole", "Anti-slip grip", "Genuine leather", "10+ hour comfort"],
  };

  return (
    <div className="section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            image: [
              "https://res.cloudinary.com/demo/image/upload/v1699999999/pillaa/elite-black.jpg",
            ],
            description:
              "Premium black leather office shoes with cushioned sole, anti-slip grip, and 10+ hour comfort.",
            sku: "PIL-ELITE-01",
            brand: { "@type": "Brand", name: "Pillaa" },
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: product.price,
              availability: "https://schema.org/InStock",
              url: `https://pillaa.com/product/${params.slug}`,
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.reviews,
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pillaa.com" },
              { "@type": "ListItem", position: 2, name: "Shop", item: "https://pillaa.com/shop" },
              {
                "@type": "ListItem",
                position: 3,
                name: product.title,
                item: `https://pillaa.com/product/${params.slug}`,
              },
            ],
          }),
        }}
      />
      <div className="container">
        <div className="mb-6 text-sm text-brand-500">
          <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / {product.title}
        </div>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-brand-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://res.cloudinary.com/demo/image/upload/v1699999999/pillaa/elite-black.jpg"
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                "hero",
                "detail-1",
                "detail-2",
              ].map((img) => (
                <div key={img} className="aspect-square rounded-2xl bg-brand-50"></div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold text-brand-900">{product.title}</h1>
              <p className="mt-2 text-sm text-brand-600">
                Formal black leather shoes designed for long shifts and professional look.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-2xl font-semibold text-brand-900">₹{product.price}</span>
                <span className="text-sm text-brand-400 line-through">₹{product.compareAtPrice}</span>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">20% off</span>
              </div>
              <div className="mt-2 text-sm text-brand-600">
                ⭐ {product.rating} ({product.reviews} reviews)
              </div>
              <div className="mt-2 text-xs text-brand-500">In stock: {product.stock} pairs</div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-brand-900">Select size</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button key={size} className="rounded-lg border border-brand-200 px-3 py-2 text-sm">
                    {size}
                  </button>
                ))}
                <Link href="/size-guide" className="text-xs text-brand-600 underline">
                  Size guide
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4">
              <h2 className="text-sm font-semibold text-brand-900">Check delivery</h2>
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter pincode"
                  className="w-full rounded-xl border border-brand-200 px-4 py-2 text-sm"
                />
                <button className="rounded-xl bg-brand-900 px-4 py-2 text-sm text-white">Check</button>
              </div>
              <p className="mt-2 text-xs text-brand-500">COD available for serviceable pincodes.</p>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-brand-900">Highlights</h2>
              <ul className="mt-3 grid gap-2 text-sm text-brand-700">
                {product.highlights.map((highlight) => (
                  <li key={highlight}>✔ {highlight}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-brand-100 p-4">
              <h2 className="text-sm font-semibold text-brand-900">Product specs</h2>
              <table className="mt-3 w-full text-sm text-brand-700">
                <tbody>
                  <tr className="border-b border-brand-100">
                    <td className="py-2">Material</td>
                    <td className="py-2 font-semibold text-brand-900">Genuine leather</td>
                  </tr>
                  <tr className="border-b border-brand-100">
                    <td className="py-2">Sole type</td>
                    <td className="py-2 font-semibold text-brand-900">Anti-slip rubber</td>
                  </tr>
                  <tr>
                    <td className="py-2">Use-case</td>
                    <td className="py-2 font-semibold text-brand-900">Office, security, hospitality</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex gap-3">
              <button className="w-full rounded-full bg-brand-900 px-5 py-3 text-sm font-semibold text-white">
                Add to Cart
              </button>
              <button className="rounded-full border border-brand-200 px-5 py-3 text-sm font-semibold text-brand-700">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-xl font-semibold text-brand-900">Reviews</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              {
                name: "Ravi S.",
                review: "Excellent grip and comfort. Wore these for a 10-hour shift without pain.",
              },
              {
                name: "Deepa M.",
                review: "Looks premium and feels soft. Great for hospitality uniforms.",
              },
            ].map((item) => (
              <div key={item.name} className="rounded-2xl border border-brand-100 p-5">
                <div className="text-sm font-semibold text-brand-900">{item.name}</div>
                <p className="mt-2 text-sm text-brand-600">{item.review}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-brand-900">Related products</h2>
            <Link href="/shop" className="text-sm text-brand-600">
              View all
            </Link>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="rounded-2xl border border-brand-100 p-4">
                <div className="aspect-[4/3] rounded-xl bg-brand-50"></div>
                <div className="mt-3 text-sm font-semibold text-brand-900">Pillaa Comfort {item}</div>
                <div className="mt-1 text-xs text-brand-500">₹2,499</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-brand-100 bg-white p-3 md:hidden">
        <div className="container flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-brand-900">₹{product.price}</div>
            <div className="text-xs text-brand-500">In stock</div>
          </div>
          <button className="rounded-full bg-brand-900 px-6 py-2 text-sm font-semibold text-white">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
