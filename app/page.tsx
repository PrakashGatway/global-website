import Homepage from "@/components/homepage";
import { baseUrl, serverInstance } from "./axiosInstance";

const getHomePageData = async () => {
  const res = await fetch(`${baseUrl}/page-information/slug/home`, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache", // 👈 important for dedupe + SEO
  });

  if (!res.ok) {
    throw new Error("Failed to fetch homepage data");
  }

  return res.json();
};



export async function generateMetadata() {
  const { data } = await getHomePageData();
  const seo = data.seoMeta;

  return {
    title: seo?.metaTitle?.trim() || "Home",
    description: seo?.metaDescription,
    keywords: seo?.metaKeywords,
    alternates: {
      canonical: `/${seo?.canonicalUrl || ""}`,
    },
    openGraph: {
      title: seo?.metaTitle,
      description: seo?.metaDescription,
      url: `/${seo?.canonicalUrl || ""}`,
      type: "website",
    },
  };
}



export default async function Home() {
  const { data } = await getHomePageData();
  const homePage = data.sections;

  
 

  const [destinationRes, imageRes , Faqres] = await Promise.all([
    serverInstance.get(
      "/page-information/navbar?isFeatured=true&type=destinations&limit=6"
    ),
    serverInstance.get("/testimonials?type=image"),
    serverInstance.get("/faqs/public/list?type=General"),

  ]);

    


  return (
    <Homepage
      homePage={homePage}
      destinationData={destinationRes.data.data}
      imageData={imageRes.data.data}
      Faqres = {Faqres.data.data}
    />
  );
}
