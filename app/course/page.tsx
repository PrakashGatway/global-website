// app/courses/page.tsx

import CourseListingPage from "@/components/Course/listingPage";

async function getCourses(page: number = 1) {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  try {
    const res = await fetch(
      `${API_BASE_URL}/courses?page=${page}&limit=9`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch courses");
    }

    const data = await res.json();

    return {
      courses: data.courses || [],
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || 1,
    };
  } catch (error) {
    console.error("Error fetching courses:", error);

    return {
      courses: [],
      totalPages: 1,
      currentPage: 1,
    };
  }
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;

  const page = Math.max(
    parseInt(params.page || "1", 10) || 1,
    1
  );

  const {
    courses,
    totalPages,
    currentPage,
  } = await getCourses(page);

  return (
    <CourseListingPage
      initialCourses={courses}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  );
}