import { serverInstance } from "@/app/axiosInstance";
import ServicePage from "@/components/ServicePage";


/* ---------------- SEO ---------------- */
export async function generateMetadata() {
  const res = await serverInstance.get("/page-information/slug/test-preparation");
  const seo = res.data.data.seoMeta;

  return {
    title: seo?.metaTitle?.trim() || "Services",
    description: seo?.metaDescription,
    keywords: seo?.metaKeywords,
    alternates: {
      canonical: `/${seo?.canonicalUrl || "service"}`
    },
    openGraph: {
      title: seo?.metaTitle,
      description: seo?.metaDescription,
      url: `/${seo?.canonicalUrl || "service"}`,
      type: "website"
    }
  };
}

/* ---------------- Page ---------------- */
export default async function Page({params}) {
    const { slug } = await params;
  const [serviceRes, testimonialImgRes] = await Promise.all([
    serverInstance.get(`/page-information/slug/${slug}`),
    serverInstance.get("/testimonials?type=image"),
  ]);

  return (
    <ServicePage
      serviceData={serviceRes.data.data}
      testimonialimg={testimonialImgRes.data.data}
    />
  );
}
