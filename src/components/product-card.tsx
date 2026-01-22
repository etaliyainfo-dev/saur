import Link from "next/link";

export type ProductCardItem = {
  slug: string;
  title: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  rating: number;
};

export function ProductCard({ product }: { product: ProductCardItem }) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-4 shadow-soft">
      <Link href={`/product/${product.slug}`}>
        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-brand-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="mt-4 space-y-2">
          <h3 className="text-base font-semibold text-brand-900">{product.title}</h3>
          <div className="flex items-center gap-2 text-sm text-brand-600">
            <span className="font-semibold text-brand-900">₹{product.price}</span>
            {product.compareAtPrice ? (
              <span className="text-xs line-through">₹{product.compareAtPrice}</span>
            ) : null}
          </div>
          <div className="text-xs text-brand-500">⭐ {product.rating.toFixed(1)} rating</div>
        </div>
      </Link>
      <button className="mt-4 w-full rounded-full bg-brand-900 px-4 py-2 text-sm font-semibold text-white">
        Quick Add
      </button>
    </div>
  );
}
