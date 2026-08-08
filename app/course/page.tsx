// app/courses/page.tsx

import CourseListingPage from "@/components/Course/listingPage";
import { serverInstance } from "../axiosInstance";

async function getCourses(page: number = 1) {
  try {
    const res = await serverInstance.get(`/accommodation/courses?page=${page}&limit=9`);
    
    const data = await res.data;

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