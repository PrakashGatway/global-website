import ContactUsPage from "@/components/contactUs";
import { serverInstance } from "../axiosInstance";

// ✅ Dynamic SEO
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

  return (
    <>
      <ContactUsPage contactData={res.data.data} Faqres={Faqres.data.data} />
    </>
  )
}