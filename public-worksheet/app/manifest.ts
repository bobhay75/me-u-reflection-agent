import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Me+U Private Reflection Worksheet",
    short_name: "Me+U",
    description: "A local-only five-lens reflection worksheet from Project Unveiled.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f0e4",
    theme_color: "#17211d",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
