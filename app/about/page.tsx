import AboutUsPage from "@/components/AboutPage";
import { serverInstance } from "../axiosInstance";

/* ---------------- SEO ---------------- */
export async function generateMetadata() {
  const res = await serverInstance.get("/page-information/slug/about");
  const seo = res.data.data.seoMeta;

  return {
    title: seo?.metaTitle || "About Us",
    description: seo?.metaDescription,
    keywords: seo?.metaKeywords,
    alternates: {
      canonical: `/${seo?.canonicalUrl || "about"}`
    },
    openGraph: {
      title: seo?.metaTitle,
      description: seo?.metaDescription,
      url: `/${seo?.canonicalUrl || "about"}`,
      type: "website"
    }
  };
}

/* ---------------- Page ---------------- */
export default async function Page() {
  const res = await serverInstance.get("/page-information/slug/about");

  return <AboutUsPage aboutData={res.data.data} />;
}
