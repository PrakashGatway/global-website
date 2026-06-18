import Homepage from "@/components/homepage";
import { baseUrl, serverInstance } from "./axiosInstance";
import { generateFaqSchema } from "@/utils/schema";

export const revalidate = 21600;

const generateHomeSchema = (data) => {
  const seo = data?.seoMeta || {};

  const baseUrl = "https://ooshasglobal.com";
  const currentUrl = "https://ooshasglobal.com/home";

  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      name: "Ooshas Global",
      url: baseUrl,
      "logo": "https://ooshasglobal.com/images/newlogo3.png",
      sameAs: [
        "https://www.facebook.com/share/18vb1scYJk",
        "https://www.instagram.com/ooshasglobal"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: seo?.metaTitle || "Ooshas Global",
      description: seo?.metaDescription || "",
      publisher: {
        "@id": `${baseUrl}/#organization`
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${baseUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    }
  ];
};

const getHomePageData = async () => {
  const res = await fetch(`${baseUrl}/page-information/slug/home`, {
    headers: {
      "Content-Type": "application/json",
    },
    next: {
      revalidate: 21600,
    },
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
      url: `${seo?.canonicalUrl || "https://ooshasglobal.com"}`,
      type: "website",
    },
  };
}



export default async function Home() {
  const { data } = await getHomePageData();
  const homePage = data.sections;

  const schemas = generateHomeSchema(data);

  const [destinationRes, countryRes, imageRes, Faqres, videoRes, blogres, unires] = await Promise.all([
    serverInstance.get(
      "/page-information/navbar?isFeatured=true&type=destinations&limit=6"
    ),
    serverInstance.get("/page-information/navbar?isFeatured=true&type=country&limit=8"),
    serverInstance.get("/testimonials?type=image&limit=15"),
    serverInstance.get("/faqs/public/list?type=General&limit=15"),
    serverInstance.get("/testimonials?type=video&limit=6"),
    serverInstance.get("/blogs?type=blog&limit=5"),
    serverInstance.get("/universities?limit=10")
  ]);

  const faqs = Faqres?.data?.data || [];


  const faqSchema =
    faqs.length > 0
      ? generateFaqSchema(faqs)
      : null;





  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}

      {/* FAQ Schema */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}

      <Homepage
        homePage={homePage}
        destinationData={destinationRes.data.data}
        countryData={countryRes.data.data}
        imageData={imageRes.data.data}
        Faqres={Faqres.data.data}
        videoRes={videoRes.data.data}
        blogres={blogres.data.data}
        unires={unires.data.result}
      />
    </>

  );
}
