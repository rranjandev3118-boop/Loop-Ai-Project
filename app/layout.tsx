import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "LOOP — Customer Feedback Intelligence",
  description: "AI customer-feedback intelligence platform for modern SaaS teams",
  applicationName: "LOOP",
  authors: [{ name: "LOOP AI" }],
  openGraph: {
    title: "LOOP — Customer Feedback Intelligence",
    description:
      "AI customer-feedback intelligence platform for modern SaaS teams",
    siteName: "LOOP",
    type: "website",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0f172a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="h-full w-full scroll-smooth motion-reduce:scroll-auto"
      data-scroll-behavior="smooth"
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
      </head>
      <body className="min-h-screen w-full overflow-x-hidden bg-slate-100 text-slate-900 antialiased selection:bg-indigo-500/20 selection:text-indigo-900">
        {children}
      </body>
    </html>
  );
}
