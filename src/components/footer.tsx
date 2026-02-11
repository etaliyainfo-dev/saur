import Link from "next/link";

const policyLinks = [
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/return-refund", label: "Return & Refund" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
  { href: "/size-guide", label: "Size Guide" },
];

export function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-brand-50">
      <div className="container grid gap-8 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold text-brand-900">Pillaa</h3>
          <p className="mt-2 text-sm text-brand-600">
            Premium black leather work shoes for India. Built for comfort across long shifts.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase text-brand-700">Policies</h4>
          <ul className="mt-3 space-y-2 text-sm text-brand-600">
            {policyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-brand-900">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase text-brand-700">Contact</h4>
          <p className="mt-3 text-sm text-brand-600">
            Email: support@pillaa.com
            <br />
            Phone: +91 90000 12345
            <br />
            Mon-Sat, 10am - 7pm IST
          </p>
        </div>
      </div>
      <div className="border-t border-brand-100 py-4 text-center text-xs text-brand-500">
        © {new Date().getFullYear()} Pillaa. All rights reserved.
      </div>
    </footer>
  );
}
