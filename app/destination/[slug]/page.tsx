import { serverInstance } from "@/app/axiosInstance";
import CountryDetails from "@/components/country";




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


export default async function Page({params}){
  const {slug} = await params


      const Universityres = await serverInstance.get("/universities?location_alias=ivy-league")

  const Faqres = await  serverInstance.get(`/faqs/public/list?type=${slug}&limit=15`)
  const imageRes = await serverInstance.get("/testimonials?type=image&limit=6")
  


  const Pageres =   await serverInstance.get(`/page-information/slug/${slug}`)

  const videoRes = await serverInstance.get("/testimonials?type=video&limit=6")

  
  






    return(
        <CountryDetails Universityres = {Universityres?.data?.result} Faqres = {Faqres.data.data} pageData={Pageres?.data?.data} imageData= {imageRes.data.data} videoRes = {videoRes.data}  />
    )
}