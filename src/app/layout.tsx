import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chamika Pathirage — Full Stack Software & UX Engineer",
  description:
    "Portfolio of Chamika Pathirage, a Full Stack Software and UX Engineer specializing in modern web, mobile, UI/UX, and serverless applications.",
  keywords: [
    "Full Stack Engineer",
    "UX Engineer",
    "Next.js",
    "React",
    "TypeScript",
    "Mobile Development",
    "Sri Lanka",
    "Chamika Pathirage",
  ],
  authors: [{ name: "Chamika Pathirage", url: "https://chamika.dev" }],
  creator: "Chamika Pathirage",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chamika.dev",
    title: "Chamika Pathirage — Full Stack Software & UX Engineer",
    description:
      "Portfolio of Chamika Pathirage, a Full Stack Software and UX Engineer specializing in modern web, mobile, UI/UX, and serverless applications.",
    siteName: "Chamika Pathirage Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chamika Pathirage — Full Stack Software & UX Engineer",
    description:
      "Portfolio of Chamika Pathirage, a Full Stack Software and UX Engineer specializing in modern web, mobile, UI/UX, and serverless applications.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
