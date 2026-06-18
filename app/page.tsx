import Homepage from "@/components/homepage";
import { baseUrl, serverInstance } from "./axiosInstance";
import { generateFaqSchema } from "@/utils/schema";

export const revalidate = 21600;

// 1. Updated Schema Generator to use a unified @graph array
const generateHomeSchema = (data) => {
  const seo = data?.seoMeta || {};
  const primaryUrl = "https://ooshasglobal.com";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${primaryUrl}/#organization`,
        "name": "Ooshas Global",
        "url": primaryUrl,
        "logo": {
          "@type": "ImageObject",
          "url": "https://ooshasglobal.com/images/newlogo3.png",
          "caption": "Ooshas Global Logo"
        },
        "sameAs": [
          "https://www.facebook.com/share/18vb1scYJk",
          "https://www.instagram.com/ooshasglobal"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${primaryUrl}/#website`,
        "url": primaryUrl,
        "name": seo?.metaTitle || "Ooshas Global",
        "description": seo?.metaDescription || "",
        "publisher": {
          "@id": `${primaryUrl}/#organization`
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${primaryUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebPage",
        "@id": `${primaryUrl}/#webpage`,
        "url": primaryUrl,
        "name": seo?.metaTitle || "Ooshas Global",
        "description": seo?.metaDescription || "",
        "isPartOf": {
          "@id": `${primaryUrl}/#website`
        },
        "about": {
          "@id": `${primaryUrl}/#organization`
        }
      }
    ]
  };
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

  const mainSchema = generateHomeSchema(data);

  const [destinationRes, countryRes, imageRes, Faqres, videoRes, blogres, unires] = await Promise.all([
    serverInstance.get("/page-information/navbar?isFeatured=true&type=destinations&limit=6"),
    serverInstance.get("/page-information/navbar?isFeatured=true&type=country&limit=8"),
    serverInstance.get("/testimonials?type=image&limit=15"),
    serverInstance.get("/faqs/public/list?type=General&limit=15"),
    serverInstance.get("/testimonials?type=video&limit=6"),
    serverInstance.get("/blogs?type=blog&limit=5"),
    serverInstance.get("/universities?limit=10")
  ]);

  const faqs = Faqres?.data?.data || [];
  const faqSchema = faqs.length > 0 ? generateFaqSchema(faqs) : null;

  return (
    <>
      {/* Main Graph Schema (Organization + Website) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(mainSchema),
        }}
      />

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