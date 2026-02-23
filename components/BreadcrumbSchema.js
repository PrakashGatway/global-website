export default function BreadcrumbSchema({ params }) {

  const pathArray = Object.values(params || []);

  const breadcrumbs = pathArray.map((segment, index) => {
    const href = "/" + pathArray.slice(0, index + 1).join("/");

    return {
      "@type": "ListItem",
      position: index + 2,
      name: String(segment)
        .replace(/-/g, " ")
        .replace(/\b\w/g, l => l.toUpperCase()),
      item: `https://ooshasglobal.com${href}`,
    };
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://ooshasglobal.com/",
      },
      ...breadcrumbs,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}