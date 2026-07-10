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

    robots: {
      index: true,
      follow: true,
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

  const [pageRes, caseRes, imageRes, Faqres, Unires, Unicategory, flatres] = await Promise.all([
    serverInstance.get(`/page-information/slug/${slug}`),
    serverInstance.get("/testimonials?type=caseStudy"),
    serverInstance.get("/testimonials?type=image"),
    serverInstance.get(`/faqs/public/list?type=${slug}`),
    serverInstance.get(`/universities?location_alias=${slug}`),
    serverInstance.get(`/blogs?catslug=${slug}`),
    serverInstance.get(`/universities/flat?${slug}&limit=10`),
  ]);

  return (
    <UniversityPage
      data={pageRes.data.data}
      caseStudy={caseRes.data.data}
      imageRes={imageRes.data.data}
      Faqres={Faqres.data.data}
      Unires={Unires.data.result}
      Unicategory={Unicategory.data.data}
      flatres={flatres.data.data}
    />
  );
}
