import { serverInstance } from "@/app/axiosInstance";
import NotFound from "@/app/not-found";
import ServicePage from "@/components/ServicePage";
import { redirect } from "next/navigation";



/* ---------------- SEO ---------------- */
export async function generateMetadata({params}) {
  const {slug} = await params
  const res = await serverInstance.get(`/page-information/slug/${slug}`);
  const seo = res.data.data.seoMeta;

  return {
    title: seo?.metaTitle?.trim() || "Services",
    description: seo?.metaDescription,
    keywords: seo?.metaKeywords,
    alternates: {
      canonical: `${seo?.canonicalUrl || "service"}`
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

    if(slug==="service"){
      return redirect("/service")
    }


  const [serviceRes, testimonialImgRes , Faqres] = await Promise.all([
    serverInstance.get(`/page-information/slug/${slug}`),
    serverInstance.get("/testimonials?type=image"),
        serverInstance.get(`/faqs/public/list?type=${slug}`),

  ]);

  return (
    <ServicePage
      serviceData={serviceRes.data.data}
      testimonialimg={testimonialImgRes.data.data}
      Faqres = {Faqres.data.data}
    />
  );
}
