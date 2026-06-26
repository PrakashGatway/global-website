import { serverInstance } from "@/app/axiosInstance";

import BlogDetailsPage from "@/components/blogDetails";
import { notFound } from "next/navigation";

// Define types
interface BlogSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

interface Blog {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  seo: BlogSEO;
  tags: string[];
  status: string;
  isFeatured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const stripHtml = (text = "") =>
  String(text)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const articleSchema = (blog: any) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: blog.title,
  description:
    blog.seo?.metaDescription ||
    stripHtml(blog.shortDescription || ""),
  image: [blog.coverImage],
  datePublished: blog.createdAt,
  dateModified: blog.updatedAt || blog.createdAt,
  author: {
    "@type": "Organization",
    name: "Ooshas Global",
  },
  publisher: {
    "@type": "Organization",
    name: "Ooshas Global",
    logo: {
      "@type": "ImageObject",
      url: "https://ooshasglobal.com/logo.png", // replace with actual logo
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `https://ooshasglobal.com/blog/${blog.slug}`,
  },
});

const breadcrumbSchema = (blog: any) => ({
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
      name: "Blogs",
      item: "https://ooshasglobal.com/blogs",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: blog.title,
      item: `https://ooshasglobal.com/blog/${blog.slug}`,
    },
  ],
});

const faqSchema = (faqs: any[]) => ({
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

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const res = await serverInstance.get(`/blogs/${slug}`);
    const blog = res.data.data;

    const createdDate = new Date(blog.createdAt);

    // ✅ Fixed cutoff date (10 Jan 2026)
    const cutoffDate = new Date("2026-04-10");

    // ❗ condition: blog older than cutoff → noindex
    const noIndex = createdDate < cutoffDate;

    return {
      title: blog.seo?.metaTitle || blog.title,
      description: blog.seo?.metaDescription || blog.shortDescription,
      keywords: blog.seo?.keywords || [],
      alternates: {
        canonical: `https://ooshasglobal.com/blog/${blog.slug}`,
      },
      robots: {
        index: true,
        follow: true,
      },
      authors: [
        {
          name: "Sakshi Taneja",
          url: "https://ooshasglobal.com/author/sakshi-taneja",
        },
      ],
      creator: "Sakshi Taneja",
      publisher: "Ooshas Global",
      openGraph: {
        title: blog.seo?.metaTitle || blog.title,
        description: blog.seo?.metaDescription || blog.shortDescription,
        images: [blog.coverImage],
      },
    };
  } catch (error) {
    return {
      title: "Blog Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function Page({ params }) {
  const { slug } = await params;
  let blog: Blog;
  try {
    const res = await serverInstance.get(`/blogs/${slug}`);
    blog = res.data.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return notFound();
  }

  // ===== Latest Blogs =====
  const latestRes = await serverInstance.get("/blogs?limit=4&sort=-createdAt");

  const latestBlogs = latestRes.data.data;

  const res = await serverInstance.get("/blogs/categories?limit=50");
  const blogCategory = res.data.data;

  // get all blogs ordered by date
  const navRes = await serverInstance.get("/blogs?type=blog");

  const allBlogs = navRes.data.data;

  const uniblog = await serverInstance.get(
    `/universities?limit=5&country=${blog?.country?.code}`,
  );

  const resvideo = await serverInstance.get("/testimonials?type=video&limit=6");
  const resimage = await serverInstance.get(
    "/testimonials?type=image&limit=15",
  );

  const articleJsonLd = articleSchema(blog);

  const breadcrumbJsonLd = breadcrumbSchema(blog);

  const faqJsonLd =
    blog?.faq.length > 0
      ? faqSchema(blog?.faq)
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd),
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      {/* FAQ Schema */}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd),
          }}
        />
      )}
      <BlogDetailsPage
        latestBlogs={latestBlogs}
        blog={blog}
        blogCategory={blogCategory}
        allBlogs={allBlogs}
        uniblog={uniblog.data}
        imageData={resimage.data.data}
        videoData={resvideo.data.data}
      />
    </>
  );
}
