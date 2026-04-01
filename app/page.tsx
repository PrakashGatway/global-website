import Homepage from "@/components/homepage";
import { baseUrl, serverInstance } from "./axiosInstance";

const getHomePageData = async () => {
  const res = await fetch(`${baseUrl}/page-information/slug/home`, {
  headers: {
    "Content-Type": "application/json",
  }
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
      url: `${seo?.canonicalUrl || "https://ooshasglobal.com/home/"}`,
      type: "website",
    },
  };
}



export default async function Home() {
  const { data } = await getHomePageData();
  const homePage = data.sections;


  
 

  const [destinationRes, imageRes  , Faqres, videoRes,blogres,unires] = await Promise.all([
    serverInstance.get(
      "/page-information/navbar?isFeatured=true&type=destinations&limit=6"
    ),
    serverInstance.get("/testimonials?type=image&limit=6"),
    serverInstance.get("/faqs/public/list?type=General&limit=15"),
    serverInstance.get("/testimonials?type=video&limit=6"),
    serverInstance.get("/blogs?type=blog&limit=5"),
    serverInstance.get("/universities?limit=10")


  ]);

    


  return (
    <Homepage
      homePage={homePage}
      destinationData={destinationRes.data.data}
      imageData={imageRes.data.data}
      Faqres = {Faqres.data.data}
      videoRes={videoRes.data.data}
      blogres={blogres.data.data}
      unires={unires.data.result}
   
    />
  );
}
