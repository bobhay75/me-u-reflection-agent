import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://me-u-reflection-agent.thebobsomest1.chatgpt.site";
  return ["", "/about", "/privacy", "/terms", "/safety"].map((path) => ({
    url: `${base}${path || "/"}`,
    changeFrequency: path ? "yearly" : "monthly",
    priority: path ? 0.5 : 1,
  }));
}
