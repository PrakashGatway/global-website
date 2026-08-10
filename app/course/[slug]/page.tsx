
// app/courses/[slug]/page.tsx

import { serverInstance } from "@/app/axiosInstance";
import NotFound from "@/app/not-found";
import CoursePageClient from "@/components/Course/coursePage";
import { Metadata } from "next";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getCourseData(slug: string) {
  const res = await serverInstance.get(`/accommodation/courses/${encodeURIComponent(slug)}`);
  const response = res.data;

  return response?.data || null;
}

/**
 * Dynamic SEO Metadata
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const course = await getCourseData(slug);

  if (!course) {
    return {
      title: "Course Not Found",
      description: "The requested course could not be found.",
    };
  }

  const seo = course.seoInfo;

  return {
    title:
      seo?.metaTitle ||
      course.title ||
      "Study Abroad Courses",

    description:
      seo?.metaDescription ||
      course.description ||
      "Explore study abroad courses and universities.",

    keywords: seo?.metaKeywords
      ? seo.metaKeywords
        .split(",")
        .map((keyword: string) => keyword.trim())
      : course.tags || [],

    openGraph: {
      title:
        seo?.metaTitle ||
        course.title ||
        "Study Abroad Courses",

      description:
        seo?.metaDescription ||
        course.description ||
        "",

      url: `/courses/${course.slug}`,

      images: course.coverImage
        ? [
          {
            url: course.coverImage,
            alt: course.title || "Course",
          },
        ]
        : [],

      type: "website",
    },

    twitter: {
      card: "summary_large_image",

      title:
        seo?.metaTitle ||
        course.title ||
        "Study Abroad Courses",

      description:
        seo?.metaDescription ||
        course.description ||
        "",

      images: course.coverImage
        ? [course.coverImage]
        : [],
    },

    alternates: {
      canonical: `/courses/${course.slug}`,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const courseData = await getCourseData(slug);
  const countries = await serverInstance.get("/page-information/navbar?isFeatured=true&type=country");

  if (!courseData) {
    return (
      <NotFound />
    );
  }

  return <CoursePageClient initialData={courseData} countries={countries.data.data} />;
}