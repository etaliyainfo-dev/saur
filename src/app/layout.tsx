import "@/styles/globals.css";
import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  metadataBase: new URL("https://pillaa.com"),
  title: {
    default: "Pillaa | Premium Black Leather Work Shoes for Men",
    template: "%s | Pillaa",
  },
  description:
    "Shop Pillaa men's black leather office shoes with cushioned soles, anti-slip grip, and all-day comfort. Built for 8-12 hour shifts in India.",
  openGraph: {
    title: "Pillaa | Premium Black Leather Work Shoes",
    description:
      "Premium black leather work shoes for office professionals, security guards, and hospitality staff. Comfort-first, anti-slip, durable.",
    url: "https://pillaa.com",
    siteName: "Pillaa",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pillaa | Premium Black Leather Work Shoes",
    description:
      "Premium black leather work shoes for long shifts in India. Cushioned sole, anti-slip, genuine leather.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://pillaa.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}');
`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
fbq('track', 'PageView');`,
          }}
        />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
