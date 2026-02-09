import { serverInstance } from "@/app/axiosInstance";
import UniversityPage from "@/components/Universitypage/university";

/* ---------------- SEO ---------------- */
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const res = await serverInstance.get(
    `/page-information/slug/${slug}`
  );

  const seo = res.data.data.seoMeta;

  return {
    title: seo?.metaTitle?.trim() || slug,
    description: seo?.metaDescription,
    keywords: seo?.metaKeywords,
    alternates: {
      canonical: `/${seo?.canonicalUrl || `universities/${slug}`}`,
    },
    openGraph: {
      title: seo?.metaTitle,
      description: seo?.metaDescription,
      url: `/${seo?.canonicalUrl || `universities/${slug}`}`,
      type: "website",
    },
  };
}

/* ---------------- Page ---------------- */
export default async function Page({ params }) {
  const { slug } = await params;

  const [pageRes, caseRes] = await Promise.all([
    serverInstance.get(`/page-information/slug/${slug}`),
    serverInstance.get("/testimonials?type=caseStudy"),
  ]);

  return (
    <UniversityPage
      data={pageRes.data.data}
      caseStudy={caseRes.data.data}
    />
  );
}
