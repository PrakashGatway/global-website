export const generateWebPageSchema = ({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: title,
  description,
  url,
});

const stripHtml = (html = "") =>
  html.replace(/<[^>]*>/g, "").trim();

export const generateBreadcrumbSchema = (
  breadcrumbs: {
    name: string;
    url?: string;
  }[]
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    ...(item.url ? { item: item.url } : {}),
  })),
});

export const generateFaqSchema = (faqs: any[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: stripHtml(faq.question),
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});