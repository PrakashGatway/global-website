import { serverInstance } from "@/app/axiosInstance";
import CountryDetails from "@/components/country";




/* ---------------- SEO ---------------- */
export async function generateMetadata({ params }: { params: any }) {
  const { slug } = await params
  const res = await serverInstance.get(`/page-information/slug/${slug}`);
  const seo = res.data.data.seoMeta;

  return {
    title: seo?.metaTitle?.trim() || "Services",
    description: seo?.metaDescription,
    keywords: seo?.metaKeywords,
    alternates: {
      canonical: `${seo?.canonicalUrl}`
    },
    openGraph: {
      title: seo?.metaTitle,
      description: seo?.metaDescription,
      url: `/${seo?.canonicalUrl || ""}`,
      type: "website"
    }
  };
}


export default async function Page({ params }: { params: any }) {
  const { slug } = await params


  const Pageres = await serverInstance.get(`/page-information/slug/${slug}`);
  

  const [
    Universityres,
    Faqres,
    imageRes,
    videoRes
  ] = await Promise.all([
    serverInstance.get(`/universities?limit=5&country=${Pageres?.data?.data?.country?.code || "" }`),
    serverInstance.get(`/faqs/public/list?type=${slug}&limit=15`),
    serverInstance.get("/testimonials?type=image&limit=15"),
    serverInstance.get("/testimonials?type=video&limit=6"),
  ]);

  return (
    <CountryDetails Universityres={Universityres?.data?.result} Faqres={Faqres.data.data} pageData={Pageres?.data?.data} imageData={imageRes.data.data} videoRes={videoRes.data} />
  )
}