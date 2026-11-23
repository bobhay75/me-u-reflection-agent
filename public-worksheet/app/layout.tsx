import type { Metadata } from "next";
import "./globals.css";

const siteOrigin = "https://me-u-reflection-agent.thebobsomest1.chatgpt.site";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: "Me+U | Private Five-Lens Reflection Worksheet",
  description:
    "A free local-only worksheet from Project Unveiled for separating observations, feelings, inferences, unknowns, boundaries, and next steps.",
  alternates: { canonical: "/" },
  authors: [{ name: "Project Unveiled / Bobsome1" }],
  creator: "Project Unveiled / Bobsome1",
  publisher: "Project Unveiled / Bobsome1",
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Me+U | Private Five-Lens Reflection Worksheet",
    description: "Slow the moment down. Separate what you observed from what you inferred—without uploading your story.",
    url: "/",
    siteName: "Me+U by Project Unveiled",
    type: "website",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Me+U equals three: the relationship" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Me+U | Private Five-Lens Reflection Worksheet",
    description: "A free local-only worksheet for clearer choices in tense moments.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
