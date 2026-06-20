import { serverInstance } from "@/app/axiosInstance";
import CountryDetails from "@/components/country";
import {
  generateWebPageSchema,
  generateBreadcrumbSchema,
  generateFaqSchema,
} from "@/utils/schema";

/* ---------------- SEO ---------------- */
export async function generateMetadata({ params }: { params: any }) {
  const { slug } = await params;

  const res = await serverInstance.get(
    `/page-information/slug/${slug}`
  );

  const seo = res.data.data.seoMeta;

  return {
    title: seo?.metaTitle?.trim() || "Services",
    description: seo?.metaDescription,
    keywords: seo?.metaKeywords,
    alternates: {
      canonical: seo?.canonicalUrl,
    },
    openGraph: {
      title: seo?.metaTitle,
      description: seo?.metaDescription,
      url: seo?.canonicalUrl,
      type: "website",
    },
  };
}

export default async function Page({
  params,
}: {
  params: any;
}) {
  const { slug } = await params;

  const Pageres = await serverInstance.get(
    `/page-information/slug/${slug}`
  );

  const pageData = Pageres?.data?.data;

  const [
    Universityres,
    Faqres,
    imageRes,
    videoRes,
    countryres
  ] = await Promise.all([
    serverInstance.get(
      `/universities?limit=5&country=${pageData?.country?.code || ""
      }`
    ),
    serverInstance.get(
      `/faqs/public/list?type=${slug}&limit=15`
    ),
    serverInstance.get(
      "/testimonials?type=image&limit=15"
    ),
    serverInstance.get(
      "/testimonials?type=video&limit=6"
    ),
    serverInstance.get("/page-information/navbar?isFeatured=true&type=country"),

  ]);

  const filterCountry = countryres.data.data.filter((item) =>
    item.slug !== slug
  )




  const faqs = Faqres?.data?.data || [];

  const currentUrl = `https://ooshasglobal.com/${slug}`;

  const webPageSchema = generateWebPageSchema({
    title:
      pageData?.h1 ||
      pageData?.title ||
      pageData?.name,
    description:
      pageData?.seoMeta?.metaDescription || "",
    url: currentUrl,
  });

  const breadcrumbSchema =
    generateBreadcrumbSchema([
      {
        name: "Home",
        url: "https://ooshasglobal.com",
      },
      {
        name:
          pageData?.h1 ||
          pageData?.title ||
          pageData?.name,
      },
    ]);


  const faqSchema =
    faqs.length > 0
      ? generateFaqSchema(faqs)
      : null;

  console.log(breadcrumbSchema, "breadcrumbSchema");

  return (
    <>
      {/* WebPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema),
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema
          ),
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

      {pageData?.isFeatured == false && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Ooshas Global",
              url: currentUrl,
              description:
                pageData?.seoMeta?.metaDescription || "",
              address: {
                "@type": "PostalAddress",
                addressLocality: pageData?.city || "",
                addressRegion: pageData?.state || "",
                addressCountry: "IN",
              },
            }),
          }}
        />
      )}

      <div className="linkedClass list-style">
        <CountryDetails
          Universityres={
            Universityres?.data?.result
          }
          Faqres={faqs}
          pageData={pageData}
          imageData={imageRes.data.data}
          videoRes={videoRes.data}
          countryres={filterCountry}
        />
      </div>
    </>
  );
}