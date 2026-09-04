import type { MetadataRoute } from "next";

const basePath = process.env.GITHUB_ACTIONS === "true" ? "/office-playground" : "";
const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://officeplayground.local";

export default function Robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${BASE_URL}${basePath}/sitemap.xml`,
  };
}
