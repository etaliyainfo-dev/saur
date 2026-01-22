import Link from "next/link";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/mens-formal-shoes", label: "Men's Formal" },
  { href: "/security-guard-shoes", label: "Security Guard" },
  { href: "/office-wear-shoes", label: "Office Wear" },
  { href: "/account", label: "Account" },
];

export function Navbar() {
  return (
    <header className="border-b border-brand-100 bg-white/90 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="text-xl font-semibold tracking-tight text-brand-900">
          Pillaa
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-brand-600 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brand-900">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="rounded-full border border-brand-200 px-4 py-2 text-sm font-medium text-brand-700"
          >
            Cart
          </Link>
          <Link
            href="/shop"
            className="hidden rounded-full bg-brand-900 px-4 py-2 text-sm font-semibold text-white md:inline-flex"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </header>
  );
}
