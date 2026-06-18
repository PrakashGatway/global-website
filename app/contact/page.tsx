import ContactUsPage from "@/components/contactUs";
import { serverInstance } from "../axiosInstance";


export const dynamic = "force-dynamic";
export const revalidate = 0;


const stripHtml = (text = "") =>
  String(text)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const generateContactPageSchema = (pageData: any) => ({
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name:
    pageData?.h1 ||
    pageData?.pageTitle ||
    "Contact Us",
  description: stripHtml(
    pageData?.seoMeta?.metaDescription || ""
  ),
  url: "https://ooshasglobal.com/contact",
  mainEntity: {
    "@type": "Organization",
    name: "Ooshas Global",
    url: "https://ooshasglobal.com",
  },
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

export async function generateMetadata() {
  try {
    const res = await serverInstance.get("page-information/slug/contact");
    const pageData = res?.data?.data || {};


    const seo = pageData?.seoMeta || {};

    return {
      title:
        seo.metaTitle ||
        "Contact Us | Get in Touch | Your Company Name",

      description:
        seo.metaDescription ||
        "Contact us for inquiries, support, or business opportunities. We are here to help you.",

      keywords:
        seo.metaKeywords ||
        "contact us, support, help, customer service, get in touch",

      alternates: {
        canonical:
          seo.canonicalUrl ||
          "https://ooshasglobal.com/contact",
      },

      openGraph: {
        title: seo.metaTitle || "Contact Us",
        description:
          seo.metaDescription ||
          "Reach out to us for any queries or support.",
        url: "https://ooshasglobal.com/contact",
        siteName: "Ooshas Global",
        type: "website",
      },

      twitter: {
        card: "summary_large_image",
        title: seo.metaTitle || "Contact Us",
        description:
          seo.metaDescription ||
          "Reach out to us anytime."
      },

      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    return {
      title: "Contact Us",
      description: "Get in touch with us",
    };
  }
}

export default async function page() {

  const res = await serverInstance.get("page-information/slug/contact")
  const Faqres = await serverInstance.get("/faqs/public/list?type=contact")


  const pageData = res.data.data;
  const faqs = Faqres.data.data || [];

  const contactSchema =
    generateContactPageSchema(pageData);

  const faqSchema =
    faqs.length > 0
      ? generateFaqSchema(faqs)
      : null;


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactSchema),
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

      <ContactUsPage contactData={res.data.data} Faqres={Faqres.data.data} />
    </>
  )
}