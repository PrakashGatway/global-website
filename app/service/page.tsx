import ServicePage from "@/components/ServicePage";
import { serverInstance } from "../axiosInstance";


/* ---------------- SEO ---------------- */
export async function generateMetadata() {
  const res = await serverInstance.get("/page-information/slug/service");
  const seo = res.data.data.seoMeta;

  return {
    title: seo?.metaTitle?.trim() || "Services",
    description: seo?.metaDescription,
    keywords: seo?.metaKeywords,
    alternates: {
      canonical: `${seo?.canonicalUrl || `https://ooshasglobal.com/service/`}`
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
export default async function Page() {
  const [serviceRes, testimonialImgRes , galleryRes , Faqres] = await Promise.all([
    serverInstance.get("/page-information/slug/service"),
    serverInstance.get("/testimonials?type=image"),
    serverInstance.get(`/galleries/public/list?type=visa`),
    serverInstance.get("/faqs/public/list?type=General&limit=15"),


  ]);
  

  return (
    <ServicePage
      serviceData={serviceRes.data.data}
      testimonialimg={testimonialImgRes.data.data}
      galleryData = {galleryRes.data.data}
      Faqres = {Faqres.data.data}
    />
  );
}
