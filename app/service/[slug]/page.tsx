import { serverInstance } from "@/app/axiosInstance";
import NotFound from "@/app/not-found";
import ServicePage from "@/components/Servicepage/ServicePage";
import { log } from "console";
import { redirect } from "next/navigation";


const stripHtml = (text = "") =>
  String(text)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const generateServiceSchema = (service: any, slug: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name:
    service?.h1 ||
    service?.pageTitle ||
    service?.title,
  description: stripHtml(
    service?.seoMeta?.metaDescription ||
    service?.shortDescription ||
    ""
  ),
  url: `https://ooshasglobal.com/${slug}`,
  provider: {
    "@type": "Organization",
    name: "Ooshas Global",
    url: "https://ooshasglobal.com",
  },
});

const generateBreadcrumbSchema = (
  service: any,
  slug: string
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://ooshasglobal.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Services",
      item: "https://ooshasglobal.com/service",
    },
    {
      "@type": "ListItem",
      position: 3,
      name:
        service?.h1 ||
        service?.pageTitle ||
        service?.title,
      item: `https://ooshasglobal.com/${slug}`,
    },
  ],
});

const generateFaqSchema = (faqs: any[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: stripHtml(faq.question),
    acceptedAnswer: {
      "@type": "Answer",
      text: stripHtml(faq.answer),
    },
  })),
});

/* ---------------- SEO ---------------- */
export async function generateMetadata({ params }) {
  const { slug } = await params
  const res = await serverInstance.get(`/page-information/slug/${slug}?type=service`);
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
export default async function Page({ params }) {

  const { slug } = await params;

  if (slug === "service") {
    return redirect("/service")
  }


  const [serviceRes, testimonialImgRes, Faqres, videores, scholarshipres] = await Promise.all([
    serverInstance.get(`/page-information/slug/${slug}?type=service`),
    serverInstance.get("/testimonials?type=image"),
    serverInstance.get(`/faqs/public/list?type=${slug}&limit=15`),
    serverInstance.get("/testimonials?type=video&limit=6"),
    serverInstance.get(`/scholarships/public/list`)

  ]);

  const serviceData = serviceRes.data.data;
  const faqs = Faqres.data.data || [];

  const serviceSchema = generateServiceSchema(
    serviceData,
    slug
  );

  const breadcrumbSchema =
    generateBreadcrumbSchema(
      serviceData,
      slug
    );

  const faqSchema =
    faqs.length > 0
      ? generateFaqSchema(faqs)
      : null;


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema
          ),
        }}
      />

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              faqSchema
            ),
          }}
        />
      )}
      <ServicePage
        serviceData={serviceRes.data.data}
        testimonialimg={testimonialImgRes.data.data}
        Faqres={Faqres.data.data}
        videoRes={videores.data.data}
        scholarshipres={scholarshipres.data.data}
      />
    </>

  );
}
