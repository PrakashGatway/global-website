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


export const STUDY_LEVELS = [
  {
    label: "High School (11th-12th)",
    value: "High School (11th-12th)",
  },
  {
    label: "UG Diploma/ Certificate/ Associate Degree",
    value: "UG Diploma/ Certificate/ Associate Degree",
  },
  {
    label: "Undergraduate",
    value: "Undergraduate",
  },
  {
    label: "PG Diploma /Certificate",
    value: "PG Diploma /Certificate",
  },
  {
    label: "Postgraduate",
    value: "Postgraduate",
  },
  {
    label: "UG+PG (Accelerated) Degree",
    value: "UG+PG (Accelerated) Degree",
  },
  {
    label: "PhD",
    value: "PhD",
  },
  {
    label: "Short-term/Summer Programs",
    value: "Short-term/Summer Programs",
  },
  {
    label: "Pathway Programs (UG)",
    value: "Pathway Programs (UG)",
  },
  {
    label: "Pathway Programs (PG)",
    value: "Pathway Programs (PG)",
  },
  {
    label: "Semester Study Abroad",
    value: "Semester Study Abroad",
  },
  {
    label: "Twinning Programmes (UG)",
    value: "Twinning Programmes (UG)",
  },
  {
    label: "Twinning Programmes (PG)",
    value: "Twinning Programmes (PG)",
  },
  {
    label: "English Language Program",
    value: "English Language program (ESL,IEP,ELP)",
  },
  {
    label: "Online Programmes / Distance Learning",
    value: "Online Programmes / Distance Learning",
  },
  {
    label: "Hybrid",
    value: "Hybrid",
  },
  {
    label: "Grades Below 10th",
    value: "Grades Below 10th",
  },
];